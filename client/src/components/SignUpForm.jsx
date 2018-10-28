import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';


const SignUpForm = ({
  onSubmit,
  onChange,
  errors,
  user,
}) => (
  <Card className="container">
    <form action="/" onSubmit={onSubmit}>
      <h2 className="card-heading">Sign up</h2>

      {errors.summary && <p className="error-message">{errors.summary}</p>}
      <div className="field-line">
        <FormControl error={errors.name && errors.name.length > 0} aria-describedby="name-error-text">
            <InputLabel htmlFor="name-error">Name</InputLabel>
            <Input id="name-error" name="name" value={user.name} onChange={onChange} />
            {errors.password && <FormHelperText id="name-error-text">{errors.name}</FormHelperText>}
        </FormControl>
      </div>

      <div className="field-line">
        <FormControl error={errors.email && errors.email.length > 0} aria-describedby="email-error-text">
            <InputLabel htmlFor="email-error">Email</InputLabel>
            <Input id="email-error" name="email" value={user.email} onChange={onChange} />
            {errors.password && <FormHelperText id="email-error-text">{errors.email}</FormHelperText>}
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
            Create new account
        </Button>
      </div>

      <p>Already have an account ? <Link to={'/login'}>Log in</Link></p>
    </form>
  </Card>
);


SignUpForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
}

export default SignUpForm;
