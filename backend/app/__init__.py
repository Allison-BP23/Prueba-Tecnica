from flask import Flask
from .config import Config
from .db import db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)

    from .routes.purchase_order_routes import purchase_order_bp
    app.register_blueprint(purchase_order_bp, url_prefix='/api')

    return app
