from flask import Flask, render_template, request, jsonify
import sqlite3
import logging

app = Flask(__name__)

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

@app.route('/')
def home():
    # יציג את index.html עם בחירת תפקיד
    return render_template('index.html')

@app.route('/player')
def player_page():
    return render_template('player.html')

@app.route('/coach')
def coach_page():
    return render_template('coach.html')

@app.route('/analyst')
def analyst_page():
    return render_template('analyst.html')

@app.route('/save_data', methods=['POST'])
def save_data():
    data = request.get_json() or {}
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

if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    app.run(debug=True)
