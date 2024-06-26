import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { adminLogin, adminLoadUser } from '../../Actions/adminActions';
import Navbar from './Layout/Navbar';

const Login = (props) => {
	const {
		adminLogin,
		adminLoadUser,
		admin: { admin_isAuthenticated, admin_error },
	} = props;

	useEffect(() => {
		localStorage.removeItem('token');
		if (localStorage.admin) {
			adminLoadUser();
		}

		if (admin_isAuthenticated) {
			props.history.push('/admin/home');
		}

		if (admin_error) {
			console.log(admin_error);
		}
	}, [adminLoadUser, admin_isAuthenticated, adminLogin]);

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const submit = (e) => {
		e.preventDefault();

		if (email === '' || password === '') {
			console.log('Please Enter All the Fields!');
		} else {
			adminLogin({
				email,
				password,
			});
		}
	};

	return (
		<Fragment>
			<Navbar />
			<div id='home-sec1'>
				<div className='App-Auth'>
					<form onSubmit={submit} className='auth-form'>
						<h2>Admin Login</h2>
						<div className='auth-input-div'>
							<label className='auth-label'>Email Id</label>
							<input
								type='email'
								placeholder='Enter Your Email ID'
								onChange={(e) => setEmail(e.target.value)}
								required
								className='auth-input'
							/>
						</div>
						<div className='auth-input-div'>
							<label className='auth-label'>Password</label>
							<input
								type='password'
								placeholder='Enter Password'
								onChange={(e) => setPassword(e.target.value)}
								required
								className='auth-input'
							/>
						</div>
						<input type='submit' value='Login' className='auth-button' />
					</form>
				</div>
			</div>
		</Fragment>
	);
};

Login.propTypes = {
	adminLogin: PropTypes.func.isRequired,
	adminLoadUser: PropTypes.func.isRequired,
	admin: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	admin: state.admin,
});

export default connect(mapStateToProps, { adminLogin, adminLoadUser })(Login);
