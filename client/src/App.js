import React from 'react';
import './App.css';
import { Provider } from 'react-redux';
import store from './store';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Login from './component/Auth/Login';
import Register from './component/Auth/Register';
import Home from './component/Guest Page/Home';
import About from './component/Guest Page/About';

import AdminLogin from './component/Admin/Login';
import AdminHome from './component/Admin/Home';

import PrivateRoute from './routing/PrivateRoute';
import AdminRoute from './routing/AdminRoute';

const App = () => {
	return (
		<Provider store={store}>
			<Router>
				<Switch>
					<PrivateRoute exact path='/' component={Home} />
					<PrivateRoute exact path='/about' component={About} />
					<AdminRoute exact path='/admin/home' component={AdminHome} />
					<Route exact path='/login' component={Login} />
					<Route exact path='/register' component={Register} />
					<Route exact path='/admin' component={AdminLogin} />
				</Switch>
			</Router>
		</Provider>
	);
};

export default App;
