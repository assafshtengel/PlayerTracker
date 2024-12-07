#!/bin/bash
export FLASK_ENV=development
gunicorn --bind 0.0.0.0:8000 app:app
