class Download {
  constructor(inputType, url, outputType, cpuCount, downloadsFolder) {
    this.inputType = inputType;
    this.url = url;
    this.outputType = outputType;
    this.cpuCount = cpuCount;
    this.downloadsFolder = downloadsFolder;
    this.timestamp = new Date().toISOString();
  }

  // You can add methods or additional properties as needed
}

module.exports = Download;
