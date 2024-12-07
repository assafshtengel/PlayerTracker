from flask import Flask, render_template
import os
import logging

# הגדרת לוגים
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# בדיקת תוכן התיקיות בהפעלה
def check_directories():
    try:
        static_path = os.path.join(os.getcwd(), 'static')
        templates_path = os.path.join(os.getcwd(), 'templates')
        logger.debug("Static directory content: %s", os.listdir(static_path))
        logger.debug("Templates directory content: %s", os.listdir(templates_path))
    except Exception as e:
        logger.error(f"Error checking directories: {e}")

check_directories()

app = Flask(__name__)

# בדיקת תוכן תיקיית static
@app.route('/check-static')
def check_static():
    try:
        path = os.path.join(app.root_path, 'static')
        files = os.listdir(path)
        logger.debug(f"Checking static directory at: {path}")
        return {"files_in_static": files}
    except Exception as e:
        logger.error(f"Error accessing static directory: {e}")
        return {"error": str(e), "path_checked": path}

# עמוד הבית
@app.route('/')
def home():
    logger.debug("Home route was accessed.")
    return render_template('index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))  # ברירת מחדל: 5000
    app.run(host='0.0.0.0', port=port, debug=True)

