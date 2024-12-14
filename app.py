from flask import Flask, render_template, jsonify

app = Flask(__name__, static_folder='static', template_folder='templates')

@app.route('/')
def home():
    return render_template('index.html')  # דף הבית לשחקן

@app.route('/coach')
def coach():
    return render_template('coach.html')  # דף המאמן

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.route('/status')
def status():
    return jsonify({"status": "running", "teams": 2})  # נתוני סטטוס לדוגמה

if __name__ == '__main__':
    app.run(debug=True)
