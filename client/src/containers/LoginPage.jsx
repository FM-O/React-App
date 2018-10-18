import React from 'react';
import PropTypes from 'prop-types';
import Auth from '../modules/Auth';
import LoginForm from '../components/LoginForm.jsx';
import io from 'socket.io-client';

class LoginPage extends React.Component {
  /**
   * Class constructor.
   */
  constructor(props, context) {
    super(props, context);

    const storedMessage = localStorage.getItem('successMessage');
    let successMessage = '';

    if (storedMessage) {
      successMessage = storedMessage;
      localStorage.removeItem('successMessage');
    }

    this.socket = io('10.53.37.215:3000');

    // set the initial component state
    this.state = {
      errors: {},
      successMessage,
      user: {
        name: '',
        email: '',
        password: ''
      }
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
   processForm(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    const email = encodeURIComponent(this.state.user.email);
    const password = encodeURIComponent(this.state.user.password);
    const socketId = encodeURIComponent(this.socket.id);
    const formData = `email=${email}&password=${password}&socketId=${socketId}`;

    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('post', '/auth/login');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        //success

        // change the component-container state
        this.setState({
          errors: {}
        });

        const user = this.state.user;
        user['name'] = xhr.response.user.name;
        this.setState({
            user
        });

        //save the token
        Auth.authenticateUser(xhr.response.token);
        this.socket.emit("NEW_CONNECTION", xhr.response.user.name);
        //change the current url to /
        this.context.router.replace({
            pathname: '/',
            state: {reason: 'login'}
        });
      } else {
        //failure

        //change the component state
        const errors = xhr.response.errors ? xhr.response.errors: {};
        errors.summary = xhr.response.message;

        this.setState({
          errors
        });
      }
    });
    xhr.send(formData);
  }

  /**
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user
    });
  }

  /**
   * Render the component.
   */
  render() {
    return (
      <LoginForm
        onSubmit={this.processForm}
        onChange={this.changeUser}
        errors={this.state.errors}
        successMessage={this.state.successMessage}
        user={this.state.user}
      />
    );
  }
}

LoginPage.contextTypes = {
  router: PropTypes.object.isRequired
};

export default LoginPage;
