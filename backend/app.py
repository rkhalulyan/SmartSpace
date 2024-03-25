from flask import Flask, render_template, request, redirect, flash, url_for, session
import os
from pymongo import MongoClient

# Initialize the Flask application specifying the template and static folders
app = Flask(
    __name__,
    template_folder='/frontend/pages',  # Set the correct path for your templates
    static_folder='/frontend/css'  # Set the correct path for your static files like CSS
)
app.secret_key = 'your_secret_key'  # Needed for flash messages

# MongoDB connection setup
db_url = os.getenv('DB_URL', 'mongodb://localhost:27017/SmartSpace')
client = MongoClient(db_url)
db = client['SmartSpace']  # Your database name
users_collection = db['Users']  # Your collection name

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        full_name = request.form.get('fullName')
        username = request.form.get('username')
        pin_parts = [
            request.form.get('pin1'),
            request.form.get('pin2'),
            request.form.get('pin3'),
            request.form.get('pin4')
        ]
        pin = ''.join(pin_parts)

        try:
            pin = int(pin)
            existing_user = users_collection.find_one({'Username': username})
            if existing_user:
                flash('Username already exists. Please choose another.', 'error')
                return render_template('signup.html')

            if len(full_name) > 0 and len(username) > 0:
                user = {
                    'Name': full_name,
                    'Username': username,
                    'Pin': pin
                }
                users_collection.insert_one(user)
                flash('Account created successfully!', 'success')
                return redirect(url_for('login_screen'))
            else:
                flash('Please fill in all the fields', 'error')
        except ValueError:
            flash('Invalid PIN format', 'error')

    return render_template('signup.html')

@app.route('/lockers')
def lockers():
    if 'username' not in session:  # Check if user is not logged in
        flash('You must be logged in to view this page', 'error')
        return redirect(url_for('login_screen'))  # Redirect to login page if not logged in
    return render_template('lockers.html')


@app.route('/login', methods=['GET', 'POST'])
def login_screen():
    login_successful = False
    if request.method == 'POST':
        username = request.form.get('username')
        pin_parts = [
            request.form.get('pin1'),
            request.form.get('pin2'),
            request.form.get('pin3'),
            request.form.get('pin4')
        ]
        pin = ''.join(pin_parts)

        try:
            pin = int(pin)
            user = users_collection.find_one({'Username': username, 'Pin': pin})
            if user:
                session['username'] = username
                flash('Login successful, Redirecting...', 'success')
                login_successful = True
            else:
                flash('Invalid username or PIN', 'error')
        except ValueError:
            flash('Invalid PIN format', 'error')

    return render_template('index.html', login_successful=login_successful)



@app.route('/logout', methods=['GET', 'POST'])
def logout():
    session.clear()  # Clear the session
    flash('You have been logged out', 'success')
    return redirect(url_for('login_screen'))

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
