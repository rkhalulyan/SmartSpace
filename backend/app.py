from flask import Flask

app = Flask(__name__)

@app.route('/')
def SmartSpace():
    return 'Welcome to SmartSpace Lockers!'

@app.route('/login')
def loginScreen():
    return 'Welcome to the login'