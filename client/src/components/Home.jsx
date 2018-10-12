import React from 'react';
import { Card, CardTitle } from 'material-ui/Card';


const Home = ({ notification }) => (
  <Card id="home" className="container">
    {notification && <p className={notification.type}>{notification.message}</p>}
    <CardTitle title="React Application" subtitle="This is the home page" />
  </Card>
);

export default Home;
