print("Hello world!")
import os
print("Hello world!")
import pandas as pd
import numpy as np
import requests
import time
import csv
import json
from bs4 import BeautifulSoup
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


#################################################
# Database Setup
#################################################


engine = create_engine("sqlite:///db/corona_new.db")

Base = automap_base()

Base.prepare(engine, reflect=True)

country_date = Base.classes.country_date
lockdown = Base.classes.lockdown


@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/namelist")
def namelist():
    """Return a list of names."""


    session = Session(engine)

    results = session.query(lockdown.country).order_by(lockdown.country).all()

    #session.close()
    all_symbols = list(np.ravel(results))
    sym = all_symbols[1]

    return jsonify(all_symbols)




@app.route("/countries/<country>")
def countries_func(country):
    """Return country info."""

    session = Session(engine)
    results = session.query( lockdown.country, lockdown.population, lockdown.density,lockdown.med_age, lockdown.lockdown_date, lockdown.lockdown_type, lockdown.Reference).\
    filter(lockdown.country == country).all()
    #session.close()
    
    data = list(np.ravel(results))


    return jsonify(data)



@app.route("/new_cases/<country>")
def new_cases(country):

    session = Session(engine)
    results = session.query( country_date.date, country_date.new_cases).\
    filter(country_date.country == country).all()
    print(results)

    return jsonify(results)

@app.route("/new_cases_all")
def new_cases_all():

    session = Session(engine)
    results = session.query( country_date.country, country_date.date, country_date.new_cases).all()
    print(results)

    return jsonify(results)



if __name__ == "__main__":
    app.run()
