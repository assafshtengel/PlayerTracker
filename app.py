from flask import Flask, render_template, request, jsonify
import os
import logging
import sqlite3

app = Flask(__name__)

# פונקציה ליצירת טבלת נתונים אם עדיין לא קיימת
def init_db():
    conn = sqlite3.connect('games.db')
    c = conn.cursor()
    # צור טבלה לשמירת נתוני המשחק
    c.execute('''
    CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        playerName TEXT,
        teamName TEXT,
        position TEXT,
        gameDate TEXT,
        score INTEGER,
        actions TEXT,
        parentNotes TEXT
        email TEXT
    )
    ''')
    conn.commit()
    conn.close()

init_db()  # צור טבלה אם לא קיימת

@app.route('/save_data', methods=['POST'])
def save_data():
    data = request.get_json()
    playerName = data.get('playerName', '')
    teamName = data.get('teamName', '')
    position = data.get('position', '')
    gameDate = data.get('gameDate', '')
    score = data.get('score', 0)
    actions = data.get('actions', [])
    parentNotes = data.get('parentNotes', [])
    # שמור את הנתונים בבסיס הנתונים
    conn = sqlite3.connect('games.db')
    c = conn.cursor()
    c.execute('''
    INSERT INTO games (playerName, teamName, position, gameDate, score, actions, parentNotes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (playerName, teamName, position, gameDate, score, str(actions), str(parentNotes)))
    conn.commit()
    conn.close()

    return jsonify({"status": "success"})

@app.route('/view_data', methods=['GET'])
def view_data():
    conn = sqlite3.connect('games.db')
    c = conn.cursor()
    c.execute("SELECT * FROM games")
    rows = c.fetchall()
    conn.close()

    data = []
    for r in rows:
        data.append({
            "id": r[0],
            "playerName": r[1],
            "teamName": r[2],
            "position": r[3],
            "gameDate": r[4],
            "score": r[5],
            "actions": r[6],
            "parentNotes": r[7]
        })
    return jsonify(data)

# הגדרת לוגים
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

print("Current directory:", os.getcwd())
if os.path.exists('templates'):
    print("Templates:", os.listdir('templates'))
else:
    print("No templates directory found.")

@app.route('/')
def home():
    logger.debug("Home route was accessed.")
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
