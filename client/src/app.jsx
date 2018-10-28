import React from 'react';
import ReactDom from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { browserHistory, Router } from 'react-router';
import routes from './routes.js';

// SCSS config
require('../../server/static/scss/main.scss');

ReactDom.render((
  <MuiThemeProvider theme={createMuiTheme()}>
    <Router history={browserHistory} routes={routes} />
  </MuiThemeProvider>), document.getElementById('react-app'));
