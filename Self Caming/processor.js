class MyWorkletProcessor extends AudioWorkletProcessor {
    process(inputs, outputs, parameters) {
        const input = inputs[0];
		const output = outputs[0];

		for (let channel = 0; channel < input.length; channel++) {
			output[channel].set(input[channel]);	
		}
		
        //this.port.postMessage(input);
		/*
		for(int i = 0; i < (inputs.length <= outputs.length)?inputs.length: outputs.length;++i)
		{
			const input = inputs[i];
			const output = outputs[i];

			for (let channel = 0; channel < input.length; channel++) {
				output[channel].set(input[channel]);	
			}
		}*/
        return true;
    }
}

registerProcessor('my-worklet-processor', MyWorkletProcessor);
