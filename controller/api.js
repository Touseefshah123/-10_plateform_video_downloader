const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const getDateFormat = require("../utils/getDateFormat");
const { download } = require("../utils/downloadManager");
const Download = require("../mod/download");
const ytdl = require("ytdl-core");

const cpuCount = require("os").cpus().length;

// Recursive function to get all files in a directory and its subdirectories
function getFilesRecursively(directory) {
  const files = [];
  const contents = fs.readdirSync(directory);

  contents.forEach((item) => {
    const fullPath = path.join(directory, item);

    if (fs.statSync(fullPath).isDirectory()) {
      // Recursively get files from subdirectories
      files.push(...getFilesRecursively(fullPath));
    } else {
      files.push(fullPath);
    }
  });

  return files;
}

// Function to delete a folder and its contents
function deleteFolderRecursive(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = path.join(folderPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        // Recursive call to delete subfolders
        deleteFolderRecursive(curPath);
      } else {
        // Delete files
        fs.unlinkSync(curPath);
      }
    });
    // Delete the main folder
    fs.rmdirSync(folderPath);
  }
}

let activeDownloadProcess = null;

router.get('/youtube', async (req, res) => {
  try {
    const { url } = req.query;
    if (!ytdl.validateURL(url)) {
      return res.status(400).send('Invalid YouTube URL');
    }
    ytdl(url).pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.post("/download", async (req, res) => {
  try {
    const userId = req.body.userId;
    const downloadsFolder = `./downloads`;
    
    // Ensure the parent directory exists
    if (!fs.existsSync(downloadsFolder)) {
      fs.mkdirSync(downloadsFolder);
    } else {
      deleteFolderRecursive(downloadsFolder);
      fs.mkdirSync(downloadsFolder);
    }

    const timestampedFolder = `${downloadsFolder}/${getDateFormat()}`;
    // Create the timestamped directory
    fs.mkdirSync(timestampedFolder);

    // Set write permissions for the folder
    fs.chmodSync(timestampedFolder, "777");

    // Schedule folder deletion after 5 minutes
    setTimeout(() => {
      deleteFolderRecursive(timestampedFolder);
      console.log(`Deleted folder: ${timestampedFolder}`);
    }, 10 * 60 * 1000);

    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    // Download the file and get the file path
    const downloadObj = new Download(
      "single",
      url,
      "video",
      cpuCount, // Ensure cpuCount is defined or imported
      timestampedFolder
    );

    let filePath = '';

    if (downloadObj.inputType === "playlist") {
      // Implement logic for playlist download if necessary
    } else {
      // For single file download
      filePath = await download(
        downloadObj.inputType,
        downloadObj.url,
        downloadObj.outputType,
        downloadObj.cpuCount,
        downloadObj.downloadsFolder
      );
    }

    const downloadedFolder = path.join(__dirname, '../downloads'); // Adjust the path

    // Ensure the downloads folder exists
    if (!fs.existsSync(downloadedFolder)) {
      return res.status(404).json({ error: "No downloads found" });
    }

    // Check for read permissions
    try {
      fs.accessSync(downloadedFolder, fs.constants.R_OK);
    } catch (err) {
      return res.status(403).json({
        error: "Permission denied for accessing the downloads folder",
      });
    }

    // Get all files recursively in the downloads folder
    const allFiles = getFilesRecursively(downloadedFolder);

    // Define a set of common video file extensions
    const videoExtensions = new Set(['.mp4', '.avi', '.mkv', '.mov', '.flv', '.wmv', '.webm']);

    // Filter out files and consider only those with video extensions
    const savedVideos = allFiles.filter((file) => {
      return fs.statSync(file).isFile() && videoExtensions.has(path.extname(file).toLowerCase());
    });

    if (savedVideos.length === 0) {
      return res.status(404).json({ error: "No video files found" });
    }

    // Find the latest video file by modification time
    const latestVideo = savedVideos.reduce((latest, file) => {
      const latestTime = latest ? fs.statSync(latest).mtime : 0;
      const fileTime = fs.statSync(file).mtime;
      return fileTime > latestTime ? file : latest;
    }, null);

    if (!latestVideo) {
      return res.status(404).json({ error: "No video files found" });
    }

    // Return the URL of the latest video file
    const videoUrl =  `/downloads/${encodeURIComponent(path.relative(downloadedFolder, latestVideo).replace(/\\/g, '/'))}`;
// http://localhost:8080
   return res.status(200).json({
      message: "Download completed",
      folderPath: timestampedFolder,
      fileUrl: videoUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});








	

module.exports = router;
