import {
	// REGISTER_FAIL,
	// REGISTER_SUCCESS,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	USER_LOADED,
	AUTH_ERROR,
	SET_AUTH_LOADING,
	CLEAR_AUTH_ERRORS,
	LOGOUT,
} from '../Actions/types';

const initialState = {
	token: localStorage.getItem('token'),
	isAuthenticated: false,
	loading: false,
	user: null,
	error: null,
};

export default (state = initialState, action) => {
	switch (action.type) {
		case USER_LOADED:
			return {
				...state,
				isAuthenticated: true,
				loading: false,
				user: action.payload,
			};
		// case REGISTER_SUCCESS:
		case LOGIN_SUCCESS:
			localStorage.setItem('token', action.payload.token);
			return {
				...state,
				...action.payload,
				isAuthenticated: true,
				loading: false,
				error: null,
			};
		case AUTH_ERROR:
		case LOGIN_FAIL:
			localStorage.removeItem('token');
			return {
				...state,
				token: null,
				isAuthenticated: false,
				user: null,
				error: action.payload,
				loading: false,
			};
		case LOGOUT:
			localStorage.removeItem('token');
			return {
				...state,
				token: null,
				isAuthenticated: false,
				user: null,
				loading: false,
			};
		case SET_AUTH_LOADING:
			return {
				...state,
				loading: true,
			};
		case CLEAR_AUTH_ERRORS:
			return {
				...state,
				error: null,
			};
		default:
			return state;
	}
};
