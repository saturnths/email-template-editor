# Email Template Editor

The project uses Flask/Python3 and React (node v11.6.0).

Throws a `TemplateSyntaxError` if the template syntax is invalid and displays a warning. The server will return a 400 with the message "Validation failed".


## Getting started:

You need to run two separate servers; one for flask backend, and one for react frontend.

Refer to the installation instructions.

## Installation
If you use virtualenv, type `virtualenv .env && source .env/bin/activate && pip install -r requirements.txt` in the root directory to install the necessary packages.

Create a `sendgrid.env` file, with the following contents: `export SENDGRID_API_KEY='API_KEY'`, where `API_KEY` is your SendGrid key. Then type `source ./sendgrid.env`.

Also install dependencies for frontend: `npm install`.

## Running the app:

When installation is done, start the servers:

1. `FLASK_APP=run.py flask run` in the root directory.
2. `npm start`. I recommend running this command in a separate terminal tab or window.

The flask server runs on http://127.0.0.1:5000, and the react server runs on http://localhost:8080.

## TODO:
* Divide the app into blueprints to organize routes and views.
* Improve the way autoescaping is handled.
