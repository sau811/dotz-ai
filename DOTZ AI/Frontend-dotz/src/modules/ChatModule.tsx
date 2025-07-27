// ChatModule.tsx
import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { Send, Image, Paperclip, Bot, Download } from "lucide-react";
import { API } from "../store/api";
import FileAttachmentModal from "../components/FileAttachmentModal";
import ImageGenerationModal from "../components/ImageGenerationModal";
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: string;
  isTyping?: boolean;
  attachment?: {
    type: "image" | "file";
    content: string;
    name?: string;
  };
}

const ChatModule: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isFileAttachmentModalOpen, setIsFileAttachmentModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatGradientAnimation = useAnimation();
  const inputGradientAnimation = useAnimation();
  const userId = localStorage.getItem("user_id") || `user-${Date.now()}`;

  useEffect(() => {
    localStorage.setItem("user_id", userId);
    const animateChatGradient = async () => {
      await chatGradientAnimation.start({
        borderColor: ["rgb(160, 32, 240)", "rgb(0, 191, 255)", "rgb(160, 32, 240)"],
        transition: { duration: 5, repeat: Infinity, repeatType: "loop" },
      });
    };
    const animateInputGradient = async () => {
      await inputGradientAnimation.start({
        borderColor: ["rgb(160, 32, 240)", "rgb(0, 191, 255)", "rgb(160, 32, 240)"],
        transition: { duration: 5, repeat: Infinity, repeatType: "loop" },
      });
    };

    animateChatGradient();
    animateInputGradient();
  }, [chatGradientAnimation, inputGradientAnimation, userId]);

  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket("ws://127.0.0.1:8000/chat/ws");
      ws.onopen = () => console.log("WebSocket connected");

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          let botText = data.message;
          if (typeof data === 'string') {
            botText = event.data;
          }
          setMessages((prev) => [
            ...prev.filter((msg) => !msg.isTyping),
            {
              id: Date.now().toString(),
              text: botText || event.data,
              sender: "bot",
              timestamp: new Date().toLocaleTimeString(),
              attachment: data.attachment
                ? { type: data.attachment.type, content: data.attachment.content, name: data.attachment.name }
                : undefined,
            },
          ]);
        } catch {
          setMessages((prev) => [
            ...prev.filter((msg) => !msg.isTyping),
            {
              id: Date.now().toString(),
              text: event.data,
              sender: "bot",
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
        }
      };

      ws.onerror = (err) => console.error("WebSocket error:", err);
      ws.onclose = () => {
        console.log("WebSocket closed, attempting reconnect...");
        setTimeout(connectWebSocket, 3000);
      };
      setSocket(ws);
    };

    connectWebSocket();
    return () => socket?.close();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || !socket) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    setMessages((prev) => [
      ...prev,
      { id: "typing", text: "", sender: "bot", timestamp: "", isTyping: true },
    ]);

    socket.send(JSON.stringify({ message: input, user_id: userId }));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setSelectedFile(e.target.files[0]);
    setIsFileAttachmentModalOpen(true);
  };

  const handleFileConfirmUpload = async () => {
    if (!selectedFile) return;
    const token = localStorage.getItem("token");

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: `Attached file: ${selectedFile.name}`,
        sender: "user",
        timestamp: new Date().toLocaleTimeString(),
        attachment: { type: "file", content: URL.createObjectURL(selectedFile), name: selectedFile.name },
      },
    ]);

    const formData = new FormData();
    formData.append("message", `Attached file: ${selectedFile.name}`);
    formData.append("attachments", selectedFile);

    try {
      const response = await fetch(`${API.FILE}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: data.response,
          sender: "bot",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (error) {
      console.error("File upload error:", error);
    } finally {
      setIsFileAttachmentModalOpen(false);
      setSelectedFile(null);
    }
  };

  const handleGenerateImage = (imageData: string) => {
    const imageUrl = `data:image/png;base64,${imageData}`;
    console.log("Image URL:", imageUrl);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: 'Generated Image',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
        attachment: { type: 'image', content: imageUrl },
      },
    ]);
  };

  const handleDownloadImage = (imageUrl: string, filename: string) => {
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex-grow flex flex-col h-[calc(100vh-64px-80px)] pt-16">
      <div className="flex-grow flex flex-col">
        <motion.div
          className="overflow-y-auto space-y-4 mb-4 rounded-lg p-4"
          animate={chatGradientAnimation}
          style={{
            height: "calc(100vh - 300px)",
            border: "3px solid",
            background: "rgba(255, 255, 255, 0.05)",
            borderTop: "3px solid transparent",
          }}
        >
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-[70%] rounded-lg p-3 bg-[#2D3748] text-gray-200">
                {message.isTyping ? (
                  <div className="flex items-center space-x-2">
                    <Bot size={20} />
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}>
                      Typing...
                    </motion.div>
                  </div>
                ) : (
                  <>
                    {message.sender === "bot" ? (
                      <div>
                        {message.text.split("```").map((part, index) => {
                          if (index % 2 === 1) {
                            return (
                              <pre key={index} className="bg-[#1E293B] rounded-md p-4 my-2 overflow-x-auto">
                                <code className="text-sm text-gray-200">{part}</code>
                              </pre>
                            );
                          } else {
                            return (
                              <div key={index} className="markdown-body">
                                <ReactMarkdown>{part}</ReactMarkdown>
                              </div>
                            );
                          }
                        })}
                      </div>
                    ) : (
                      <p>{message.text}</p>
                    )}
                    {message.attachment?.type === "image" && message.attachment?.content && ( //added content check.
                      <div>
                        <img src={message.attachment.content} alt="Generated" className="rounded-lg max-w-full" />
                        <button
                          onClick={() => handleDownloadImage(message.attachment.content, "generated_image.png")}
                          className="mt-2 text-blue-400 hover:underline flex items-center"
                        >
                          <Download size={16} className="mr-1" /> Download
                        </button>
                      </div>
                    )}
                    {message.attachment?.type === "file" && message.attachment?.content && message.attachment?.name && ( //added content and name check.
                      <a
                        href={message.attachment.content}
                        download={message.attachment.name}
                        className="text-blue-400 underline block mt-2"
                      >
                        {message.attachment.name}
                      </a>
                    )}
                    <span className="text-xs opacity-70 mt-1 block">{message.timestamp}</span>
                  </>
                )}
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </motion.div>

        <motion.div
          className="flex items-center space-x-2 rounded-lg p-2"
          animate={inputGradientAnimation}
          style={{
            border: "3px solid",
            background: "rgba(255, 255, 255, 0.05)",
            marginTop: "10px",
            marginBottom: "20px",
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-grow bg-transparent border-none focus:outline-none text-white px-3 py-2"
            placeholder="Type your message..."
          />
          <button onClick={() => setIsImageModalOpen(true)}>
            <Image size={20} />
          </button>
          <button onClick={() => document.getElementById("fileInput")?.click()}>
            <Paperclip size={20} />
          </button>
          <button onClick={handleSendMessage}>
            <Send size={20} />
          </button>
          <input type="file" id="fileInput" style={{ display: "none" }} onChange={handleFileUpload} />
        </motion.div>
      </div>

      {isImageModalOpen && (
        <ImageGenerationModal onClose={() => setIsImageModalOpen(false)} onGenerate={handleGenerateImage} isOpen={isImageModalOpen} />
      )}

      {isFileAttachmentModalOpen && selectedFile && (
        <FileAttachmentModal onAttach={handleFileConfirmUpload} />
      )}
    </div>
  );
};

export default ChatModule;