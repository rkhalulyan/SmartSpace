from flask import Flask, render_template, request, redirect, flash, url_for, session
import os
from pymongo import MongoClient
from models.user import find_user_by_username, create_user, get_user_lockers, find_user_by_username_and_pin


# Initialize the Flask application specifying the template and static folders
app = Flask(
    __name__,
    template_folder='/frontend/static/pages',  # Set the correct path for your templates
    static_folder='/frontend/static'  # Set the correct path for your static files like CSS
    
)
app.secret_key = 'your_secret_key'  # Needed for flash messages

if __name__ == '__main__':
    app.logger.setLevel('DEBUG')
    app.run(debug=True)


# MongoDB connection setup
db_url = os.getenv('DB_URL', 'mongodb://localhost:27017/SmartSpace')
client = MongoClient(db_url)
db = client['SmartSpace']  
app.config['db'] = db
users_collection = db['Users'] 
lockers_collection = db['Lockers']

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
            if find_user_by_username(username):
                flash('Username already exists. Please choose another.', 'error')
            else:
                create_user(full_name, username, pin)
                flash('Account created successfully!', 'success')
                session['Username'] = username
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
    name = user['Name']
    user_id = user['_id']
    users_lockers = get_user_lockers(user_id)

    return render_template("check-out-lockers.html", username=name, lockers=users_lockers)

@app.route('/lockers', methods=['GET', 'POST'])
def lockers():
    username_in_session = session.get('Username', 'Guest User')
    return render_template("lockers.html", username=username_in_session)


