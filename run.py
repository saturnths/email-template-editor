from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from jinja2 import Environment, BaseLoader
from jinja2.exceptions import TemplateSyntaxError
import os
import re
import urllib
import sendgrid
from sendgrid.helpers.mail import *
import simplejson as json
from invalid_usage import InvalidUsage
from markupsafe import escape


app = Flask(__name__)
app.config.from_object('config.DevelopmentConfig')
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})


@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    """
    Registers the InvalidUsage error handler.
    """
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response


def throw_validation_error():
    raise InvalidUsage('Validation failed', status_code=400)


def get_template(validate_email):
    """
    Handles the fetching of the template and passes along related fields,
    based on whether in preview or send mode.
    
    :param validate_email: boolean, determines if email should be validated.
    """
    email_reg = r"[^@]+@[^@]+\.[^@]+"

    req_data = request.get_json()
    content = get_body(req_data)
    from_email = req_data['from']
    to_email = req_data['to']
    fields = json.loads(req_data['fields'])

    validate(content, email_reg, from_email, to_email, validate_email, fields)
    template = Environment(loader=BaseLoader()).from_string(content)

    return template, content, fields, from_email, to_email


def validate(content, email_reg, from_email, to_email, validate_email, fields):
    """
    Does some validation and sanity checks. Verifies email address correctness and template syntax.
    """
    env = Environment()

    try:
        if type(fields) is not dict:
            throw_validation_error()
        if validate_email and (not re.match(email_reg, from_email) or not re.match(email_reg, to_email)):
            raise InvalidUsage('Email validation failed', status_code=400)
        env.parse(content)
    except TemplateSyntaxError:
        throw_validation_error()


def get_body(req_data):
    """
    Sanitizes HTML and replaces newlines by <br/> tags.
    """
    body = str(escape(req_data['body']))\
        .replace('&#34;', '')\
        .replace('\\n', '<br/>')
    return body


# Routes.
@app.route('/')
def home():
    return render_template('home.html')


@app.route('/api/preview', methods=['POST'])
def preview():
    template, content, fields, from_email, to_email = get_template(False)
    return render_template(template, body=content, **fields)


@app.route('/api/send', methods=['POST'])
def send_email():
    template, content, fields, from_email, to_email = get_template(True)
    template_html = render_template(template, body=content, **fields)

    try:
        # Attempt to send an email.
        sg = sendgrid.SendGridAPIClient(apikey=os.environ.get('SENDGRID_API_KEY'))
        sender = Email(from_email)
        recipient = Email(to_email)
        subject = 'Email Template Editor'
        content = Content('text/html', template_html)
        mail = Mail(sender, subject, recipient, content)
        response = sg.client.mail.send.post(request_body=mail.get())
    except urllib.error.HTTPError as err:
        raise InvalidUsage('API error', status_code=400)

    return jsonify({'message': 'Email was sent successfully.'})


if __name__ == '__main__':
    app.run(debug=True)
