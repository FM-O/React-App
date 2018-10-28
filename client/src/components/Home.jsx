import React from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';


const Home = ({ notification }) => (
  <Card id="home" className="container">
    {notification && <p className={notification.type}>{notification.message}</p>}
    <div>
        <Typography gutterBottom color="primary" variant="title" component="h1">
            React Application
        </Typography>
        <Typography gutterBottom color="primary" variant="subheading" component="h2">
            This is the home page
        </Typography>
    </div>
  </Card>
);

export default Home;
