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
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import "./fontAwesome";
import { useState, useEffect } from "react";
import baseurl from "./baseurl";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

function App() {
    const [loading, setLoading] = useState(false);
    const [videos, setVideos] = useState([]);
    const [canceling, setCanceling] = useState(false);
    const [error, setError] = useState(null);
    const [url, setUrl] = useState("");
    const [response, setResponse] = useState("");
    const [isDownloading, setIsDownloading] = useState(false);
    const [userId, setUserId] = useState("");

    function generateUserId() {
        const timestamp = new Date().getTime().toString(36);
        const randomChars = Math.random().toString(36).substring(2, 8);
        return timestamp + randomChars;
    }

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
            setUserId(storedUserId);
        } else {
            const newUserId = generateUserId();
            setUserId(newUserId);
            localStorage.setItem("userId", newUserId);
        }
    }, []);

    const fetchVideos = async () => {
        try {
            const res = await baseurl.get(`/downloads/${userId}`);
			 const newVideos = res.data.savedVideos;

        // Check if there are any new videos
        const isNewVideo = newVideos.some(video => !videos.includes(video));

        // If there are new videos, stop ongoing downloads
        if (isNewVideo) {
            setIsDownloading(false);
        }
            setVideos(res.data.savedVideos);
			
        } catch (err) {
            console.error("Error fetching videos:", err);
        }
    };

    useEffect(() => {
        fetchVideos();
 
    }, [response]); 
       useEffect(() =>{

            fetchVideos();
			
					console.log("Videos state changed:", videos);
					
				}, [videos]);
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
            await fetchVideos();
			
        } catch (error) {
            console.error("Error downloading the video:", error);
        }
        finally{
           setLoading(false)
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsDownloading(true);
        

        try {
            const res = await baseurl.post("download", { url, userId });
            setResponse(res.data.message);
            setUrl("");
                
            // Fetch the updated list of videos after successful download
			
            await fetchVideos();
			
                              
             

        } catch (err) {
            setError("Error submitting URL");
            setIsDownloading(false);
            console.error("Error submitting URL:", err);
        } finally {
setLoading(true)
        }
    };

    const handleCancel = async () => {
        setCanceling(true);
        try {
            await baseurl.post("/cancel-download");
            setResponse("Download canceled successfully");
            
            setVideos([]);
        } catch (err) {
            console.error("Error canceling download:", err);
            setError("Error canceling download");
        } finally {
            setCanceling(false);
        }
    };

    const handleVideoDownload = (videoName) => {
		
        downloadVideo(videoName);

    };

    const lastThreeVideos = videos.slice(-1);

    return (
			<div className="App">
				<header className="App-header">
					<div>
						<h3>Download Video</h3>
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
								<label htmlFor="url"></label>
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
									disabled={isDownloading}
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
									className="btn btn-success"
									disabled={isDownloading}
								>
									Submit
								</button>
								<br />
								<br />
								&nbsp;&nbsp;&nbsp;
								<p style={{color:"blue"}}>
								{isDownloading &&(
										<span  >
											<p className="mr-10"> {response}</p>
											<FontAwesomeIcon
												icon={faSpinner}
												aria-hidden={false}
												spin
												size="1x" 
												
											/>
										</span>
									)}
								</p>
								{error && <p>{error}</p>}
							</div>
						</form>
					</div>

					<div></div>
					<div className="video-grid" style={{ fontSize: "16px" }}>

                        


						{videos.length > 0 ? (
							lastThreeVideos.map((video, index) => (
								<div key={index} className="video-item">
									<p>{video.split("/").pop()}</p>
									<button
										onClick={() => handleVideoDownload(video)}
										className="download-button"
										  
									>
										<FontAwesomeIcon icon={faDownload} size="2x" />
									</button>
								</div>
							))
						) : (
							      <p>No videos available</p>
						)}
						
					</div>
				</header>
			</div>
		);
}

export default App;
