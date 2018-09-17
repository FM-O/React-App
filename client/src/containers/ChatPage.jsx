import React from 'react';
import Chat from '../components/Chat.jsx';
import Auth from '../modules/Auth';
import io from 'socket.io-client';


class ChatPage extends React.Component {
    /**
    * Class constructor.
    */
    constructor(props) {
        super(props);

        let errorTimeout = null;

        this.state = {
            username: props.username,
            usersList: [],
            message: '',
            messages: [],
            popoverProps: {
                open: false,
                anchorEl: null
            }
        };

        this.styles = {
            messageInput: {
                width: '100%'
            }
        };
        //// WARNING: second instance of IO (already defined in LoginPage)
        //replace by the current host IP
        this.socket = io('192.168.0.19:3000');

        this.socket.on('RECEIVE_MESSAGE', data => {
            addMessage(data);
        });

        this.socket.on('NEW_USER_CONNECTED', username => {
            addMessage({
                message: username + ' vient de se connecter',
                type: 'server-message'
            });
            addUserToList({
                name: username
            });
        });

        // Keeping this method in order to avoid a new request to Mongo (performances)
        const addUserToList = user => {
            this.setState({usersList: [...this.state.usersList, user]});
        };

        const addMessage = data => {
            if (this.state.messages.length > 15) this.state.messages.splice(0,5);
            this.setState({messages: [...this.state.messages, data]});
        };

        this.sendMessage = ev => {
            ev.preventDefault();
            if (this.state.message.trim().length <= 0) return this.displayError('Your message cannot be empty');

            this.socket.emit('SEND_MESSAGE', {
                author: this.state.username,
                message: this.state.message,
                type: 'user-message'
            });
            this.setState({message: ''}); //clear input
        };

        this.sendMessageByKeyInput = ev => {
            const kc = ev.which || ev.keyCode;
            if (kc !== 13) return;

            if (this.state.message.trim().length <= 0) {
                return this.displayError('Your message cannot be empty');
            }

            this.socket.emit('SEND_MESSAGE', {
                author: this.state.username,
                message: this.state.message,
                type: 'user-message'
            });
            this.setState({message: ''});
        };

        this.displayError = (message) => {
            clearTimeout(errorTimeout);
            this.setState({
                popoverProps: {
                    open: true,
                    content: message,
                    anchorEl: document.getElementById('message_input')
                }
            });

            errorTimeout = setTimeout(() => {
                this.setState({
                    popoverProps: {
                        open: false
                    }
                });
            }, 1500);
        }
    }
    /**
    * This method will be executed after initial rendering.
    */
    componentDidMount() {
        this.setState({
            popoverProps: {
                open: false,
                anchorEl: document.getElementById('message_input')
            }
        });

        const xhr = new XMLHttpRequest();
        xhr.open('get', '/api/getonlineusers');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        // set the authorization HTTP header
        xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
        xhr.responseType = 'json';
        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            this.setState({
                usersList: xhr.response.usersList
            });
          }
        });
        xhr.send();
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
            popoverProps={this.state.popoverProps}
            styles={this.styles}
            users={this.state.usersList}
            message={this.state.message}
            messages={this.state.messages}
            onChangeMessage={ev => this.setState({message: ev.target.value})}
            onKeyPressMessage={this.sendMessageByKeyInput}
            onSendMessage={this.sendMessage}/>);
    }
}

export default ChatPage;
