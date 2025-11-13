from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_restx import Api, Resource, fields
from models import db, Wallet
from config import Config
import requests
from datetime import datetime
from functools import wraps

app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
CORS(app)

# Initialize API documentation
api = Api(app, doc='/api-docs/', version='1.0',
          title='Wallet Service API',
          description='Wallet Service untuk E-Wallet System')

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
wallet_model = api.model('Wallet', {
    'id': fields.Integer(description='Wallet ID'),
    'user_id': fields.Integer(description='User ID'),
    'balance': fields.Float(description='Wallet balance'),
    'currency': fields.String(description='Currency'),
    'status': fields.String(description='Wallet status'),
    'created_at': fields.DateTime(description='Creation timestamp')
})

wallet_input = api.model('WalletInput', {
    'user_id': fields.Integer(required=True, description='User ID'),
    'balance': fields.Float(description='Initial balance'),
    'currency': fields.String(description='Currency')
})

wallet_update = api.model('WalletUpdate', {
    'balance': fields.Float(description='New balance'),
    'currency': fields.String(description='Currency'),
    'status': fields.String(description='Wallet status')
})

# Define namespaces
wallets_ns = api.namespace('wallets', description='Wallet operations')

@wallets_ns.route('/')
class WalletList(Resource):
    @wallets_ns.doc('list_wallets')
    @wallets_ns.marshal_list_with(wallet_model)
    @require_auth
    def get(self):
        """Get all wallets"""
        wallets = Wallet.query.all()
        return {'success': True, 'data': [wallet.to_dict() for wallet in wallets]}
    
    @wallets_ns.doc('create_wallet')
    @wallets_ns.expect(wallet_input)
    @require_auth
    def post(self):
        """Create a new wallet"""
        data = request.get_json()
        user_id = data.get('user_id')
        
        # Validate user exists
        try:
            user_response = requests.get(
                f'{Config.USER_SERVICE_URL}/internal/users/{user_id}/validate'
            )
            if not user_response.json().get('valid'):
                return {'success': False, 'error': 'User not found'}, 404
        except:
            return {'success': False, 'error': 'Unable to validate user'}, 500
        
        # Check if wallet already exists
        if Wallet.query.filter_by(user_id=user_id).first():
            return {'success': False, 'error': 'Wallet already exists for this user'}, 400
        
        # Create new wallet
        wallet = Wallet(
            user_id=user_id,
            balance=data.get('balance', 0.0),
            currency=data.get('currency', 'IDR')
        )
        
        db.session.add(wallet)
        db.session.commit()
        
        return {'success': True, 'data': wallet.to_dict()}, 201

@wallets_ns.route('/<int:id>')
@wallets_ns.response(404, 'Wallet not found')
@wallets_ns.param('id', 'The wallet identifier')
class WalletResource(Resource):
    @wallets_ns.doc('get_wallet')
    @require_auth
    def get(self, id):
        """Get wallet by ID"""
        wallet = Wallet.query.get(id)
        if not wallet:
            return {'success': False, 'error': 'Wallet not found'}, 404
        return {'success': True, 'data': wallet.to_dict()}
    
    @wallets_ns.doc('update_wallet')
    @wallets_ns.expect(wallet_update)
    @require_auth
    def put(self, id):
        """Update wallet"""
        wallet = Wallet.query.get(id)
        if not wallet:
            return {'success': False, 'error': 'Wallet not found'}, 404
        
        data = request.get_json()
        if 'balance' in data:
            wallet.balance = data['balance']
        if 'status' in data:
            wallet.status = data['status']
        if 'currency' in data:
            wallet.currency = data['currency']
        
        db.session.commit()
        return {'success': True, 'data': wallet.to_dict()}

@wallets_ns.route('/user/<int:user_id>')
class UserWallet(Resource):
    @wallets_ns.doc('get_user_wallet')
    @require_auth
    def get(self, user_id):
        """Get wallet by user ID"""
        wallet = Wallet.query.filter_by(user_id=user_id).first()
        if not wallet:
            return {'success': False, 'error': 'Wallet not found for this user'}, 404
        return {'success': True, 'data': wallet.to_dict()}

# Internal endpoint for balance operations
@app.route('/internal/wallets/user/<int:user_id>/balance', methods=['GET'])
def get_wallet_balance(user_id):
    """Get wallet balance for user"""
    wallet = Wallet.query.filter_by(user_id=user_id).first()
    if not wallet:
        return jsonify({'success': False, 'error': 'Wallet not found'}), 404
    return jsonify({'success': True, 'balance': wallet.balance, 'currency': wallet.currency})

@app.route('/internal/wallets/user/<int:user_id>/balance', methods=['PUT'])
def update_wallet_balance(user_id):
    """Update wallet balance"""
    data = request.get_json()
    wallet = Wallet.query.filter_by(user_id=user_id).first()
    
    if not wallet:
        return jsonify({'success': False, 'error': 'Wallet not found'}), 404
    
    amount = data.get('amount', 0)
    operation = data.get('operation', 'set')  # set, add, subtract
    
    if operation == 'set':
        wallet.balance = amount
    elif operation == 'add':
        wallet.balance += amount
    elif operation == 'subtract':
        if wallet.balance < amount:
            return jsonify({'success': False, 'error': 'Insufficient balance'}), 400
        wallet.balance -= amount
    
    db.session.commit()
    return jsonify({'success': True, 'balance': wallet.balance})

# Health check
@app.route('/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'service': 'wallet-service',
        'database': 'connected' if db.engine else 'disconnected'
    })

def create_tables():
    with app.app_context():
        db.create_all()
        
        # Add sample wallets if none exist
        if Wallet.query.count() == 0:
            sample_wallets = [
                Wallet(user_id=1, balance=1000000.0, currency='IDR', status='active'),
                Wallet(user_id=2, balance=500000.0, currency='IDR', status='active')
            ]
            for wallet in sample_wallets:
                db.session.add(wallet)
            db.session.commit()
            print("✅ Sample wallets created")

if __name__ == '__main__':
    create_tables()
    port = Config.PORT
    print(f"\n🚀 Wallet Service running on http://localhost:{port}")
    print(f"📚 API Docs: http://localhost:{port}/api-docs\n")
    app.run(host='0.0.0.0', port=port, debug=True)
