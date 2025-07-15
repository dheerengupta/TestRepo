// Create a simple demo audio file for testing
function createDemoAudio() {
    // Create a simple sine wave audio data URI
    const sampleRate = 44100;
    const duration = 10; // 10 seconds
    const frequency = 528; // 528 Hz (healing frequency)
    
    const samples = sampleRate * duration;
    const audioData = new Float32Array(samples);
    
    // Generate sine wave
    for (let i = 0; i < samples; i++) {
        audioData[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate) * 0.3;
    }
    
    // Convert to 16-bit PCM
    const pcmData = new Int16Array(samples);
    for (let i = 0; i < samples; i++) {
        pcmData[i] = Math.round(audioData[i] * 32767);
    }
    
    // Create WAV file
    const wavData = createWAVFile(pcmData, sampleRate);
    const blob = new Blob([wavData], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    
    return url;
}

function createWAVFile(audioData, sampleRate) {
    const length = audioData.length;
    const buffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(buffer);
    
    // WAV header
    const writeString = (offset, string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * 2, true);
    
    // Audio data
    for (let i = 0; i < length; i++) {
        view.setInt16(44 + i * 2, audioData[i], true);
    }
    
    return buffer;
}

// Test the demo audio
console.log('Demo audio URL:', createDemoAudio());