import React from 'react';
import './InputField.css';

const InputField = (props) => (
  <div className="form">
    <input
      className="input"
      type="text"
      name="message"
      placeholder="Type a message..."
      value = {props.value}
      onChange = {props.onChange}
    />
    <button className="sendButton" onClick={props.onSubmit}>Send</button>
  </div>
)

export default InputField;