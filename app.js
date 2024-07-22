const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const path=require("path")
const apiRoutes = require("./controller/api"); // Assuming your routes are defined in a file named api.js
const app = express();
const port = 8080;

app.use(bodyParser.json());
const downloads = path.join(__dirname, '/downloads');

app.use(
 	cors({
 		origin: "http://localhost:3000",
		
 		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
 		allowedHeaders: ["Content-Type", "Authorization"],
    

 	})
 );
         
app.use("/downloads",express.static(downloads));
 
// Mount your API routes
app.use("/api", apiRoutes
	
);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
