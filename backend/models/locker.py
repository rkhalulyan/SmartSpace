from flask import current_app as app
from bson.objectid import ObjectId

def set_locker_customer(locker_number, customer_id):
    db = app.config['db']
    db['Locker'].update_one(
        {'lockerNumber': locker_number},
        {'$set': {'customer': ObjectId(customer_id)}},
    )