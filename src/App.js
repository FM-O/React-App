import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      response: false,
      messageList: [null],
      endpoint: 'http://localhost:4001'
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on('FromAPI', data => this.setState({response: data}));

    const logo = document.getElementsByClassName('App-logo')[0];
    const messageBox = document.getElementById('text-input');
    const messageArea = document.getElementById('messages-area');
    logo.addEventListener('click', () => {
        const message = messageBox.value;

        socket.emit('messageSend', message);
    });

    socket.on('broadcastMessage', data => this.setState({messageList: data}));
  }
  render() {
    const { response } = this.state;
    const { messageList } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React, the temp is { Math.round((parseInt(response, 10) - 32) / 1.8) }</h1>
          {response}
        </header>
        <input id="text-input" placeholder="type your message" />
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload. <br />
        </p>
        <div id="messages-area">
          <span>{messageList}</span>
        </div>
      </div>
    );
  }
}

export default App;
