import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardTitle, CardText } from 'material-ui/Card';

const Chat = ({ username, message, messages, onChangeInput, onChangeMessage, onKeyPressMessage, onSendMessage }) => (
  <Card className="container">
    <CardTitle title="Chat" subtitle="You should get accesss to chat only after authentication."/>
    <div className="container">
        <div className="row">
          <div className="col-4">
            <div className="card">
              <div className="card-body">
                <div className="card-title">Global Chat</div>
                <hr />
                <div className="messages">
                  {messages.map((message, index) => {
                    return (
                      <div key={index}>{message.author}: {message.message}</div>
                    )
                  })}
                </div>
              </div>
              <div className="card-footer">
                <input type="text" placeholder="Username" className="form-control" value={username} onChange={onChangeInput} />
                <br />
                <input type="text" placeholder="Message" className="form-control" value={message} onChange={onChangeMessage} onKeyPress={onKeyPressMessage} />
                <br />
                <button className="btn btn-primary form-control" onClick={onSendMessage}>Send</button>
              </div>
            </div>
          </div>
        </div>
    </div>
  </Card>
);

// Chat.propTypes = {
//   secretData: PropTypes.string.isRequired
// };

export default Chat;
