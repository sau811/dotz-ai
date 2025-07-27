export const API = {
    CHAT: "http://localhost:8000/chat",
    VOICE: "http://localhost:8000/voice",
    //VIDEO: "http://localhost:8000/video",
    SECURITY: "http://localhost:8000/security",
    IMAGE: "http://localhost:8000/image",
    FILE: "http://localhost:8000/file",
    ANALYSIS: "http://localhost:8000/analysis",
    WS: "ws://localhost:8000/ws",
  
    /** ✅ Upload Video to Backend */
    uploadVideo: async (videoBlob: Blob) => {
      const formData = new FormData();
      formData.append("file", videoBlob, "recorded-video.webm");
  
      try {
        const response = await fetch(API.VIDEO, {
          method: "POST",
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error(`Failed to upload video: ${response.statusText}`);
        }
  
        return await response.json(); // Expected response: { video_url: string, emotions?: string }
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
  };
  