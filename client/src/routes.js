import Base from './components/Base.jsx';
import HomePage from './components/HomePage.jsx';
import DashboardPage from './containers/DashboardPage.jsx';
import LoginPage from './containers/LoginPage.jsx';
import SignUpPage from './containers/SignUpPage.jsx';
import Auth from './modules/Auth';
import io from 'socket.io-client';

const routes = {
  // Base component (wrapper for the whole Application)
  component: Base,
  childRoutes: [
    {
      path: '/',
      getComponent: (location, callback) => {
        if (Auth.isUserAuthenticated()) {
          callback(null, DashboardPage);
        } else {
          callback(null, HomePage);
        }
      }
    },

    {
      path: '/login',
      component: LoginPage
    },

    {
      path: '/signup',
      component: SignUpPage
    },

    {
      path: '/logout',
      onEnter: (nextState, replace) => {
        const socket = io('192.168.0.19:3000');
        const xhr = new XMLHttpRequest();
        const formData = `socketId=${socket.id}`;
        xhr.open('POST', '/api/logout', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        // set the authorization HTTP header
        xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
        xhr.responseType = 'json';
        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            socket.emit('USER_DISCONNECT', {username: xhr.response.name, socketId: xhr.response.socketId});
          }
        });
        xhr.send(formData);

        // change the current URL to /
        Auth.deauthenticateUser();
        replace('/');
      }
    }
  ]
};

export default routes;
