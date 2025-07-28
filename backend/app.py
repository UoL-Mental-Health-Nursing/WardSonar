from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
import os
from models import db, Ward, Submission, Cause, CauseSubmission, StaffUser, AdminUser
from sqlalchemy import inspect
from admin_routes import admin_bp
from flask_login import LoginManager, login_user


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


def seed_initial_causes(app):
    with app.app_context():
        expected_causes = [
            'ward environment',
            'the staff',
            'other patients',
            'personal feelings',
            'other',
        ]

        print("Checking and seeding initial causes...")
        for cause_text in expected_causes:
            existing_cause = db.session.query(Cause).filter_by(text=cause_text).first()
            if not existing_cause:
                new_cause = Cause(text=cause_text)
                db.session.add(new_cause)
                print(f"  - Added Cause: '{cause_text}' to database.")
            else:
                print(f"  - Cause: '{cause_text}' already exists.")
        db.session.commit()
        print("Initial causes seeding complete.")


with app.app_context():
    db.create_all()
    inspector = inspect(db.engine)
    seed_initial_causes(app)


@app.route("/")
def index():
    return "Backend is running and connected to NeonDB!"


@app.route("/api/staff-login", methods=["POST"])
def staff_login():
    if request.method == "OPTIONS":
        return '', 200

    data = request.get_json()
    ward_id = data.get("ward_id")
    pin = data.get("pin", "").strip()

    ward = Ward.query.filter_by(id=ward_id).first()

    if ward and ward.check_pin(pin):
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
    return jsonify([
        {"id": ward.id, "name": ward.name}
        for ward in wards
    ])


@app.route("/api/causes", methods=["GET"])
def get_causes():
    causes = Cause.query.filter(Cause.deleted_at.is_(None)).all()
    return jsonify([{"id": c.id, "text": c.text} for c in causes])


@app.route("/api/wards", methods=["POST"])
def add_ward():
    data = request.get_json()
    new_name = data.get("ward")
    pin = data.get("pin", "1234")

    if not new_name:
        return jsonify({"error": "Missing ward name"}), 400

    existing = Ward.query.filter_by(name=new_name).first()
    if existing:
        return jsonify({"error": "Ward already exists"}), 400

    new_ward = Ward(name=new_name, urlkey=new_name.lower()[:8] + "123")
    new_ward.set_pin(pin)
    db.session.add(new_ward)
    db.session.commit()
    return jsonify({"message": "Ward added", "pin": pin}), 201

@app.route("/api/add-admin", methods=["POST"])
def add_admin_user():
    # IMPORTANT: This endpoint is for one-time setup.
    # REMOVE or secure it heavily (e.g., with an API key) IMMEDIATELY after use!
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    existing_admin = AdminUser.query.filter_by(username=username).first()
    if existing_admin:
        return jsonify({"error": "Admin user with this username already exists"}), 409 # Conflict

    new_admin = AdminUser(username=username)
    new_admin.set_password(password) # Use the set_password method from your model
    db.session.add(new_admin)
    db.session.commit()

    return jsonify({"message": f"Admin user '{username}' added successfully"}), 201@app.route("/api/add-admin", methods=["POST"])
# remove after running curl
def add_admin_user():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    existing_admin = AdminUser.query.filter_by(username=username).first()
    if existing_admin:
        return jsonify({"error": "Admin user with this username already exists"}), 409 # Conflict

    new_admin = AdminUser(username=username)
    new_admin.set_password(password) # Use the set_password method from your model
    db.session.add(new_admin)
    db.session.commit()

    return jsonify({"message": f"Admin user '{username}' added successfully"}), 201

@app.route("/api/submit", methods=["POST", "OPTIONS"])
def submit_feedback():
    if request.method == "OPTIONS":
        return '', 204

    data = request.get_json()
    ward_name = data.get("ward")
    ward = Ward.query.filter_by(name=ward_name).first()

    if not ward:
        return jsonify({"error": "Invalid ward"}), 400
    mood_to_atmosphere_map = {
        "very-calm": 1,
        "calm": 2,
        "neutral": 3,
        "stormy": 4,
        "very-stormy": 5
    }
    mood_from_frontend = data.get("mood")
    atmosphere_value = mood_to_atmosphere_map.get(mood_from_frontend, None)

    submission = Submission(
        ward_id=ward.id,
        atmosphere=atmosphere_value,
        direction=data.get("direction"),
        comment=data.get("comment"),
        abandoned=data.get("abandoned", False)
    )
    db.session.add(submission)
    db.session.commit()

    factor_names = data.get("factors", [])
    if factor_names:
        causes = Cause.query.filter(Cause.text.in_(factor_names)).all()
        causes_by_text = {c.text: c for c in causes}

        for factor_name in factor_names:
            cause = causes_by_text.get(factor_name)
            if cause:
                cs = CauseSubmission(submission_id=submission.id, cause_id=cause.id)
                db.session.add(cs)
            else:
                print(f"Warning: Cause '{factor_name}' not found in database.")

    db.session.commit()

    return jsonify({"message": "Feedback received"}), 200


@app.route("/api/responses", methods=["GET"])
def get_all_responses():
    submissions = Submission.query.all()
    result = []
    for s in submissions:
        linked_causes_texts = [cause.text for cause in s.linked_causes]
        result.append({
            "id": s.id,
            "ward": s.ward.name,
            "atmosphere": s.atmosphere,
            "direction": s.direction,
            "comment": s.comment,
            "abandoned": s.abandoned,
            "created_at": s.created_at.isoformat(),
            "causes": linked_causes_texts
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
        # Retrieve linked causes using the new relationship
        linked_causes_texts = [cause.text for cause in s.linked_causes]
        result.append({
            "id": s.id,
            "atmosphere": s.atmosphere,
            "direction": s.direction,
            "comment": s.comment,
            "abandoned": s.abandoned,
            "created_at": s.created_at.isoformat(),
            "causes": linked_causes_texts
        })
    return jsonify(result)


@login_manager.user_loader
def load_user(user_id):
    return AdminUser.query.get(int(user_id))


app.register_blueprint(admin_bp, url_prefix='/admin')


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
