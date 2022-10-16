import functools
import json
import os

import json
import random
import string

import flask

from flask import Flask, flash, jsonify, redirect, render_template, request, session, url_for, request, Response, send_file, make_response
from flask_session import Session
from flask_compress import Compress
from flask_gzip import Gzip
from tempfile import mkdtemp
from werkzeug.exceptions import default_exceptions, HTTPException, InternalServerError

import requests
import urllib.parse

from functools import wraps

from helpers import apology, usd

from datetime import datetime
from datetime import timedelta

import atexit
import time

app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Only enable Flask debugging if an env var is set to true
app.debug = os.environ.get('FLASK_DEBUG') in ['true', 'True']

# Get app version from env
app_version = os.environ.get('APP_VERSION')


@app.before_request
def before_request():

    if request.url.startswith('http://') and not "localhost" in request.url:
        # url = request.url.replace('http://', 'https://', 1)
        # code = 301
        # return redirect(url, code=code) 
        pass
    session.permanent = True

# Ensure responses aren't cached
@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

# Custom filter
app.jinja_env.filters["usd"] = usd

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_FILE_DIR"] = mkdtemp()
app.config["SESSION_PERMANENT"] = True
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(days=31)
app.config["SESSION_TYPE"] = "filesystem"
app.config["SESSION_REFRESH_EACH_REQUEST"] = False

# app.secret_key = os.environ.get("FN_FLASK_SECRET_KEY", default=False)
app.secret_key = 'fuckyou'
# app.register_blueprint(google_auth.app)

Compress(app)
Gzip(app)
Session(app)


@app.route('/')
def index() :

    return render_template("index.html")


if __name__ == '__main__' :

    app.run()