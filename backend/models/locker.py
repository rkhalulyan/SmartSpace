from flask import current_app as app
from bson.objectid import ObjectId

def set_locker_customer(locker_number, customer_id):
    db = app.config['db']
    db['Locker'].update_one(
        {'lockerNumber': locker_number},
        {'$set': {'customer': ObjectId(customer_id)}},
    )

def release_locker(user_id, locker_id):
    db = app.config['db'];
    locker_update = db['Locker'].update_one(
        {"lockerNumber": int(locker_id), "customer": user_id},
        {"$set": {"customer": None}}
    )
    return locker_update.modified_count > 0

def get_locker_ids_from_numbers(locker_numbers):
    db = app.config['db']
    locker_ids = []
    for number in locker_numbers:
        locker = db['Locker'].find_one({"lockerNumber": number})
        if locker:
            locker_ids.append(locker['_id'])
    return locker_ids

