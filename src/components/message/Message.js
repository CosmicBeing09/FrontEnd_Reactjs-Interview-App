import React from 'react';
import './Message.css';
import ReactEmoji from 'react-emoji';

const Message = ({message : {text, user}, name}) => {
    let isSentByCurrentUser = false;

    const trimmedName = name.trim().toLowerCase();

    if(user === trimmedName){
        isSentByCurrentUser = true;
    }

    let code = false;
    var textTemp = text;
    if(text.includes('<#>')){
      code = true;
      textTemp =  text.replace('<#>','');
    }
    else{
      code = false;
    }

    return(
        isSentByCurrentUser
        ? (
          <div className="messageContainer justifyEnd">
            <p className="sentText pr-10">{trimmedName}</p>
            {code ? (
              <div className="codeBox backgroundHighlight">
              <p className="messageText colorWhite">{ReactEmoji.emojify(textTemp)}</p>
            </div>):(
              <div className="messageBox backgroundBlue">
              <p className="messageText colorWhite">{ReactEmoji.emojify(textTemp)}</p>
            </div>)}
           
          </div>
          )
          : (
            <div className="messageContainer justifyStart">
                {code ? (
              <div className="codeBox backgroundHighlight">
              <p className="messageText colorWhite">{ReactEmoji.emojify(textTemp)}</p>
            </div>):(
              <div className="messageBox backgroundLight">
              <p className="messageText colorWhite">{ReactEmoji.emojify(textTemp)}</p>
            </div>)}
              <p className="sentText pl-10 ">{user}</p>
            </div>
          )
    );

}
export default Message;