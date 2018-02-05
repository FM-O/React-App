import Base from './components/Base.jsx';
import HomePage from './components/HomePage.jsx';
import LoginPage from './containers/LoginPage.jsx';
import SignUpForm from './containers/SignUpPage.jsx';

const routes = {
  // Base component (wrapper for the whole Application)
  component: Base,
  childRoutes: [
    {
      path: '/',
      component: HomePage
    },

    {
      path: '/login',
      component: LoginPage
    },

    {
      path: 'signup',
      component: SignUpForm
    }
  ]
};

export default routes;
