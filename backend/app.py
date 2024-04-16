from flask import Flask, render_template, request, redirect, flash, url_for, session, jsonify
from pymongo import MongoClient
from models.user import find_user_by_username, create_user, find_user_by_username_and_pin, set_user_locker
from models.locker import set_locker_customer
from bson.objectid import ObjectId
import os
import time

# Flask app initizlization
app = Flask(
    __name__,
    template_folder='/frontend/static/pages',  
    static_folder='/frontend/static'  
    
)
app.secret_key = 'your_secret_key' 

if __name__ == '__main__':
    app.logger.setLevel('DEBUG')
    app.run(debug=True)


# MongoDB connection setup
db_url = os.getenv('DB_URL', 'mongodb://localhost:27017/SmartSpace')
client = MongoClient(db_url)
db = client['SmartSpace']  
app.config['db'] = db
users_collection = db['Users'] 
lockers_collection = db['Locker']

@app.route('/')
def home():
    return render_template('welcome.html')

@app.route('/check-in', methods=['GET', 'POST'])
def checkIn():

    if request.method == 'POST':
        full_name = request.form.get('fullName')
        username = request.form.get('username')
        pin_parts = [
            request.form.get('pin1'),
            request.form.get('pin2'),
            request.form.get('pin3'),
            request.form.get('pin4'),
            request.form.get('pin5')
        ]
        pin = ''.join(pin_parts)

        try:
            pin = int(pin)
            # user exists but pin did not match, throw error 
            if find_user_by_username(username) and not find_user_by_username_and_pin(username, pin):
                flash('User exists, and pin does not match!', 'error')
                return redirect(url_for('checkIn'))
            # user exists but pin does match, log in 
            elif find_user_by_username(username) and find_user_by_username_and_pin(username, pin):
                session['Username'] = username
                session['Message'] = 'Logging you in...'
                return redirect(url_for('lockers'))
            # user doesnt exist create user 
            else:
                create_user(username, pin)
                session['Username'] = username
                session['Message'] = 'Account created successfully!'
                return redirect(url_for('lockers'))
            
        except ValueError:
            flash('Invalid PIN format', 'error')
             
    return render_template('check-in.html')

@app.route('/check-out', methods=['GET', 'POST'])
def check_out():
    if request.method == 'POST':
        username = request.form.get('username')
        pin_parts = [
            request.form.get('pin1'),
            request.form.get('pin2'),
            request.form.get('pin3'),
            request.form.get('pin4'),
            request.form.get('pin5')
        ]
        pin = ''.join(pin_parts)
        try:
            pin = int(pin)  # Convert PIN to integer
            user = find_user_by_username_and_pin(username, pin)
            if user:
                session['Username'] = username
                session['user_id'] = str(user['_id'])  # Assuming '_id' is how you identify users uniquely
                return redirect(url_for('get_lockers'))
            else:
                flash('Username or PIN was incorrect, please try again!', 'error')
        except ValueError:
            flash('Invalid PIN format', 'error')
        return redirect(url_for('check_out'))
    else:
        return render_template("check-out.html")
    
@app.route('/get_lockers')
def get_lockers():
    username = session.get('Username')
    if not username:
        flash('User not logged in.', 'error')
        return redirect(url_for('check_out'))

    user = find_user_by_username(username)
    if not user:
        flash('User not found', 'error')
        return redirect(url_for('check_out'))

    locker_ids = user.get('LockersRented', [])
    lockers = list(db.Locker.find({"_id": {"$in": locker_ids}}))

    lockers_data = [{
        "lockerNumber": locker.get("lockerNumber"),
        "type": locker.get("type")
    } for locker in lockers]

    return render_template('checkout-lockers.html', lockers=lockers_data)

def get_locker_ids_from_numbers(locker_numbers):
    locker_ids = []
    for number in locker_numbers:
        locker = lockers_collection.find_one({"lockerNumber": int(number)})
        app.logger.info(locker)
        if locker:
            locker_ids.append(locker['_id'])
    return locker_ids


@app.route('/submit-checkout', methods=['POST'])
def submit_checkout():
    app.logger.info("In /submit-checkout")
    data = request.get_json()
    locker_numbers = data['lockerNumbers']
    user_id = data['userId']
    app.logger.info(data)

    try:
        # Update lockers to remove customer
        lockers_collection.update_many(
            {'lockerNumber': {'$in': [int(num) for num in locker_numbers]}},
            {'$set': {'customer': None}}
        )

        # Get ObjectIds corresponding to the locker numbers
        locker_ids = get_locker_ids_from_numbers(locker_numbers)

        # Perform the update to remove these lockers from the user's rented list
        result = users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$pull': {'LockersRented': {'$in': locker_ids}}}
        )
        app.logger.info(ObjectId(user_id))
        app.logger.info([int(num) for num in locker_numbers])
        app.logger.info(locker_ids)

        return jsonify({'message': 'Checkout successful'}), 200

    except Exception as e:
        app.logger.error(f'Error during checkout: {e}')
        return jsonify({'error': 'Checkout failed'}), 500

@app.route('/lockers', methods=['GET', 'POST'])
def lockers():
    user = find_user_by_username(session.get('Username'))
    userID = str(user['_id'])
    username = session.get('Username')
    message = session.get('Message')
    return render_template("lockers.html", username=username, message=message, userID=userID)

@app.route('/populate-lockers', methods=['GET'])
def populate_lockers():

    if lockers_collection.count_documents({}) == 0:
        lockers_data = [
            {
                "lockerNumber": i,
                "customer": None,
                "type": "small" if i <= 25 else "large"
            } for i in range (1, 51)
        ]
        lockers_collection.insert_many(lockers_data)

                                     
    # ObjectId() for customer was causing error, converting to string 
    lockers = list(lockers_collection.find({}, {'_id': 0}))
    for locker in lockers:
        if 'customer' in locker and locker['customer'] is not None:
            locker['customer'] = str(locker['customer'])

    return jsonify(lockers)

@app.route('/submit-check-in', methods=['POST'])
def submitCheckIn():
    try:
        credentials = request.get_json()
        if not credentials:
            return jsonify({'error': 'No data provided'}), 400


        customer_id = str(credentials["user_id"])
        locker_number = int(credentials["lockerNumber"])
        app.logger.info(f"IN APP.PY\ncustomer id: {customer_id} ==> {type(customer_id)}\nlocker_number: {locker_number} ==> {type(locker_number)}")
        set_locker_customer(locker_number, customer_id)
        set_user_locker(locker_number, customer_id)

        return jsonify({
                        'status': 'success',
                         'message': 'Check-in processed successfully'
                         }), 200
    
    except Exception as e:
        app.logger.error(f"Error processing check-in: {str(e)}")
        return jsonify({'error': 'Failed to process check-in'}), 500