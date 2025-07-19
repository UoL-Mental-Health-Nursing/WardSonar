from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
import os
from models import db, Ward, Submission, Cause, CauseSubmission, StaffUser, AdminUser
from sqlalchemy import inspect
from admin_routes import admin_bp
from flask_login import LoginManager, login_user
from models import Ward

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "dev-secret-key")

app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://neondb_owner:npg_HljEtv13aRfg@ep-bold-waterfall-abpwjehp-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'


CORS(app,
     origins=["https://glowing-cassata-16954e.netlify.app"],
     methods=["GET", "POST", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"],
     supports_credentials=True)


@app.after_request
def apply_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "https://glowing-cassata-16954e.netlify.app"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
    return response


with app.app_context():
    db.create_all()
    inspector = inspect(db.engine)


@app.route("/")
def index():
    return "Backend is running and connected to NeonDB!"


@app.route("/api/staff-login", methods=["POST"])
def staff_login():
    # Handle preflight
    if request.method == "OPTIONS":
        return '', 200

    data = request.get_json()
    ward_id = data.get("ward_id")
    pin = data.get("pin", "").strip()

    ward = Ward.query.filter_by(id=ward_id).first()

    if ward and ward.secret.strip() == pin:
        return jsonify({
            "success": True,
            "ward_id": ward.id,
            "ward_name": ward.name
        }), 200

    return jsonify({
        "success": False,
        "error": "Invalid ward or PIN"
    }), 401


@app.route("/api/manager-login", methods=["POST"])
def manager_login():
    if request.method == "OPTIONS":
        return '', 200

    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    admin = AdminUser.query.filter_by(username=username).first()
    if admin and admin.check_password(password):
        print("Login Successful")
        login_user(admin)
        return jsonify({"success": True}), 200
    print("Login failed")
    return jsonify({"success": False, "error": "Invalid username or password"}), 401


@app.route("/api/wards", methods=["GET"])
def get_wards():
    wards = Ward.query.filter(Ward.deleted_at.is_(None)).all()
    ward_names = [ward.name for ward in wards]
    return jsonify(ward_names)


@app.route("/api/causes", methods=["GET"])
def get_causes():
    causes = Cause.query.filter(Cause.deleted_at.is_(None)).all()
    return jsonify([{"id": c.id, "text": c.text} for c in causes])


@app.route("/api/wards", methods=["POST"])
def add_ward():
    data = request.get_json()
    new_name = data.get("ward")

    if not new_name:
        return jsonify({"error": "Missing ward name"}), 400

    existing = Ward.query.filter_by(name=new_name).first()
    if existing:
        return jsonify({"error": "Ward already exists"}), 400

    new_ward = Ward(name=new_name, secret=str(uuid.uuid4()), urlkey=new_name.lower()[:8] + "123")
    db.session.add(new_ward)
    db.session.commit()
    return jsonify({"message": "Ward added"}), 201


@app.route("/api/submit", methods=["POST", "OPTIONS"])
def submit_feedback():
    if request.method == "OPTIONS":
        return '', 204

    data = request.get_json()
    ward_name = data.get("ward")
    ward = Ward.query.filter_by(name=ward_name).first()

    if not ward:
        return jsonify({"error": "Invalid ward"}), 400

    submission = Submission(
        ward_id=ward.id,
        atmosphere=data.get("atmosphere"),
        direction=data.get("direction"),
        comment=data.get("comment"),
        abandoned=data.get("abandoned", False)
    )
    db.session.add(submission)
    db.session.commit()

    cause_ids = data.get("cause_ids", [])
    for cause_id in cause_ids:
        cs = CauseSubmission(submission_id=submission.id, cause_id=cause_id)
        db.session.add(cs)
    db.session.commit()

    return jsonify({"message": "Feedback received"}), 200


@app.route("/api/responses", methods=["GET"])
def get_all_responses():
    submissions = Submission.query.all()
    result = []
    for s in submissions:
        result.append({
            "id": s.id,
            "ward": s.ward.name,
            "atmosphere": s.atmosphere,
            "direction": s.direction,
            "comment": s.comment,
            "abandoned": s.abandoned,
            "created_at": s.created_at.isoformat()
        })
    return jsonify(result)


@app.route("/api/responses/<ward_name>", methods=["GET"])
def get_ward_responses(ward_name):
    ward = Ward.query.filter_by(name=ward_name).first()
    if not ward:
        return jsonify({"error": "Invalid ward"}), 400

    submissions = Submission.query.filter_by(ward_id=ward.id).all()
    result = []
    for s in submissions:
        result.append({
            "id": s.id,
            "atmosphere": s.atmosphere,
            "direction": s.direction,
            "comment": s.comment,
            "abandoned": s.abandoned,
            "created_at": s.created_at.isoformat()
        })
    return jsonify(result)


@login_manager.user_loader
def load_user(user_id):
    return AdminUser.query.get(int(user_id))


app.register_blueprint(admin_bp, url_prefix='/admin')


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
