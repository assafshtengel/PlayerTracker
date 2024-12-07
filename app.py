from flask import Flask, render_template
import os
import logging

# הגדרת לוגים
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

print("Current directory:", os.getcwd())
print("Templates:", os.listdir('templates'))

app = Flask(__name__)

@app.route('/check-static')
def check_static():
    import os
    files = os.listdir('static')
    return {"files_in_static": files}

@app.route('/')
def home():
    logger.debug("Home route was accessed.")
    return render_template('index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))  # ברירת מחדל: 5000
    app.run(host='0.0.0.0', port=port, debug=True)

