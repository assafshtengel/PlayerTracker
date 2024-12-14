from flask import Flask, render_template
import os
import logging

# הגדרת לוגים
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

print("Current directory:", os.getcwd())
print("Templates:", os.listdir('templates'))


app = Flask(__name__, static_folder='static', template_folder='templates')

@app.route('/')
def home():
    return render_template('index.html')  # דף הבית לשחקן

@app.route('/coach')
def coach():
    return render_template('coach.html')  # דף המאמן

if __name__ == '__main__':
    app.run(debug=True)
