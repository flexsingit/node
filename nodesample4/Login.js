import React, { Component } from 'react';
import { Field, SubmissionError,reduxForm } from 'redux-form';
import { Form, FormGroup } from 'react-bootstrap';
import { push } from 'react-router-redux';
import { Link } from 'react-router-dom';
import FormField from "./common/FormField";
import FormSubmit from "./common/FormSubmit";
import Alert from './common/Alert';
import { AUTH_REQUEST } from '../constant';
import SignUpBanner from './SignUpBanner';
import {connect} from 'react-redux';
class Login extends Component {
    constructor(props) {
      super(props);
      this.formSubmit = this.formSubmit.bind(this);
    }

    render() {
      const { error, handleSubmit, invalid, submitting} = this.props;
      
      return (
      	<div className="sign_con">
	      	<div className="sign_con_inner">
		      	<div className="signhd">Sign in</div>
		      	<div className="form supporfom">
			        <Form onSubmit={handleSubmit(this.formSubmit)}>
			        	<Alert alertVisible={error} alertMsg={error} className="danger" />
			          	<Field component={FormField} type="email" name="email" label="Email" placeholder="Email Address" theme="custom" className="input_both" doValidate={true}/>
			          	<Field component={FormField} type="password" name="password" label="Password" placeholder="Password" theme="custom" className="input_both" doValidate={true}/>
			          	<FormGroup className="clearfix">
			          	  	<div className="checkbox pull-left">
			          	    	<label>
			          	      		<Field name="remember_me" component="input" type="checkbox"/> Remember me
			          	    	</label>
			          	  	</div>
			          	  <div className="pull-right forgot_link">
			                <Link to="/forgot-password">Forgot Password?</Link>
			          	  </div>  
			          	</FormGroup>
			          	<FormSubmit error={error} invalid={invalid} submitting={submitting} formGroupClassName="margin-bot10" className="yellobtn" buttonSaveLoading="Processing..." buttonSave="Login"/>
			        </Form>
			    </div>    
		    </div>
		    <SignUpBanner/> 
		</div>    
      );
    }
    formSubmit(values) {
      	const { dispatch } = this.props;
      	return new Promise((resolve, reject) => {
        	dispatch({
          		type: AUTH_REQUEST,
          		user: values,
          		callbackError: (error) => {
            		reject(new SubmissionError({_error: error}));
          		},
          		callbackSuccess: () => {
            		dispatch(push('/dashboard'));
            		resolve();
          		}
        	})
      	});
    }
}
const LoginForm = reduxForm({
  	form: 'user_login',
  	validate: (values) => {
    	const errors = {};
    	if(!values.email) {
      		errors.email = 'Email is required';
    	}else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        	errors.email = 'Invalid email address'
      	}
      	if (!values.password) {
        	errors.password = 'Password is Required'
      	}
    	return errors;
  	}
})(Login);

const mapStateToProps = (state) => {
	if( state.auth.user ) {
		return ({
		 	initialValues: state.auth.user
		});	
	}
	return ({});
}

export default connect(mapStateToProps)(LoginForm);