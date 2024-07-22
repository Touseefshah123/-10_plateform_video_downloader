import "./App.css";
// social icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faFacebook,
	faTwitter,
	faInstagram,
	faYoutube,
	faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import "./fontAwesome";
import { useState, useEffect } from "react";
import baseurl from "./baseurl";
function App() {
	const downloadVideo = async (videoName) => {
		try {
			const response = await fetch(`/download/${videoName}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = videoName;
			document.body.appendChild(a);
			a.click();
			a.remove();
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Error downloading the video:", error);
		}
	};
	// const [isDivVisible, setIsDivVisible] = useState(false);
	// const showForm = () => {
	// 	setIsDivVisible(!isDivVisible);
	// };
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [url, setUrl] = useState("");
	const [response, setResponse] = useState(null);
	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			setLoading(true);
			const res = await baseurl.post("download", { url }); // Adjust endpoint as necessary
			setResponse(res.data.message);
			setUrl("");
		} catch (err) {
			setError(err);
		}
	};
	return (
		<div className="App">
			<header className="App-header">
				<div>
					<h3>Click on the icon you want to download the video</h3>
					<button>
						<FontAwesomeIcon icon={faYoutube} size="2x" />
					</button>
					&nbsp;&nbsp;&nbsp;
					<button>
						<FontAwesomeIcon icon={faFacebook} size="2x" />
					</button>
					&nbsp;&nbsp;&nbsp;
					<button>
						<FontAwesomeIcon icon={faInstagram} size="2x" />
					</button>
					&nbsp;&nbsp;&nbsp;
					<button>
						<FontAwesomeIcon icon={faTwitter} size="2x" />
					</button>
					&nbsp;&nbsp;&nbsp;
					<button>
						<FontAwesomeIcon icon={faTiktok} size="2x" />
					</button>
				</div>
				<br />
				<div className="hiddenDiv">
					<form onSubmit={handleSubmit}>
						<div className="form-group">
							<label for="url"></label>
							<input
								required
								type="text"
								value={url}
								onChange={(e) => setUrl(e.target.value)}
								name="url"
								id="url"
								className="form-control"
								style={{
									width: "900px",
									height: "30px",
									fontSize: "20px",
									padding: "10px",
									borderRadius: "10px",
								}}
								placeholder="Enter url here to download"
								aria-describedby="helpId"
							/>
						</div>
						<br />
						<div className="form-group">
							<button
								type="submit"
								style={{
									width: "300px",
									height: "50px",
									backgroundColor: "blue",
									color: "white",
									border: "none",
									fontSize: "20px",
								}}
								className="brn brn-success"
							>
								Submit
							</button>
							<br />
							{response && <p>{response}</p>}
						</div>
					</form>
					<br />
				</div>
                       
				<div style={{  }}>
					<button
						style={{
							width: "300px",
							height: "50px",
							backgroundColor: "red",
							color: "white",
							border: "none",
							fontSize: "20px",
						}}
						className="brn brn-success"
						onClick={() => downloadVideo("example.mp4")}
					>
						Download Video
					</button>
				</div>
			</header>
		</div>
	);
}

export default App;
