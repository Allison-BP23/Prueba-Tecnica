import sys
import os
from flask_cors import CORS

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from app import create_app

app = create_app()
CORS(app)

if __name__ == "__main__":
    app.run(debug=True)
