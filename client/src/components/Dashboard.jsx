import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

const Dashboard = ({ secretData }) => (
  <Card className="container">
    <Typography gutterBottom color="primary" variant="title" component="h1">
        Dashboard
    </Typography>
    <Typography gutterBottom color="primary" variant="subheading" component="h2">
        You should get accesss to this page only after authentication.
    </Typography>
    {secretData && <p style={{ fontSize: '16px', color: 'green' }}>{secretData}</p>}
  </Card>
);

Dashboard.propTypes = {
  secretData: PropTypes.string.isRequired
};

export default Dashboard;
