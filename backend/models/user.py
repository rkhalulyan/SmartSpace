from flask import current_app as app
from bson.objectid import ObjectId


def find_user_by_username(username):
    db = app.config['db']
    return db['Users'].find_one({'Username': username})

def find_user_by_username_and_pin(username, pin):
    db = app.config['db']
    return db['Users'].find_one({'Username': username, 'Pin': pin})

def create_user(username, pin):
    db = app.config['db']
    user = {'Username': username, 'Pin': pin}
    db['Users'].insert_one(user)
    return user

def get_user_lockers(user_id):
    app.logger.info(f"in get_user_lockers, here is the user_id: {user_id}, it is of type {type(str(user_id))}")
    db = app.config['db']
    pipeline = [
        {
            "$match": {
                "_id": ObjectId(user_id)  # Replace with the actual ObjectId of the user
            }
        },
        {
            "$lookup": {
                "from": "Locker",  # Ensure this matches the actual name of your lockers collection
                "localField": "LockerIds",  # Field in Users collection
                "foreignField": "_id",  # Corresponding field in Lockers collection
                "as": "LockerInfo"  # Field for outputting matched lockers
            }
        },
        {
            "$project": {
                "LockerNumbers": "$LockerInfo.lockerNumber",  # Extract locker numbers
                "_id": 0  # Exclude the user _id from results
            }
        }
    ]
    
    app.logger.info(f"here is the pipeline {pipeline}")
    result = list(db.Users.aggregate(pipeline))  # Execute the aggregation pipeline

    app.logger.info(f"here is the result {result}")
    return result[0]['LockerNumbers'] if result else []

