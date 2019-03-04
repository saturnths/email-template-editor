import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Field extends Component {
  state = {};

  render() {
    const { id, key, value } = this.props.data;
    return (
      <div className="row field">
        <div className="col-sm-5">
          <div className="form-group">
            <label htmlFor="key-input">Key</label>
            <input
              id="key-input"
              type="input"
              value={key}
              onChange={e => this.props.onKeyChange(id, e.target.value)}
            />
          </div>
        </div>
        <div className="col-sm-5">
          <div className="form-group">
            <label htmlFor="key-value">Value</label>
            <input
              id="key-value"
              type="input"
              value={value}
              onChange={e => this.props.onValueChange(id, e.target.value)}
            />
          </div>
        </div>
        <div className="col-sm-1">
          <input
            type="button"
            className="btn btn-danger btn-sm remove-field"
            onClick={e => this.props.removeField(id)}
            value={"X"}
          />
        </div>
      </div>
    );
  }
}

Field.propTypes = {
  id: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  onKeyChange: PropTypes.func.isRequired,
  onValueChange: PropTypes.func.isRequired,
  removeField: PropTypes.func.isRequired
};

export default Field;
