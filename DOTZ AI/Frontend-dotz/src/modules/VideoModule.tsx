import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Mic,
  Monitor,
  Maximize2,
  Minimize2,
  Video as VideoIcon,
  AlertCircle,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { incrementInteractionCount } from "../store/slices/uiSlice";
import { API } from "../store/api";

const VideoModule: React.FC = () => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [responseUrl, setResponseUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const dispatch = useDispatch();
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const aiResponseVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);

  // Initialize camera and microphone
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        if (userVideoRef.current) userVideoRef.current.srcObject = stream;
        setIsCameraOn(true);
        setIsMicOn(true);
        setError(null);
      } catch (err: any) {
        setError(`Failed to access media: ${err.message}`);
        setIsCameraOn(false);
        setIsMicOn(false);
      }
    };
    initializeMedia();

    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  // Toggle camera
  const handleCameraToggle = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(track => (track.enabled = !isCameraOn));
      setIsCameraOn(!isCameraOn);
      dispatch(incrementInteractionCount());
    }
  };

  // Toggle microphone
  const handleMicToggle = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => (track.enabled = !isMicOn));
      setIsMicOn(!isMicOn);
      dispatch(incrementInteractionCount());
    }
  };

  // Toggle screen sharing
  const handleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        if (userVideoRef.current) userVideoRef.current.srcObject = screenStream;
        streamRef.current = screenStream;
        screenStream.getVideoTracks()[0].onended = () => {
          initializeCamera();
          setIsScreenSharing(false);
        };
        setIsScreenSharing(true);
      } else {
        streamRef.current?.getTracks().forEach(track => track.stop());
        await initializeCamera();
        setIsScreenSharing(false);
      }
      dispatch(incrementInteractionCount());
    } catch (err: any) {
      setError(`Screen sharing failed: ${err.message}`);
    }
  };

  // Initialize camera (helper function)
  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (userVideoRef.current) userVideoRef.current.srcObject = stream;
      streamRef.current = stream;
      setIsCameraOn(true);
      setIsMicOn(true);
      setError(null);
    } catch (err: any) {
      setError(`Camera initialization failed: ${err.message}`);
    }
  };

  // Record and send to backend
  const handleRecordToggle = async () => {
    if (!streamRef.current || !isCameraOn) {
      setError("Camera must be active to record");
      return;
    }

    if (!isRecording) {
      const chunks: Blob[] = [];
      recorderRef.current = new MediaRecorder(streamRef.current, { mimeType: "video/webm" });
      recorderRef.current.ondataavailable = (e) => chunks.push(e.data);
      recorderRef.current.onstop = async () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("video", blob, "recording.webm");

        try {
          const response = await fetch(API.VIDEO, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          });
          if (!response.ok) throw new Error("Failed to process video");
          const data = await response.json();
          if (aiResponseVideoRef.current) aiResponseVideoRef.current.src = data.video_url;
          setResponseUrl(data.video_url);
        } catch (err: any) {
          setError(`Video processing error: ${err.message}`);
        }
      };
      recorderRef.current.start();
      setIsRecording(true);
    } else {
      recorderRef.current?.stop();
      setIsRecording(false);
      dispatch(incrementInteractionCount());
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = async () => {
    try {
      if (!isFullscreen) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err: any) {
      setError(`Fullscreen toggle failed: ${err.message}`);
    }
  };

  return (
    <div className="flex-grow flex flex-col h-[calc(100vh-64px)] pt-16 px-4">
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* User Video */}
        <div className="bg-[#1A1F2A] rounded-xl overflow-hidden relative min-h-[300px]">
          {error && !isCameraOn ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
              <AlertCircle size={48} className="text-red-500 mb-4" />
              <p className="text-red-500 mb-4">{error}</p>
            </div>
          ) : (
            <video ref={userVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          )}
        </div>

        {/* AI Response Video */}
        <div className="bg-[#1A1F2A] rounded-xl overflow-hidden relative min-h-[300px]">
          {responseUrl ? (
            <video ref={aiResponseVideoRef} autoPlay playsInline loop className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#0D1117]">
              <VideoIcon size={48} className="text-gray-600" />
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-[#1A1F2A] rounded-xl p-4 flex items-center justify-center space-x-4">
        <button onClick={handleCameraToggle} className="p-4 rounded-full bg-[#4A90E2]"><Camera size={24} /></button>
        <button onClick={handleMicToggle} className="p-4 rounded-full bg-[#4A90E2]"><Mic size={24} /></button>
        <button onClick={handleScreenShare} className="p-4 rounded-full bg-[#4A90E2]"><Monitor size={24} /></button>
        <button onClick={handleRecordToggle} className="p-4 rounded-full bg-red-500"><VideoIcon size={24} /></button>
        <button onClick={toggleFullscreen} className="p-4 rounded-full bg-[#4A90E2]">
          {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
        </button>
      </div>
    </div>
  );
};

export default VideoModule;
