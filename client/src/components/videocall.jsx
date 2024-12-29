import React, { useState } from 'react';
import { Camera, Mic, MicOff, Monitor, Phone, VideoOff, Code, Maximize2, Minimize2, X } from 'lucide-react';

function VideoCall() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main Content */}
      <div className={`flex-1 p-4 transition-all duration-300 ${isEditorOpen ? 'w-[60%]' : 'w-full'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100vh-8rem)]">
          {/* Video Grid */}
          <div className="relative overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded-md text-sm">
              You
            </div>
            <img 
              src="https://place-hold.it/600x400"
              alt="Your video"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded-md text-sm">
              John Doe
            </div>
            <img 
              src="https://place-hold.it/600x400"
              alt="Participant video"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-sm border-t">
          <div className="max-w-3xl mx-auto flex items-center justify-center gap-4">
            <button 
              className={`p-3 rounded-full border ${
                isMuted 
                  ? 'bg-red-50 text-red-500 border-red-200 hover:bg-red-100' 
                  : 'hover:bg-gray-100 border-gray-200'
              }`}
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button 
              className={`p-3 rounded-full border ${
                isVideoOff 
                  ? 'bg-red-50 text-red-500 border-red-200 hover:bg-red-100' 
                  : 'hover:bg-gray-100 border-gray-200'
              }`}
              onClick={() => setIsVideoOff(!isVideoOff)}
            >
              {isVideoOff ? <VideoOff size={20} /> : <Camera size={20} />}
            </button>
            <button className="p-3 rounded-full border border-gray-200 hover:bg-gray-100">
              <Monitor size={20} />
            </button>
            <button className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600">
              <Phone size={20} className="rotate-[135deg]" />
            </button>
            <div className="w-px h-6 bg-gray-200"></div>
            <button 
              className="p-3 rounded-full border border-gray-200 hover:bg-gray-100"
              onClick={() => setIsEditorOpen(!isEditorOpen)}
            >
              <Code size={20} />
            </button>
            <button 
              className="p-3 rounded-full border border-gray-200 hover:bg-gray-100"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Code Editor Panel */}
      {isEditorOpen && (
        <div className="w-[40%] border-l border-gray-200 bg-gray-50/30 relative">
          <div className="p-4 border-b border-gray-200 bg-white/50 backdrop-blur-sm flex items-center justify-between">
            <h2 className="font-semibold">Code Editor</h2>
            <button 
              className="p-2 hover:bg-gray-100 rounded-full"
              onClick={() => setIsEditorOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-4">
            <div className="bg-white/50 rounded-lg min-h-[calc(100vh-10rem)] shadow-sm">
              <pre className="p-4 text-sm font-mono">
                {`function example() {
  console.log("Hello from the editor!");
}

// Start coding here...`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoCall;