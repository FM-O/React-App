import React from 'react';
import Chat from '../components/Chat.jsx';
import io from 'socket.io-client';


class ChatPage extends React.Component {
  /**
   * Class constructor.
   */
   constructor(props) {
     super(props);

     this.state = {
      username: props.username,
      message: '',
      messages: []
    };

    //replace by the current host IP
    this.socket = io('192.168.0.18:3000');

    this.socket.on('RECEIVE_MESSAGE', data => {
      addMessage(data);
    });

    const addMessage = data => {
      console.log(this.state.messages.length);
      if (this.state.messages.length > 15) this.state.messages.splice(0,5);
      this.setState({messages: [...this.state.messages, data]});
      console.log(this.state.messages);
    };

    this.sendMessage = ev => {
      ev.preventDefault();
      this.socket.emit('SEND_MESSAGE', {
        author: this.state.username,
        message: this.state.message
      });
      this.setState({message: ''}); //clear input
    };

    this.sendMessageByKeyInput = ev => {
      const kc = ev.which || ev.keyCode;
      if (kc !== 13) return;

      this.socket.emit('SEND_MESSAGE', {
        author: this.state.username,
        message: this.state.message
      });
      this.setState({message: ''});
    };
   }
   /**
   * This method will be executed after initial rendering.
   */
   componentDidMount() {
   }

   componentWillReceiveProps(nextProps) {
       this.setState({
           username: nextProps.username
       });
   }

   /**
   * Render the component.
   */
   render() {
     return (<Chat
                username={this.state.username}
                message={this.state.message}
                messages={this.state.messages}
                onChangeInput={ev => this.setState({username: ev.target.value})}
                onChangeMessage={ev => this.setState({message: ev.target.value})}
                onKeyPressMessage={this.sendMessageByKeyInput}
                onSendMessage={this.sendMessage}/>);
   }
}

export default ChatPage;
