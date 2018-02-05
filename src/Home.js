import React from "react";
import logo from './logo.svg';
import './App.css';

class Home extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      connection: null,
      username: '',
      password: ''
    }
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Tchat de test</h1>
        </header>
        <section className="row">
          <div className="col-8">
            <form>
              <input type="text" placeholder="username" className="form-control" />
              <input type="password" placeholder="password" className="form-control" />
              <input type="submit" value="Submit" className="form-control" />
            </form>
          </div>
          <aside className="col-4">
            <img src="#" alt="Logo" />
          </aside>
        </section>
      </div>
    )
  }
}

export default Home;
