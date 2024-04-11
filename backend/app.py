from flask import Flask, render_template, request, redirect, flash, url_for, session, jsonify
from pymongo import MongoClient
from models.user import find_user_by_username, create_user, get_user_lockers, find_user_by_username_and_pin, set_user_locker
from models.locker import set_locker_customer
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

@app.route('/check-out', methods=['GET','POST'])
def check_out():

    app.logger.info("in /checkout")
    if request.method == 'POST':
        username = request.form.get('username')
        pin_parts = [
            request.form.get('pin1'),
            request.form.get('pin2'),
            request.form.get('pin3'),
            request.form.get('pin4'),
            request.form.get('pin5')
        ]

        try:
                pin = int(''.join(pin_parts))  
                if find_user_by_username_and_pin(username, pin):
                    session['Username'] = username
                    return redirect(url_for('checkOutLockers'))
                else:
                    flash('Username or PIN was incorrect, please try again!', 'error')

        except ValueError:
                flash('Invalid PIN format', 'error')
        else:
            flash('Please fill in all PIN fields', 'error')

    return render_template("check-out.html") 

@app.route('/check-out-lockers', methods=['GET', 'POST'])
def checkOutLockers():
    user = find_user_by_username(session.get('Username'))
    name = user['Username']
    user_id = user['_id']
    users_lockers = get_user_lockers(user_id)

    return render_template("check-out-lockers.html", username=name, lockers=users_lockers)

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