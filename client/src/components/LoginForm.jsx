import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

const LoginForm = ({
  onSubmit,
  onChange,
  errors,
  successMessage,
  user
}) => (
  <Card className="container">
    <form action="/" onSubmit={onSubmit}>
      <h2 className="card-heading">Login</h2>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {errors.summary && <p className="error-message">{errors.summary}</p>}

      <div className="field-line">
        <FormControl error={errors.email && errors.email.length > 0} aria-describedby="email-error-text">
            <InputLabel htmlFor="email-error">Email</InputLabel>
            <Input id="email-error" name="email" value={user.email} onChange={onChange} />
            {errors.email && <FormHelperText id="email-error-text">{errors.email}</FormHelperText>}
        </FormControl>
      </div>

      <div className="field-line">
        <FormControl error={errors.password && errors.password.length > 0} aria-describedby="password-error-text">
            <InputLabel htmlFor="password-error">Password</InputLabel>
            <Input id="password-error" type="password" name="password" value={user.password} onChange={onChange} />
            {errors.password && <FormHelperText id="password-error-text">{errors.password}</FormHelperText>}
        </FormControl>
      </div>

      <div className="button-line">
        <Button type="submit" variant="contained" color="primary">
            Log in
        </Button>
      </div>

      <p>Don't have an account ? <Link to={'/signup'}>Create one</Link>.</p>
    </form>
  </Card>
);

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

export default LoginForm;
