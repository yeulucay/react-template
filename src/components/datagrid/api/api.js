import axios from "axios";

const getToken = () => {
	let token = localStorage.getItem("auth_token");
	return `Bearer ${token}`;
}

export const api = (baseUrl) => {
	return axios.create({
		baseURL: baseUrl,
		withCredentials: true,
		headers: {
			"Content-Type": "application/json",
			Authorization: getToken(),
		},
	});
};

export async function getSchema(baseUrl) {
	return api(baseUrl).get(`/schema`);
}