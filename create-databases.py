#!/usr/bin/env python3
"""
Script to initialize all databases for the E-Wallet system.
This creates all necessary SQLite databases and sample data.
"""

import os
import sys
import time

def create_database(service_name, service_path):
    """Create database for a specific service"""
    print(f"\n{'='*60}")
    print(f"🔧 Initializing {service_name}...")
    print(f"{'='*60}")
    
    # Add service path to Python path
    sys.path.insert(0, service_path)
    
    try:
        # Import the app and models
        from config import Config
        from models import db
        from app import app
        
        # Create database and tables
        with app.app_context():
            print(f"📁 Database URI: {Config.SQLALCHEMY_DATABASE_URI}")
            db.create_all()
            print(f"✅ Database and tables created successfully!")
            
        # Small delay to avoid conflicts
        time.sleep(1)
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        # Remove from path
        if service_path in sys.path:
            sys.path.remove(service_path)

def main():
    """Main function to create all databases"""
    base_path = os.path.dirname(os.path.abspath(__file__))
    
    services = [
        ("User Service", os.path.join(base_path, "user-service")),
        ("Wallet Service", os.path.join(base_path, "wallet-service")),
        ("Transaction Service", os.path.join(base_path, "transaction-service")),
        ("Notification Service", os.path.join(base_path, "notification-service")),
    ]
    
    print("\n" + "="*60)
    print("🚀 E-Wallet Database Initialization")
    print("="*60)
    
    results = {}
    for service_name, service_path in services:
        success = create_database(service_name, service_path)
        results[service_name] = success
    
    # Print summary
    print("\n" + "="*60)
    print("📊 Summary:")
    print("="*60)
    
    for service_name, success in results.items():
        status = "✅ SUCCESS" if success else "❌ FAILED"
        print(f"{service_name}: {status}")
    
    # Overall result
    all_success = all(results.values())
    print("\n" + "="*60)
    if all_success:
        print("✅ All databases initialized successfully!")
        print("\n✨ You can now run: start-all.bat (Windows) or ./start-all.sh (Mac/Linux)")
    else:
        print("❌ Some databases failed to initialize. Please check the errors above.")
    print("="*60 + "\n")
    
    return 0 if all_success else 1

if __name__ == "__main__":
    sys.exit(main())
