from flask import Flask, render_template
import os


print("Current directory:", os.getcwd())
print("Templates:", os.listdir('templates'))

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
