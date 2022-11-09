const dotenv = require('dotenv');
const path = require('path');
dotenv.config({
  path: './config.env'
});

// Example filename: index.js

const fs = require('fs')
const { Deepgram } = require('@deepgram/sdk')

// Your Deepgram API Key
const deepgramApiKey = process.env.DEEPGRAM_SECRET;





// getTranscript(path.resolve(__dirname, './videos/1667966903185-Hollow Ichigo Speech - Instinct.mp4'));

async function getTranscript(filePath){

  const file = filePath;
  
  // Mimetype for the file you want to transcribe
  // Only necessary if transcribing a local file
  // Example: audio/wav
  const mimetype = 'video/mp4'
  
  const deepgram = new Deepgram(deepgramApiKey)
  
  // Check whether requested file is local or remote, and prepare accordingly
  if (file.startsWith('http')) {
    // File is remote
    // Set the source
    source = {
      url: file,
    }
  } else {
    // File is local
    // Open the audio file
    const audio = fs.readFileSync(file)
  
    // Set the source
    source = {
      buffer: audio,
      mimetype: mimetype,
    }
  }

  try {
    const transcriptProcess = await deepgram.transcription.preRecorded(source, {
      punctuate: true,
    });
  
    const data = transcriptProcess.results.channels[0].alternatives[0].transcript;
    const pathFolder = path.resolve(__dirname, './video_transcription');
    const fileName = `${path.basename(filePath).split('.')[0]}.txt`;
    const pathTranscriptFile = path.resolve(__dirname, `./video_transcription/${fileName}`);
    
    if(!fs.existsSync(pathFolder)){
      fs.mkdir(pathFolder, (err)=>{
        if(err){
          return console.error(err);
        }

        return;
      })
    }

    fs.writeFile(pathTranscriptFile, data, (err)=>{
      if(err){
        throw err;
      }
    });

    return {
      data,
      fileLocation: pathTranscriptFile
    };

    // console.dir(data, {
    //   depth: null
    // });

  } catch (error) {
    console.log(error);
  }

}

module.exports = getTranscript;
