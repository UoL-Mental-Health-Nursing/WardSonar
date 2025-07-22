# set_pins.py
from app import app, db
from models import Ward

with app.app_context():
    wards = Ward.query.all()
    for ward in wards:
        # Set a new default PIN for all wards.
        # You can make this dynamic if you have a mapping of ward_id to desired_pin
        ward.set_pin("1234") # Choose a strong, new default PIN or generate random ones
        db.session.add(ward)
    db.session.commit()
    print("All ward PINs have been set to '1234'")
