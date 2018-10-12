import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import Input from 'material-ui/TextField';
import Popover from 'material-ui/Popover';

const Chat = ({popoverProps, styles, users, message, messages, onChangeInput, onChangeMessage, onKeyPressMessage, onSendMessage }) => (
  <Card className="container">
    <CardTitle title="Chat" subtitle="You should get accesss to chat only after authentication."/>
    <div className="container">
        <div className="row">
          <div className="col-4">
            <div className="card">
              <div className="card-body">
                <div className="card-title">Global Chat</div>
                <div className="messages">
                  {messages.map((message, index) => {
                    if (message.type != 'server-message') {
                        return (
                          <div className='message' key={index}><span className='message__author'>{message.author}:</span> <span className='message__content'>{message.message}</span></div>
                        )
                    }

                    return (
                      <div className='server_message' key={index}>{message.message}</div>
                    )
                  })}
                </div>
                <div className="users_list">
                    <h2 className="users_list__title">Liste des utilisateurs</h2>
                    <div className="users_list__users">
                        {users.map((user, index) => {
                          return (
                            <div className='user' key={index}>{user.name}</div>
                          )
                        })}
                    </div>
                </div>
              </div>
              <div className="card-footer">
                <Popover
                    className='popover'
                    open={popoverProps.open}
                    anchorEl={popoverProps.anchorEl}
                    anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                    }}
                    transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'middle',
                    }}
                    >
                    <div className='popover__content'>{popoverProps.content}</div>
                </Popover>
                <Input id='message_input' type="text" placeholder="Message" className="form-control" value={message} onChange={onChangeMessage} onKeyPress={onKeyPressMessage} style={styles.messageInput} />
                <br />
                <button className="form-control" onClick={onSendMessage}>Send</button>
              </div>
            </div>
          </div>
        </div>
    </div>
  </Card>
);

export default Chat;
