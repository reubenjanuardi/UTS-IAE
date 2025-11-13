from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_restx import Api, Resource, fields
from models import db, Transaction
from config import Config
import requests
from datetime import datetime
import uuid
from functools import wraps

app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
CORS(app)

# Initialize API documentation
api = Api(app, doc='/api-docs/', version='1.0',
          title='Transaction Service API',
          description='Transaction Service untuk E-Wallet System')

# Authentication decorator - validate X-User headers from API Gateway
def require_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_id = request.headers.get('X-User-Id')
        if not user_id:
            return jsonify({'success': False, 'error': 'Unauthorized: No user info'}), 401
        return f(*args, **kwargs)
    return decorated_function

# Define data models
transaction_model = api.model('Transaction', {
    'id': fields.Integer(description='Transaction ID'),
    'from_user_id': fields.Integer(description='From User ID'),
    'to_user_id': fields.Integer(description='To User ID'),
    'amount': fields.Float(description='Transaction amount'),
    'type': fields.String(description='Transaction type'),
    'description': fields.String(description='Description'),
    'status': fields.String(description='Transaction status'),
    'reference_id': fields.String(description='Reference ID'),
    'created_at': fields.DateTime(description='Creation timestamp')
})

transaction_input = api.model('TransactionInput', {
    'from_user_id': fields.Integer(required=True, description='From User ID'),
    'to_user_id': fields.Integer(required=True, description='To User ID'),
    'amount': fields.Float(required=True, description='Amount'),
    'type': fields.String(required=True, description='Transaction type'),
    'description': fields.String(description='Description')
})

# Define namespaces
transactions_ns = api.namespace('transactions', description='Transaction operations')

def notify_transaction(user_id, title, message):
    """Notify user about transaction"""
    try:
        requests.post(
            f'{Config.NOTIFICATION_SERVICE_URL}/internal/notifications',
            json={
                'user_id': user_id,
                'title': title,
                'message': message,
                'type': 'transaction'
            }
        )
    except:
        pass  # Silent fail for notification

@transactions_ns.route('/')
class TransactionList(Resource):
    @transactions_ns.doc('list_transactions')
    @require_auth
    def get(self):
        """Get all transactions"""
        transactions = Transaction.query.all()
        return {'success': True, 'data': [t.to_dict() for t in transactions]}
    
    @transactions_ns.doc('create_transaction')
    @transactions_ns.expect(transaction_input)
    @require_auth
    def post(self):
        """Create a new transaction"""
        data = request.get_json()
        
        from_user_id = data.get('from_user_id')
        to_user_id = data.get('to_user_id')
        amount = data.get('amount')
        trans_type = data.get('type', 'transfer')
        
        # Validate amount
        if amount <= 0:
            return {'success': False, 'error': 'Amount must be greater than 0'}, 400
        
        # Get sender wallet balance
        try:
            wallet_response = requests.get(
                f'{Config.WALLET_SERVICE_URL}/internal/wallets/user/{from_user_id}/balance'
            )
            if not wallet_response.json().get('success'):
                return {'success': False, 'error': 'Sender wallet not found'}, 404
            
            sender_balance = wallet_response.json().get('balance')
            if sender_balance < amount:
                return {'success': False, 'error': 'Insufficient balance'}, 400
        except:
            return {'success': False, 'error': 'Unable to check balance'}, 500
        
        # Deduct from sender
        try:
            requests.put(
                f'{Config.WALLET_SERVICE_URL}/internal/wallets/user/{from_user_id}/balance',
                json={'operation': 'subtract', 'amount': amount}
            )
        except:
            return {'success': False, 'error': 'Failed to deduct balance'}, 500
        
        # Add to receiver (if transfer type)
        if trans_type == 'transfer':
            try:
                requests.put(
                    f'{Config.WALLET_SERVICE_URL}/internal/wallets/user/{to_user_id}/balance',
                    json={'operation': 'add', 'amount': amount}
                )
            except:
                # Rollback sender balance
                requests.put(
                    f'{Config.WALLET_SERVICE_URL}/internal/wallets/user/{from_user_id}/balance',
                    json={'operation': 'add', 'amount': amount}
                )
                return {'success': False, 'error': 'Failed to add balance to receiver'}, 500
        
        # Create transaction record
        transaction = Transaction(
            from_user_id=from_user_id,
            to_user_id=to_user_id if trans_type == 'transfer' else from_user_id,
            amount=amount,
            type=trans_type,
            description=data.get('description', f'{trans_type} transaction'),
            reference_id=str(uuid.uuid4()),
            status='completed'
        )
        
        db.session.add(transaction)
        db.session.commit()
        
        # Send notifications
        if trans_type == 'transfer':
            notify_transaction(from_user_id, 'Transfer Sent', f'Transfer of {amount} sent successfully')
            notify_transaction(to_user_id, 'Transfer Received', f'You received {amount} from user')
        else:
            notify_transaction(from_user_id, f'{trans_type.capitalize()} Completed', f'{trans_type.capitalize()} of {amount} completed')
        
        return {'success': True, 'data': transaction.to_dict()}, 201

@transactions_ns.route('/<int:id>')
class TransactionResource(Resource):
    @transactions_ns.doc('get_transaction')
    @require_auth
    def get(self, id):
        """Get transaction by ID"""
        transaction = Transaction.query.get(id)
        if not transaction:
            return {'success': False, 'error': 'Transaction not found'}, 404
        return {'success': True, 'data': transaction.to_dict()}

@transactions_ns.route('/user/<int:user_id>')
class UserTransactions(Resource):
    @transactions_ns.doc('get_user_transactions')
    @require_auth
    def get(self, user_id):
        """Get transactions for user"""
        transactions = Transaction.query.filter(
            (Transaction.from_user_id == user_id) | (Transaction.to_user_id == user_id)
        ).order_by(Transaction.created_at.desc()).all()
        
        return {'success': True, 'data': [t.to_dict() for t in transactions]}

# Health check
@app.route('/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'service': 'transaction-service',
        'database': 'connected' if db.engine else 'disconnected'
    })

def create_tables():
    with app.app_context():
        db.create_all()
        print("✅ Transaction database initialized")

if __name__ == '__main__':
    create_tables()
    port = Config.PORT
    print(f"\n🚀 Transaction Service running on http://localhost:{port}")
    print(f"📚 API Docs: http://localhost:{port}/api-docs\n")
    app.run(host='0.0.0.0', port=port, debug=True)
