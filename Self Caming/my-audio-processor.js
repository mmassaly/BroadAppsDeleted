// my-audio-processor.js
	class MyAudioProcessor extends AudioWorkletProcessor {
		process(inputs, outputs, parameters) {
			console.log(outputs);console.log(inputs);
			// Your custom audio processing logic here
			// Modify the audio data in 'inputs' and write to 'outputs'
			return true; // Return true to keep the processor alive
		}
	}

	registerProcessor('my-audio-processor', MyAudioProcessor);