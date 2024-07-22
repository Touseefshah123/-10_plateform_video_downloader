import axios from "axios";

const baseurl = axios.create({
	// baseURL: "http://localhost:8080/api/", //for localhost
	baseURL: "https://e385-182-177-38-214.ngrok-free.app/api/", // for live server

	headers: {
		"Content-Type": "application/json",
	},
});

export default baseurl;
