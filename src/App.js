import React, { Component } from "react";
import Fields from "./Fields";
import getDefaultTemplate from "./getDefaultTemplate";
import axios from "axios";
import "./App.css";

const generateId = () =>
  Math.random()
    .toString(36)
    .slice(3);

let DEFAULT_FIELDS = [
  {
    key: "first_name",
    value: "John"
  },
  {
    key: "product_name",
    value: "Super product"
  },
  {
    key: "price",
    value: "$29"
  }
];

DEFAULT_FIELDS.forEach(f => (f.id = generateId()));

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      senderEmail: "",
      recipientEmail: "",
      body: getDefaultTemplate(),
      fields: DEFAULT_FIELDS,
      status: ""
    };

    this.addField = this.addField.bind(this);
    this.removeField = this.removeField.bind(this);
    this.onBodyChange = this.onBodyChange.bind(this);
    this.onKeyChange = this.onKeyChange.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
    this.send = this.send.bind(this);
    this.preview = this.preview.bind(this);
    this.postData = this.postData.bind(this);
    this.onSenderEmailChange = this.onSenderEmailChange.bind(this);
    this.onRecipentEmailChange = this.onRecipentEmailChange.bind(this);
  }

  onBodyChange(e) {
    this.setState({ body: e.target.value });
  }

  addField() {
    const newField = {
      id: generateId(),
      key: "",
      value: ""
    };
    this.setState({ fields: this.state.fields.concat([newField]) });
  }

  removeField(id) {
    const newFields = this.state.fields.filter(f => f.id !== id);
    this.setState({ fields: newFields });
  }

  onKeyChange(id, key) {
    let { fields } = this.state;
    let index = fields.findIndex(f => f.id === id);
    fields[index].key = key;
    this.setState({ fields });
  }

  onValueChange(id, value) {
    let { fields } = this.state;
    let index = fields.findIndex(f => f.id === id);
    fields[index].value = value;
    this.setState({ fields });
  }

  postData(endpoint) {
    const self = this;
    let fieldsObj = {};
    this.state.fields.forEach(f => (fieldsObj[f.key] = f.value));

    axios
      .post(endpoint, {
        from: this.state.senderEmail,
        to: this.state.recipientEmail,
        fields: JSON.stringify(fieldsObj),
        body: JSON.stringify(this.state.body)
      })
      .then(function(response) {
        const status =
          response.data && response.data.message
            ? response.data.message
            : response.data;

        self.setState({ status });
      })
      .catch(function(error) {
        self.setState({ status: error.response.data.message });
      });
  }

  send(e) {
    e.preventDefault();
    this.postData("/send");
  }

  preview() {
    this.postData("/preview");
  }

  onSenderEmailChange(e) {
    this.setState({ senderEmail: e.target.value });
  }

  onRecipentEmailChange(e) {
    this.setState({ recipientEmail: e.target.value });
  }

  render() {
    return (
      <div className="app container">
        <h1>Email Template Editor</h1>

        <div className="row">
          <div className="col-sm-6">
            <h2>Defined Keys/Values</h2>

            <Fields
              fields={this.state.fields}
              addField={this.addField}
              onKeyChange={this.onKeyChange}
              onValueChange={this.onValueChange}
              removeField={this.removeField}
            />
          </div>
          <div className="col-sm-6">
            <h2>From and To fields</h2>

            <div className="row">
              <div className="col-sm-5">
                <div className="form-group">
                  <label htmlFor="sender">Sender email address</label>
                  <input
                    id="sender"
                    type="text"
                    onChange={this.onSenderEmailChange}
                  />
                </div>
              </div>
              <div className="col-sm-5">
                <div className="form-group">
                  <label htmlFor="recipient">Recipient email address</label>
                  <input
                    id="recipient"
                    type="text"
                    onChange={this.onRecipentEmailChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-6">
            <h2>Body</h2>
            <p>
              The raw template should be in Jinja2 format, but any HTML will be
              sanitized and escaped. Wrap fields with {"{{"} and {"}}"}.
            </p>
            <p>
              Example: <code>Hello {"{{first_name}}"}!</code>
            </p>
            <textarea
              className={"template-textarea"}
              value={this.state.body}
              onChange={this.onBodyChange}
            />
          </div>
          <div className="col-sm-6">
            <h2>Preview/Status</h2>
            <div
              className="status-area"
              dangerouslySetInnerHTML={{ __html: this.state.status }}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12">
            <input
              type="button"
              className="btn btn-default btn-main"
              value={"Get a preview"}
              onClick={this.preview}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12">
            <p>
              Before sending an email, please fill out all fields, including
              email addresses.
            </p>
            <input
              type="button"
              className="btn btn-primary btn-main"
              value={"Send email!"}
              onClick={this.send}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
