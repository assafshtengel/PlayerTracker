from flask import Flask, render_template, request, jsonify
import os
import logging
import sqlite3

app = Flask(__name__)

# יצירת מסד נתונים SQLite
def init_db():
    conn = sqlite3.connect('games.db')
    c = conn.cursor()
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
    )
    ''')
    conn.commit()
    conn.close()

init_db()

# שמירת הנתונים המתקבלים
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

    conn = sqlite3.connect('games.db')
    c = conn.cursor()
    c.execute('''
    INSERT INTO games (playerName, teamName, position, gameDate, score, actions, parentNotes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (playerName, teamName, position, gameDate, score, str(actions), str(parentNotes)))
    conn.commit()
    conn.close()

    return jsonify({"status": "success"})

# הצגת דף הבית
@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    logger = logging.getLogger(__name__)
    app.run(debug=True)
