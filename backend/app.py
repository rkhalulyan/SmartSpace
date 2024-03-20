from flask import Flask, render_template

# Initialize the Flask application specifying the template and static folders
app = Flask(
    __name__,
    template_folder='/frontend/pages',  # Set the correct path for your templates
    static_folder='/frontend/css'  # Set the correct path for your static files like CSS
)

@app.route('/')
def home():
    return render_template('index.html')  # Render the template at the specified path

@app.route('/signup')
def signup():
    return render_template('signup.html') 

@app.route('/login')
def login_screen():
    return 'Welcome to the login'

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)