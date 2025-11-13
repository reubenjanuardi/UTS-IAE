from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_restx import Api, Resource, fields
from models import db, Notification
from config import Config
from datetime import datetime
from functools import wraps

app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
CORS(app)

# Initialize API documentation
api = Api(app, doc='/api-docs/', version='1.0',
          title='Notification Service API',
          description='Notification Service untuk E-Wallet System')

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
notification_model = api.model('Notification', {
    'id': fields.Integer(description='Notification ID'),
    'user_id': fields.Integer(description='User ID'),
    'title': fields.String(description='Notification title'),
    'message': fields.String(description='Notification message'),
    'type': fields.String(description='Notification type'),
    'is_read': fields.Boolean(description='Read status'),
    'created_at': fields.DateTime(description='Creation timestamp')
})

notification_input = api.model('NotificationInput', {
    'user_id': fields.Integer(required=True, description='User ID'),
    'title': fields.String(required=True, description='Title'),
    'message': fields.String(required=True, description='Message'),
    'type': fields.String(description='Notification type')
})

# Define namespaces
notifications_ns = api.namespace('notifications', description='Notification operations')

@notifications_ns.route('/')
class NotificationList(Resource):
    @notifications_ns.doc('list_notifications')
    @require_auth
    def get(self):
        """Get all notifications"""
        notifications = Notification.query.order_by(Notification.created_at.desc()).all()
        return {'success': True, 'data': [n.to_dict() for n in notifications]}
    
    @notifications_ns.doc('create_notification')
    @notifications_ns.expect(notification_input)
    @require_auth
    def post(self):
        """Create a new notification"""
        data = request.get_json()
        
        notification = Notification(
            user_id=data['user_id'],
            title=data['title'],
            message=data['message'],
            type=data.get('type', 'general')
        )
        
        db.session.add(notification)
        db.session.commit()
        
        return {'success': True, 'data': notification.to_dict()}, 201

@notifications_ns.route('/<int:id>')
class NotificationResource(Resource):
    @notifications_ns.doc('get_notification')
    @require_auth
    def get(self, id):
        """Get notification by ID"""
        notification = Notification.query.get(id)
        if not notification:
            return {'success': False, 'error': 'Notification not found'}, 404
        return {'success': True, 'data': notification.to_dict()}
    
    @notifications_ns.doc('delete_notification')
    @require_auth
    def delete(self, id):
        """Delete notification"""
        notification = Notification.query.get(id)
        if not notification:
            return {'success': False, 'error': 'Notification not found'}, 404
        
        db.session.delete(notification)
        db.session.commit()
        return {'success': True, 'message': 'Notification deleted'}

@notifications_ns.route('/user/<int:user_id>')
class UserNotifications(Resource):
    @notifications_ns.doc('get_user_notifications')
    @require_auth
    def get(self, user_id):
        """Get notifications for user"""
        notifications = Notification.query.filter_by(user_id=user_id).order_by(
            Notification.created_at.desc()
        ).all()
        return {'success': True, 'data': [n.to_dict() for n in notifications]}

@notifications_ns.route('/user/<int:user_id>/unread')
class UserUnreadNotifications(Resource):
    @notifications_ns.doc('get_user_unread_notifications')
    @require_auth
    def get(self, user_id):
        """Get unread notifications for user"""
        notifications = Notification.query.filter_by(
            user_id=user_id,
            is_read=False
        ).order_by(Notification.created_at.desc()).all()
        
        return {
            'success': True,
            'count': len(notifications),
            'data': [n.to_dict() for n in notifications]
        }

# Internal endpoint for creating notifications
@app.route('/internal/notifications', methods=['POST'])
def create_internal_notification():
    """Internal endpoint for other services to create notifications"""
    data = request.get_json()
    
    notification = Notification(
        user_id=data['user_id'],
        title=data.get('title', 'Notification'),
        message=data.get('message', ''),
        type=data.get('type', 'general')
    )
    
    db.session.add(notification)
    db.session.commit()
    
    return jsonify({'success': True, 'data': notification.to_dict()}), 201

# Mark notification as read
@app.route('/internal/notifications/<int:notification_id>/read', methods=['PUT'])
def mark_as_read(notification_id):
    """Mark notification as read"""
    notification = Notification.query.get(notification_id)
    if not notification:
        return jsonify({'success': False, 'error': 'Notification not found'}), 404
    
    notification.is_read = True
    db.session.commit()
    
    return jsonify({'success': True, 'data': notification.to_dict()})

# Health check
@app.route('/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'service': 'notification-service',
        'database': 'connected' if db.engine else 'disconnected'
    })

def create_tables():
    with app.app_context():
        db.create_all()
        print("✅ Notification database initialized")

if __name__ == '__main__':
    create_tables()
    port = Config.PORT
    print(f"\n🚀 Notification Service running on http://localhost:{port}")
    print(f"📚 API Docs: http://localhost:{port}/api-docs\n")
    app.run(host='0.0.0.0', port=port, debug=True)
