import {
	ADMIN_LOGIN_SUCCESS,
	ADMIN_LOGIN_FAIL,
	ADMIN_USER_LOADED,
	ADMIN_AUTH_ERROR,
	SET_ADMIN_AUTH_LOADING,
	CLEAR_ADMIN_ERRORS,
	ADMIN_LOGOUT,
	CREATE_STUDENT,
	STUDENT_ERROR,
	GET_STUDENTS,
	ADD_ATTENDANCE,
	ATTENDANCE_ERROR,
	GET_ATTENDANCE,
	ADD_NOTES,
	NOTES_ERROR,
	GET_NOTES,
	DELETE_NOTES,
} from '../Actions/types';

const initialState = {
	token: localStorage.getItem('admin'),
	admin_isAuthenticated: false,
	admin_loading: false,
	admin_user: null,
	admin_error: null,
	students: null,
	attendance: null,
	notes: null,
};

export default (state = initialState, action) => {
	switch (action.type) {
		case ADMIN_USER_LOADED:
			return {
				...state,
				admin_isAuthenticated: true,
				admin_loading: false,
				admin_user: action.payload,
				admin_error: null,
			};
		case ADMIN_LOGIN_SUCCESS:
			localStorage.setItem('admin', action.payload.token);
			return {
				...state,
				...action.payload,
				admin_isAuthenticated: true,
				admin_loading: false,
				admin_error: null,
			};
		case ADMIN_AUTH_ERROR:
		case ADMIN_LOGIN_FAIL:
			localStorage.removeItem('admin');
			return {
				...state,
				token: null,
				admin_isAuthenticated: false,
				admin_user: null,
				admin_error: action.payload,
				admin_loading: false,
			};
		case ADMIN_LOGOUT:
			localStorage.removeItem('admin');
			return {
				...state,
				token: null,
				admin_isAuthenticated: false,
				admin_user: null,
				admin_loading: false,
			};
		case SET_ADMIN_AUTH_LOADING:
			return {
				...state,
				admin_loading: true,
			};
		case CLEAR_ADMIN_ERRORS:
			return {
				...state,
				admin_error: null,
			};

		case GET_STUDENTS:
			return {
				...state,
				students: action.payload,
			};

		// Creating Student Account
		case CREATE_STUDENT:
			return {
				...state,
				students:
					state.students === null
						? [action.payload]
						: [action.payload, ...state.students],
			};
		case GET_ATTENDANCE:
			return {
				...state,
				attendance: action.payload,
			};
		case STUDENT_ERROR:
			return {
				...state,
				admin_error: action.payload,
			};
		case ADD_ATTENDANCE:
			return {
				...state,
				attendance:
					state.attendance === null
						? [action.payload]
						: [action.payload, ...state.attendance],
			};
		case ATTENDANCE_ERROR:
			return {
				...state,
				admin_error: action.payload,
			};
		// Notes
		case ADD_NOTES:
			return {
				...state,
				notes:
					state.notes === null
						? [action.payload]
						: [action.payload, ...state.notes],
			};
		case GET_NOTES:
			return {
				...state,
				notes: action.payload,
			};
		case DELETE_NOTES:
			return {
				...state,
				notes: state.notes.filter((n) => n._id !== action.payload),
			};
		case NOTES_ERROR:
			return {
				...state,
				admin_error: action.payload,
			};
		default:
			return state;
	}
};
