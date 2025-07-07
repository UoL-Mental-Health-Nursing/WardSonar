from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

# ✅ CORS config: allow specific origin & all methods/headers
CORS(app, origins=[
    "https://psychic-space-eureka-7v96gr99prj637gg-5173.app.github.dev"
], methods=["GET", "POST", "OPTIONS"], allow_headers="*",
    supports_credentials=True)

# In-memory store for responses
responses = {
    "Ward A": [],
    "Ward B": [],
    # new wards can be added dynamically
}



@app.route("/api/submit", methods=["POST", "OPTIONS"])
def submit_feedback():
    data = request.get_json()
    ward = data.get("ward")

    if not ward:
        return jsonify({"error": "Ward not specified"}), 400

    if ward not in responses:
        responses[ward] = []

    responses[ward].append(data)
    print(f"Received from {ward}:", data)
    return jsonify({"message": "Feedback received"}), 200

@app.route("/api/all-wards", methods=["GET"])
def get_all_wards():
    return jsonify(list(responses.keys()))

@app.route("/api/responses/<ward>", methods=["GET"])
def get_ward_data(ward):
    ward_data = responses.get(ward)
    if ward_data is None:
        return jsonify({"error": "Ward not found"}), 404
    return jsonify(ward_data)


@app.route("/api/responses", methods=["GET"])
def get_responses():
    return jsonify(responses)


# Replace with a DB check later
MANAGER_CREDENTIALS = {
    "admin": "securepassword123"
}


@app.route("/api/manager-login", methods=["POST"])
def manager_login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if MANAGER_CREDENTIALS.get(username) == password:
        return jsonify({"success": True}), 200
    else:
        return jsonify({"success": False, "error": "Invalid credentials"}), 401


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
