from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)


# ✅ CORS setup — allow only your frontend origin
CORS(app, origins=[
    "https://glowing-cassata-16954e.netlify.app"
], methods=["GET", "POST", "OPTIONS"],
        allow_headers="*", supports_credentials=True)


# ✅ Data store (temporary)
responses = []
valid_wards = ["Ward A", "Ward B", "Ward C", "Ward D", "Ward E"]

ward_credentials = {
    "Ward A": "1234",
    "Ward B": "5678",
    "Ward C": "9999",
    "Ward D": "2356",
    "Ward E": "4567",
}

# ✅ Temporary manager credentials (hashed)
manager_credentials = {
    "admin1": generate_password_hash("password123"),
    "admin2": generate_password_hash("securepass"),
}


# ✅ Staff login route
@app.route("/api/staff-login", methods=["POST"])
def staff_login():
    data = request.get_json()
    ward = data.get("ward")
    pin = data.get("pin")

    if ward in ward_credentials and ward_credentials[ward] == pin:
        return jsonify({"success": True}), 200
    else:
        return jsonify({"success": False, "error": "Invalid ward or PIN"}), 401


# ✅ Manager login route
@app.route("/api/manager-login", methods=["POST"])
def manager_login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if username in manager_credentials and check_password_hash(manager_credentials[username], password):
        return jsonify({"success": True}), 200
    else:
        return jsonify({"success": False, "error": "Invalid username or password"}), 401


# ✅ Return list of valid wards
@app.route("/api/wards", methods=["GET"])
def get_wards():
    return jsonify(valid_wards)


# ✅ Submit patient feedback
@app.route("/api/submit", methods=["POST", "OPTIONS"])
def submit_feedback():
    if request.method == "OPTIONS":
        return '', 204  # Preflight response

    data = request.get_json()
    ward = data.get("ward")

    if ward not in valid_wards:
        return jsonify({"error": "Invalid ward"}), 400

    responses.append(data)
    print(f"Received from {ward}:", data)
    return jsonify({"message": "Feedback received"}), 200


# ✅ Get all responses (manager use)
@app.route("/api/responses", methods=["GET"])
def get_all_responses():
    print("Returning all responses:", responses)
    return jsonify(responses)


# ✅ Get responses for a specific ward (staff use)
@app.route("/api/responses/<ward>", methods=["GET"])
def get_ward_responses(ward):
    if ward not in valid_wards:
        return jsonify({"error": "Invalid ward"}), 400
    ward_data = [r for r in responses if r.get("ward") == ward]
    return jsonify(ward_data)


# ✅ Add new ward (admin use)
@app.route("/api/wards", methods=["POST"])
def add_ward():
    data = request.get_json()
    new_ward = data.get("ward")
    if new_ward and new_ward not in valid_wards:
        valid_wards.append(new_ward)
        return jsonify({"message": "Ward added"}), 201
    return jsonify({"error": "Invalid or duplicate ward"}), 400


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
