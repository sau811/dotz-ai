import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Volume2, AlertCircle, Music } from 'lucide-react';
import { motion } from 'framer-motion';

const VoiceModule = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [volume, setVolume] = useState(1);
    const [responseText, setResponseText] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);
    const speechSynthesisRef = useRef<typeof window.speechSynthesis | null>(null);
    const [isPlayMediaActive, setIsPlayMediaActive] = useState(false);

    useEffect(() => {
        speechSynthesisRef.current = window.speechSynthesis;

        return () => {
            if (mediaRecorderRef.current?.state !== 'inactive') {
                mediaRecorderRef.current?.stop();
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            if (speechSynthesisRef.current?.speaking) {
                speechSynthesisRef.current.cancel();
            }
        };
    }, []);

    const startRecording = async () => {
        setError(null);
        setResponseText('');
        setIsProcessing(false);
        audioChunksRef.current = [];

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const options = { mimeType: 'audio/webm' };
            mediaRecorderRef.current = new MediaRecorder(stream, options);

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    audioChunksRef.current.push(e.data);
                }
            };

            mediaRecorderRef.current.onstop = async () => {
                setIsProcessing(true);
                try {
                    await processAudio();
                } catch (err) {
                    console.error('Processing error:', err);
                    setError('Failed to process audio');
                } finally {
                    setIsProcessing(false);
                    cleanupMedia();
                }
            };

            mediaRecorderRef.current.start(100);
            setIsRecording(true);

        } catch (err: any) {
            console.error('Recording error:', err);
            setError(`Microphone access denied: ${err.message}`);
            cleanupMedia();
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const processAudio = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio_file', audioBlob, 'recording.webm');

        try {
            const response = await fetch('http://localhost:8000/voice/process-audio', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `Request failed with status ${response.status}`);
            }

            const data = await response.json();
            setResponseText(data.text);
            speak(data.text);

        } catch (err: any) {
            console.error('API Error:', err);
            throw new Error(err.message || 'Failed to process voice command');
        }
    };

    const handlePlayMediaDemo = async () => {
        setIsPlayMediaActive(true);
        try {
            const response = await fetch('http://localhost:8000/voice/play-media', {
                method: 'POST',
            });
            const data = await response.json();
            console.log(data);
            alert(data.message || data.error || 'Attempting to play media...');
        } catch (error) {
            console.error('Error playing media:', error);
            alert('Failed to initiate media playback.');
        } finally {
            setIsPlayMediaActive(false);
        }
    };

    const speak = (text: string) => {
        if (speechSynthesisRef.current) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.volume = volume;
            speechSynthesisRef.current.speak(utterance);
        }
    };

    const cleanupMedia = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        mediaRecorderRef.current = null;
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(parseFloat(e.target.value));
    };

    const retryMicrophone = async () => {
        setError(null);
        await startRecording();
    };

    return (
        <div className="flex-grow flex items-center justify-center pt-16 h-[calc(100vh-64px)]">
            <div className="bg-[#1A1F2A] rounded-xl p-8 w-full max-w-2xl mx-4">
                <div className="flex flex-col items-center space-y-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2 text-white">
                            {isProcessing
                                ? 'Processing...'
                                : isRecording
                                    ? 'Recording...'
                                    : responseText
                                        ? 'Response Ready'
                                        : 'Ready to Record'}
                        </h2>
                        <p className="text-gray-400">
                            {isProcessing
                                ? 'Processing your voice command...'
                                : isRecording
                                    ? 'Click stop when finished'
                                    : responseText
                                        ? responseText
                                        : 'Click the microphone to start recording'}
                        </p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="w-full flex flex-col items-center text-center text-red-500"
                        >
                            <AlertCircle size={32} className="mb-2" />
                            <p className="mb-4">{error}</p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={retryMicrophone}
                                className="px-4 py-2 bg-[#4A90E2] rounded-lg hover:bg-[#357ABD] transition-colors text-white"
                            >
                                Retry Microphone
                            </motion.button>
                        </motion.div>
                    )}

                    <div className="flex items-center space-x-6">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={isRecording ? stopRecording : startRecording}
                            className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                                isRecording
                                    ? 'bg-red-500 hover:bg-red-600'
                                    : 'bg-[#4A90E2] hover:bg-[#357ABD]'
                            }`}
                            disabled={isProcessing}
                        >
                            {isRecording ? <Square size={24} /> : <Mic size={24} />}
                        </motion.button>

                        <div className="flex items-center space-x-2">
                            <Volume2 size={20} className="text-gray-400" />
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={volume}
                                onChange={handleVolumeChange}
                                className="w-32 h-2 bg-[#0D1117] rounded-lg appearance-none cursor-pointer"
                                style={{
                                    background: `linear-gradient(to right, #4A90E2 ${volume * 100}%, #0D1117 ${volume * 100}%)`,
                                }}
                            />
                        </div>
                    </div>

                    {isRecording && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="w-3 h-3 bg-red-500 rounded-full"
                        />
                    )}

                    {/* Button for Simplified Play Media Demo */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePlayMediaDemo}
                        className="px-6 py-3 bg-[#673AB7] hover:bg-[#512DA8] text-white rounded-lg font-semibold transition-colors"
                        disabled={isPlayMediaActive || isRecording || isProcessing}
                    >
                        <Music size={20} className="inline-block mr-2" />
                        (Simplified Demo)
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default VoiceModule;