import axios from 'axios';

const setAdminToken = (token) => {
	if (token) {
		axios.defaults.headers.common['x-admin-token'] = token;
	} else {
		delete axios.defaults.headers.common['x-admin-token'];
	}
};

export default setAdminToken;
