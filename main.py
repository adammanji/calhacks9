import functools
import json
from lib2to3.pgen2.literals import simple_escapes
import os
import re

from difflib import SequenceMatcher
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

import cohere

co = cohere.Client('eDxAAFeRgmyqM2FkPzHYxa7aPnBZYD8MLIqda803')
command_type_model = "2111452f-f3a2-4b6b-b680-db2366a7714f-ft"

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


@app.route('/', methods=['GET'])
def index() :

    return render_template("index.html")


@app.route('/nlp', methods=['POST'])
def nlp() :

    phrase = request.form['phrase']

    command = get_most_confident(co.classify(model=command_type_model, inputs=[phrase])).strip()
    info = {}

    if command == 'Create' :

        info['model'] = most_similar_model(phrase)

    elif command in ['Increase', 'Decrease', 'Set'] :

        info['variable'] = get_variable(phrase)
        try :
            info['amount'] = get_amount(phrase)
        except :
            return {'error': 'no number'}

        if command == 'Decrease' and info['amount'] > 0 :
            info['amount'] = -1 * info['amount']
    
    elif command == 'Plot' :

        info['variables'] = get_plot_variables(phrase)

    return {'command': command, 'info': info}



variables = ['mass', 'length', 'height', 'gravity', 'angle', 'angular velocity']
plot_variables = variables.copy() + ['potential', 'kinetic', 'over time']
models = ['block on a ramp', 'pendulum', 'quantum harmonic oscillator', 'mobius strip']



def similarity(a, b) :

    return SequenceMatcher(None, a, b).ratio()


def get_variable(phrase) :

    max_sim = 0.0
    output = ""
    for v in variables :
        sim = similarity(v, phrase)
        if sim > max_sim :
            max_sim = sim
            output = v
    return output


def get_plot_variables(phrase) :

    max_sim = 0.0
    output1 = ""
    for v in plot_variables :
        sim = similarity(v, phrase)
        if sim > max_sim :
            max_sim = sim
            output1 = v

    plot_variables.remove(output1)

    max_sim = 0.0
    output2 = ""
    for v in plot_variables :
        sim = similarity(v, phrase)
        if sim > max_sim :
            max_sim = sim
            output2 = v
    if max_sim < 0.1 :
        output2 = 'time'

    plot_variables.append(output1)

    if output1 == 'over time' :
        output1 = 'time'
    elif output2 == 'over time' :
        output2 = 'time'

    if output1 == 'time' :
        output1, output2 = output2, 'time'
    
    return [output1, output2]


def most_similar_model(phrase) :

    max_sim = 0.0
    output = ""
    for model in models :
        sim = similarity(model, phrase)
        if sim > max_sim :
            max_sim = sim
            output = model
    return output


def get_amount(phrase) :

    numbers = re.findall(r"[-+]?(?:\d*\.\d+|\d+)", phrase)
    return float(numbers[0])


def get_most_confident(result) :

    max_conf = 0.0
    output = ""

    for e in result.classifications[0].confidence :
        if e.confidence > max_conf :
            max_conf = e.confidence
            output = e.label

    return output



if __name__ == '__main__' :

    app.run()