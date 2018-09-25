import React from 'react';
import Auth from '../modules/Auth';
import Dashboard from '../components/Dashboard.jsx';
import ChatPage from './ChatPage.jsx';


class DashboardPage extends React.Component {
  /**
   * Class constructor.
   */
   constructor(props) {
     super(props);

     this.state = {
       socketId: null,
       secretData: '',
       username: ''
     };
   }
   /**
   * This method will be executed after initial rendering.
   */
   componentDidMount() {
     const xhr = new XMLHttpRequest();
     xhr.open('get', '/api/dashboard');
     xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
     // set the authorization HTTP header
     xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
     xhr.withCredentials = true;
     xhr.responseType = 'json';
     xhr.addEventListener('load', () => {
       if (xhr.status === 201) {
         Auth.authenticateUser(xhr.response.token);
         this.setState({
           socketId: xhr.response.socketId,
           secretData: xhr.response.message,
           username: xhr.response.username
         });
       }

       if (xhr.status === 200) {
         this.setState({
           socketId: xhr.response.socketId,
           secretData: xhr.response.message,
           username: xhr.response.username
         });
       }
     });
     xhr.send();
   }

   /**
   * Render the component.
   */
   render() {
     return (
         <div>
         <Dashboard secretData={this.state.secretData} />
         <ChatPage username={this.state.username} socketId={this.state.socketId} />
         </div>
     );
   }
}

export default DashboardPage;
