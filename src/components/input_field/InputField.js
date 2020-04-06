import React from 'react';
import './InputField.css';
import SendIcon from '@material-ui/icons/SendRounded';

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
    <button className="sendButton" onClick={props.onSubmit}><SendIcon/></button>
  </div>
)

export default InputField;