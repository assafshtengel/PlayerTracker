from flask import Flask, render_template, request, jsonify
import os
import sqlite3

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
    return render_template('index.html')

@app.route('/save_data', methods=['POST'])
def save_data():
    data = request.get_json()
    conn = sqlite3.connect('games.db')
    c = conn.cursor()
    c.execute('''
    INSERT INTO games (playerName, teamName, position, gameDate, score, actions, parentNotes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
        data.get('playerName'),
        data.get('teamName'),
        data.get('position'),
        data.get('gameDate'),
        data.get('score', 0),
        str(data.get('actions', [])),
        str(data.get('parentNotes', []))
    ))
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
    return jsonify([{
        "id": r[0],
        "playerName": r[1],
        "teamName": r[2],
        "position": r[3],
        "gameDate": r[4],
        "score": r[5],
        "actions": r[6],
        "parentNotes": r[7]
    } for r in rows])

if __name__ == '__main__':
    app.run(debug=True)
