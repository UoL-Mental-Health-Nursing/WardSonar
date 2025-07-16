# admin_routes.py
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from datetime import datetime
from models import db, Ward, StaffUser

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')


# Require admin user role
@admin_bp.before_request
@login_required
def check_admin():
    if not getattr(current_user, 'is_admin', False):
        return jsonify({'error': 'Unauthorized'}), 403


# Get all wards
@admin_bp.route('/wards', methods=['GET'])
def get_wards():
    wards = Ward.query.all()
    return jsonify([{'id': w.id, 'name': w.name} for w in wards])


# Create a ward
@admin_bp.route('/wards', methods=['POST'])
def create_ward():
    data = request.json
    ward_name = data.get("ward_name")
    if not ward_name:
        return jsonify({'error': 'ward_name required'}), 400

    if Ward.query.filter_by(name=ward_name).first():
        return jsonify({'error': 'Ward already exists'}), 400

    ward = Ward(name=ward_name)
    db.session.add(ward)
    db.session.commit()
    return jsonify({'message': 'Ward created', 'ward_id': ward.id})


# Update ward name
@admin_bp.route('/wards/<int:ward_id>', methods=['PUT'])
def update_ward(ward_id):
    data = request.json
    new_name = data.get("ward_name")
    ward = Ward.query.get(ward_id)
    if not ward:
        return jsonify({'error': 'Ward not found'}), 404
    if new_name:
        ward.name = new_name
        db.session.commit()
    return jsonify({'message': 'Ward updated'})


# Delete ward
@admin_bp.route('/wards/<int:ward_id>', methods=['DELETE'])
def delete_ward(ward_id):
    ward = Ward.query.get(ward_id)
    if not ward:
        return jsonify({'error': 'Ward not found'}), 404
    StaffUser.query.filter_by(ward_id=ward_id).delete()
    db.session.delete(ward)
    db.session.commit()
    return jsonify({'message': 'Ward and associated staff users deleted'})


# Get all staff users
@admin_bp.route('/staff_users', methods=['GET'])
def get_staff_users():
    staff_users = StaffUser.query.all()
    return jsonify([{'id': s.id, 'ward_id': s.ward_id, 'pin': s.pin} for s in staff_users])


# Create a staff user (assign to ward, set pin)
@admin_bp.route('/staff_users', methods=['POST'])
def create_staff_user():
    data = request.json
    ward_id = data.get('ward_id')
    pin = data.get('pin')
    if not ward_id or not pin:
        return jsonify({'error': 'ward_id and pin required'}), 400

    ward = Ward.query.get(ward_id)
    if not ward:
        return jsonify({'error': 'Ward not found'}), 404

    staff = StaffUser(ward_id=ward_id, pin=pin)
    db.session.add(staff)
    db.session.commit()
    return jsonify({'message': 'Staff user created', 'staff_user_id': staff.id})


# Update staff user's pin
@admin_bp.route('/staff_users/<int:staff_id>', methods=['PUT'])
def update_staff_user(staff_id):
    data = request.json
    pin = data.get('pin')
    staff = StaffUser.query.get(staff_id)
    if not staff:
        return jsonify({'error': 'Staff user not found'}), 404
    if pin:
        staff.pin = pin
        db.session.commit()
    return jsonify({'message': 'Staff user updated'})


# Delete staff user
@admin_bp.route('/staff_users/<int:staff_id>', methods=['DELETE'])
def delete_staff_user(staff_id):
    staff = StaffUser.query.get(staff_id)
    if not staff:
        return jsonify({'error': 'Staff user not found'}), 404
    db.session.delete(staff)
    db.session.commit()
    return jsonify({'message': 'Staff user deleted'})
