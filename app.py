from flask import Flask, render_template
import os
import logging

# הגדרת לוגים
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

print("Current directory:", os.getcwd())
print("Templates:", os.listdir('templates'))

app = Flask(__name__)

# פונקציה חדשה לבדיקת תוכן התיקייה static
@app.route('/check-static')
def check_static():
    try:
        path = os.path.join(app.root_path, 'static')
        files = os.listdir(path)
        return {"files_in_static": files}
    except Exception as e:
        return {"error": str(e), "path_checked": path}

# פונקציה קיימת לתצוגת הבית
@app.route('/')
def home():
    logger.debug("Home route was accessed.")
    return render_template('index.html')

# הרצה של האפליקציה
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))  # ברירת מחדל: 5000
    app.run(host='0.0.0.0', port=port, debug=True)

