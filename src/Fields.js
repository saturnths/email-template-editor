import React, { Component } from "react";
import PropTypes from "prop-types";
import Field from "./Field";

class Fields extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    const { fields } = this.props;

    return (
      <div>
        <div className="row">
            <div className="col-sm-8">
              {fields.map(f => (
                <Field
                  key={f.id}
                  id={f.id}
                  data={f}
                  onKeyChange={this.props.onKeyChange}
                  onValueChange={this.props.onValueChange}
                  removeField={this.props.removeField}
                />
              ))}
            </div>
            <div className="col-sm-2">
            </div>
            <div className="col-sm-2">
            </div>
        </div>
        <div className="row">
            <div className="col-sm-12">
              <input
                type="button"
                className="btn btn-success btn-sm"
                value={"Add a new key/value pair"}
                onClick={this.props.addField}
              />
            </div>
        </div>
      </div>
    );
  }
}

Fields.propTypes = {
  fields: PropTypes.array.isRequired,
  addField: PropTypes.func.isRequired,
  onKeyChange: PropTypes.func.isRequired,
  onValueChange: PropTypes.func.isRequired,
  removeField: PropTypes.func.isRequired
};

export default Fields;
