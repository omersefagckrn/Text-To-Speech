import axios from 'axios';

const URL = 'http://127.0.0.1:5000';

const getLinks = async () => {
	const response = await axios.get(`${URL}/api/link`, {
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (response.data && response.status === 200) {
		return response.data;
	}

	return Promise.reject(response.data);
};

const addLink = async (link) => {
	const response = await axios.post(`${URL}/api/link`, link, {
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (response.data && response.data.type && response.status === 201) {
		return response.data;
	}

	return Promise.reject(response.data);
};

const speechService = {
	getLinks,
	addLink
};

export default speechService;
