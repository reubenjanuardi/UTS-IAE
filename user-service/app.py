from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_restx import Api, Resource, fields
from models import db, User
from config import Config
import os
from datetime import datetime
from functools import wraps

app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
CORS(app)

# Initialize API documentation
api = Api(app, doc='/api-docs/', version='1.0',
          title='User Service API',
          description='User Service untuk E-Wallet System')

# Authentication decorator - validate X-User headers from API Gateway
def require_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_id = request.headers.get('X-User-Id')
        if not user_id:
            return jsonify({'success': False, 'error': 'Unauthorized: No user info'}), 401
        return f(*args, **kwargs)
    return decorated_function

# Define data models for documentation
user_model = api.model('User', {
    'id': fields.Integer(description='User ID'),
    'username': fields.String(description='Username'),
    'email': fields.String(description='User email'),
    'full_name': fields.String(description='User full name'),
    'phone': fields.String(description='User phone'),
    'address': fields.String(description='User address'),
    'status': fields.String(description='User status'),
    'created_at': fields.DateTime(description='Creation timestamp')
})

user_input = api.model('UserInput', {
    'username': fields.String(required=True, description='Username'),
    'email': fields.String(required=True, description='User email'),
    'password': fields.String(required=True, description='User password'),
    'full_name': fields.String(description='User full name'),
    'phone': fields.String(description='User phone'),
    'address': fields.String(description='User address')
})

# Define namespaces
users_ns = api.namespace('users', description='User operations')

@users_ns.route('/')
class UserList(Resource):
    @users_ns.doc('list_users')
    @users_ns.marshal_list_with(user_model)
    @require_auth
    def get(self):
        """Get all users"""
        users = User.query.all()
        return {'success': True, 'data': [user.to_dict() for user in users]}
    
    @users_ns.doc('create_user')
    @users_ns.expect(user_input)
    @users_ns.marshal_with(user_model, code=201)
    @require_auth
    def post(self):
        """Create a new user"""
        data = request.get_json()
        
        # Check if user already exists
        if User.query.filter((User.email == data['email']) | (User.username == data['username'])).first():
            return {'success': False, 'error': 'Email or username already exists'}, 400
        
        # Create new user
        user = User(
            username=data['username'],
            email=data['email'],
            full_name=data.get('full_name', ''),
            phone=data.get('phone', ''),
            address=data.get('address', '')
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        return {'success': True, 'data': user.to_dict()}, 201

@users_ns.route('/<int:id>')
@users_ns.response(404, 'User not found')
@users_ns.param('id', 'The user identifier')
class UserResource(Resource):
    @users_ns.doc('get_user')
    @users_ns.marshal_with(user_model)
    @require_auth
    def get(self, id):
        """Get user by ID"""
        user = User.query.get(id)
        if not user:
            return {'success': False, 'error': 'User not found'}, 404
        return {'success': True, 'data': user.to_dict()}
    
    @users_ns.doc('update_user')
    @users_ns.expect(user_input)
    @require_auth
    def put(self, id):
        """Update user by ID"""
        user = User.query.get(id)
        if not user:
            return {'success': False, 'error': 'User not found'}, 404
        
        data = request.get_json()
        user.full_name = data.get('full_name', user.full_name)
        user.phone = data.get('phone', user.phone)
        user.address = data.get('address', user.address)
        
        db.session.commit()
        return {'success': True, 'data': user.to_dict()}
    
    @users_ns.doc('delete_user')
    @users_ns.response(204, 'User deleted')
    @require_auth
    def delete(self, id):
        """Delete user by ID"""
        user = User.query.get(id)
        if not user:
            return {'success': False, 'error': 'User not found'}, 404
        
        db.session.delete(user)
        db.session.commit()
        return '', 204

# Internal endpoint for other services
@app.route('/internal/users/<int:user_id>')
def get_user_internal(user_id):
    """Internal endpoint for other services"""
    user = User.query.get(user_id)
    if not user:
        return jsonify({'success': False, 'error': 'User not found'}), 404
    return jsonify({'success': True, 'data': user.to_dict()})

@app.route('/internal/users/<int:user_id>/validate', methods=['GET'])
def validate_user(user_id):
    """Validate if user exists"""
    user = User.query.get(user_id)
    if not user:
        return jsonify({'success': False, 'valid': False}), 404
    return jsonify({'success': True, 'valid': True, 'user': user.to_dict()})

# Health check
@app.route('/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'service': 'user-service',
        'database': 'connected' if db.engine else 'disconnected'
    })

# Create database tables
def create_tables():
    with app.app_context():
        db.create_all()
        
        # Add sample data if no users exist
        if User.query.count() == 0:
            sample_users = [
                User(
                    username='john_doe',
                    email='john@example.com',
                    full_name='John Doe',
                    phone='08123456789',
                    address='Jl. Main St 123'
                ),
                User(
                    username='jane_smith',
                    email='jane@example.com',
                    full_name='Jane Smith',
                    phone='08987654321',
                    address='Jl. Side St 456'
                )
            ]
            
            for user in sample_users:
                user.set_password('password123')
                db.session.add(user)
            
            db.session.commit()
            print("✅ Sample users created")

if __name__ == '__main__':
    create_tables()
    port = Config.PORT
    print(f"\n🚀 User Service running on http://localhost:{port}")
    print(f"📚 API Docs: http://localhost:{port}/api-docs\n")
    app.run(host='0.0.0.0', port=port, debug=True)
