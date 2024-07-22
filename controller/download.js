// utils/downloadManager.js
const EventEmitter = require("events");

function download(inputType, url, outputType, cpuCount, downloadsFolder) {
	const emitter = new EventEmitter();

	// Simulating download process
	setTimeout(() => {
		// Download complete
		emitter.emit("complete");
	}, 5000); // 5 seconds for example

	// Simulating download error
	setTimeout(() => {
		emitter.emit("error", new Error("Download failed"));
	}, 7000); // 7 seconds for example

	// Adding a method to cancel the download
	emitter.cancel = () => {
		emitter.emit("cancel");
	};

	return emitter;
}

module.exports = { download };
