import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, File as FileIcon } from 'lucide-react';

const API = {
  FILE: "http://127.0.0.1:8000/file/upload/", // Replace with actual API
};

const FileUploader: React.FC<{ onAttach: (fileUrl: string) => void }> = ({ onAttach }) => {
  const [messages, setMessages] = useState<any[]>([]); 
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isFileAttachmentModalOpen, setIsFileAttachmentModalOpen] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setSelectedFile(e.target.files[0]);
    setIsFileAttachmentModalOpen(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
      setIsFileAttachmentModalOpen(true);
    }
  };

  const handleFileConfirmUpload = async () => {
    if (!selectedFile) return;

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("message", `Attached file: ${selectedFile.name}`);
    formData.append("attachments", selectedFile);

    // ✅ Add user message with file preview
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: `Attached file: ${selectedFile.name}`,
        sender: "user",
        timestamp: new Date().toLocaleTimeString(),
        attachment: { type: "file", content: URL.createObjectURL(selectedFile) },
      },
    ]);

    try {
      const response = await fetch(API.FILE, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      onAttach(data.fileUrl);

      // ✅ Bot response after successful upload
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

  return (
    <>
      <AnimatePresence>
        {isFileAttachmentModalOpen && (
          <motion.div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <motion.div className="bg-[#1A1F2A] rounded-xl p-6 w-full max-w-md relative">
              <button
                onClick={() => setIsFileAttachmentModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-bold mb-6">Attach a File</h2>

              {/* Drag & Drop Area */}
              <div
                onDragEnter={() => setDragActive(true)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  dragActive ? 'border-[#4A90E2] bg-[#4A90E2]/10' : 'border-gray-700'
                }`}
              >
                <Upload className="mx-auto mb-4 text-gray-400" size={32} />
                <p className="text-gray-400 mb-2">Drag & Drop a file here</p>
                <input id="fileInput" type="file" className="hidden" onChange={handleFileUpload} />
                <span
                  className="text-[#4A90E2] hover:text-[#357ABD] cursor-pointer"
                  onClick={() => document.getElementById('fileInput')?.click()}
                >
                  Browse Files
                </span>
              </div>

              {/* Selected File Preview */}
              {selectedFile && (
                <div className="mt-4 flex items-center p-2 bg-[#0D1117] rounded-lg">
                  <FileIcon className="text-gray-400" size={20} />
                  <span className="ml-2 text-gray-300 text-sm truncate">{selectedFile.name}</span>
                </div>
              )}

              {/* Upload & Cancel Buttons */}
              {selectedFile && (
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={handleFileConfirmUpload}
                    className="bg-[#4A90E2] text-white px-4 py-2 rounded-md hover:bg-[#357ABD] transition"
                  >
                    Upload
                  </button>
                  <button
                    onClick={() => setIsFileAttachmentModalOpen(false)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FileUploader;
