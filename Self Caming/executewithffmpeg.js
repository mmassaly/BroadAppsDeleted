const { exec } = require('child_process');


function convert (inputFilePath,outputFilePath)
{
	console.log("Inside");
	exec(`ffmpeg -i ${inputFilePath} ${outputFilePath}`, (error, stdout, stderr) => {
		if (error) {
			console.error('Error converting video:', error);
		} else {
			console.log('Video converted successfully!');
		}
	});
}

module.exports = {convert};