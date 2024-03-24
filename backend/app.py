from flask import Flask, render_template, request, redirect, flash, url_for
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

@app.route('/signup')
def signup():
    return render_template('signup.html')

@app.route('/lockers')
def lockers():
    return render_template('lockers.html')

@app.route('/login', methods=['GET', 'POST'])
def login_screen():
    if request.method == 'POST':
        username = request.form.get('username')
        pin_parts = [
            request.form.get('pin1'),
            request.form.get('pin2'),
            request.form.get('pin3'),
            request.form.get('pin4')
        ]
        pin = ''.join(pin_parts)  # Concatenates the PIN parts into a single string

        try:
            pin = int(pin)
        except ValueError:
            flash('Invalid PIN format', 'error')
            return render_template('index.html')

        user = users_collection.find_one({'Username': username, 'Pin': pin})
        if user:
            flash('Login successful, Redirecting...', 'success')
            return render_template('index.html', login_successful=True)
        else:
            flash('Invalid username or PIN', 'error')

    return render_template('index.html', login_successful=False)


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
