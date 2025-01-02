import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import peer from "../services/Peer.js";
import { useSocket } from "../utils/SocketProvider.js.js";
import Editor from "./EditorPage.js";
import { useParams } from "react-router-dom";
import { Toast, toast, Toaster } from "react-hot-toast";
import Dialog from "./DialogBox.jsx";
import ExecuteCode from "./ExecuteCode.js";
import {
  Camera,
  Mic,
  MicOff,
  Monitor,
  Phone,
  VideoOff,
  Code,
  Maximize2,
  Minimize2,
  X,
  Play,
} from "lucide-react";

const RoomPage = () => {
  const socket = useSocket();
  const [incomingCall, setIncomingCall] = useState(false);
  const { roomId, email } = useParams();
  const [remoteVideoOff, setRemoteVideoOff] = useState(false);
  const [remoteEmail, setRemoteEmail] = useState(null);
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState(null);
  const [codeRef, setCodeRef] = useState(null);
  const [isCompiling, setIsCompiling] = useState(false);
  // only for ui realted components
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`, id);
    socket.emit("sync:code", { id, codeRef });
    setRemoteSocketId(id);
    setRemoteEmail(email);
    setShowDialog(true);
    socket.emit("wait:for:call", { to: id, email });
    return () => {
      socket.off("wait:for:call");
    };
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer, email });
    setMyStream(stream);
    setShowDialog(false);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer, fromEmail }) => {
      setRemoteSocketId(from);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setIncomingCall(true);
      console.log(true);
      setMyStream(stream);
      setRemoteEmail(fromEmail);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);
    const handleUserLeft = ({ email }) => {
      toast(`${email} has left the room.`, {
        icon: "👋",
      });
      console.log(`${email} has left the room.`);
      // You can also reset state or perform other actions if necessary
      if (remoteSocketId) {
        setRemoteSocketId(null);
        setRemoteEmail(null);
        setRemoteStream(null);
      }
    };

    socket.on("user:left", handleUserLeft);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
      socket.off("user:left", handleUserLeft);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
    remoteSocketId,
  ]);
  // Automatically trigger sendStreams when incomingCall is true
  useEffect(() => {
    setTimeout(() => {
      if (incomingCall) {
        sendStreams();
        setIncomingCall(false); // Reset incoming call to avoid repeated execution
      }
    }, 2000);
  }, [incomingCall, sendStreams]);
  const toggleVideo = () => {
    if (myStream) {
      const videoTrack = myStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = isVideoOff; // Toggle video track locally
      }
      // Notify the remote peer of the video state change
      socket.emit("user:video:toggle", {
        to: remoteSocketId,
        isVideoOff: !isVideoOff,
        email: email,
      });
    }
    setIsVideoOff(!isVideoOff);
  };

  // Listen for video state changes
  useEffect(() => {
    socket.on("remote:video:toggle", ({ isVideoOff, email }) => {
      if (remoteEmail === email) {
        // Update remote stream state or UI for the remote user
        setRemoteVideoOff(isVideoOff);
        setRemoteStream((prevStream) => {
          const videoTrack = prevStream.getVideoTracks()[0];
          if (videoTrack) {
            videoTrack.enabled = !isVideoOff; // Toggle remote video track
          }
          return prevStream; // Keep the current stream if video is enabled
        });
      }
    });
    socket.on("wait:for:call", ({ from, email }) => {
      toast("wait untill someone let u in");
    });
    return () => {
      socket.off("remote:video:toggle");
      socket.off("wait:for:call");
    };
  }, [socket, remoteEmail]);
  const handleLeaveRoom = () => {
    socket.emit("leave:room", { roomId, email });
    if (myStream) {
      myStream.getTracks().forEach((track) => track.stop());
      setMyStream(null);
    }
   
    // Reset the state
    setRemoteSocketId(null);
    setRemoteEmail(null);
    setRemoteStream(null);
    window.close()
  };

 const showScreen = async () => {
  console.log("inside")
  try {
    // Request access to display media (screen sharing)
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false, // Change to true if you want to share audio
    });

    // Get the screen track
    const screenTrack = screenStream.getVideoTracks()[0];

    if (screenTrack) {
      // Replace the current video track in the myStream
      const sender = peer.peer
        .getSenders()
        .find((s) => s.track.kind === "video");

      if (sender) {
        sender.replaceTrack(screenTrack); // Update the sender's track
        
      }

      // Stop the screen sharing when the track ends
      screenTrack.onended = () => {
        const videoTrack = myStream.getVideoTracks()[0];
        if (videoTrack && sender) {
          sender.replaceTrack(videoTrack); // Revert to the original video track
        }
      };
    }
  } catch (error) {
    console.error("Error while sharing screen:", error);
  }
};

  return (
    <div>
      <Toaster />
      <div className="min-h-screen bg-black/15 flex">
        {/* Main Content */}
        <div
          className={`flex-1 p-4 transition-all duration-300 ${
            isEditorOpen ? "w-[60%]" : "w-full"
          }`}>
          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100vh-8rem)] `}>
            {/* Video Grid */}
            <div className="relative overflow-hidden rounded-lg  bg-black/15 shadow-lg">
              <div
                className={`absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded-md text-sm`}>
                {email}
              </div>
              {myStream && (
                <>
                  {!isVideoOff ? (
                    <ReactPlayer
                      playing
                      muted={isMuted}
                      height="100%"
                      width="100%"
                      url={myStream}
                      className ="rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full justify-center flex items-center">
                      <p className="text-[100px]">{email[0].toUpperCase()}</p>
                    </div>
                  )}
                </>
              )}
            </div>
            {remoteSocketId && (
              <div className="relative overflow-hidden rounded-lg  bg-black/15 shadow-lg">
                <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded-md text-sm">
                  {remoteEmail}
                </div>

                {remoteStream && (
                  <>
                    {!remoteVideoOff ? (
                      <ReactPlayer
                        playing
                        muted={isMuted}
                        height="100%"
                        width="100%"
                        
                        url={remoteStream}
                      />
                    ) : (
                      <div className="w-full h-full justify-center flex items-center">
                        <p className="text-[100px]">
                          {remoteEmail[0].toUpperCase()}
                        </p>
                      </div>
                    )}
                  </>
                )}
                {/* {!remoteStream && remoteEmail && (
                  <div className="w-full h-full justify-center flex items-center">
                    <p className="text-[100px]">{remoteEmail[0].toUpperCase()}</p>
                  </div>
                )} */}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="fixed bottom-0 left-0 right-0 p-6 bg-black/15 backdrop-blur-sm border-t">
            <div className="max-w-3xl mx-auto flex items-center justify-center gap-4">
              <button
                className={`p-3 rounded-full border ${
                  isMuted
                    ? "bg-red-50 text-red-500 border-red-200 hover:bg-red-100"
                    : "hover:bg-gray-100 border-gray-200"
                }`}
                onClick={() => setIsMuted(!isMuted)}>
                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              <button
                className={`p-3 rounded-full border ${
                  isVideoOff
                    ? "bg-red-50 text-red-500 border-red-200 hover:bg-red-100"
                    : "hover:bg-gray-100 border-gray-200"
                }`}
                onClick={toggleVideo}>
                {isVideoOff ? <VideoOff size={20} /> : <Camera size={20} />}
              </button>
              <button className="p-3 rounded-full border border-gray-200 hover:bg-gray-100">
                <Monitor size={20} onClick={showScreen} />
              </button>
              <button className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600">
                {remoteSocketId && (
                  <Phone
                    size={20}
                    onClick={handleLeaveRoom}
                    className="rotate-[135deg]"
                  />
                )}
              </button>
              <div className="w-px h-6 bg-gray-200"></div>
              <button
                className="p-3 rounded-full border border-gray-200 hover:bg-gray-100"
                onClick={() => setIsEditorOpen(!isEditorOpen)}>
                <Code size={20} />
              </button>
              <button
                className="p-3 rounded-full border border-gray-200 hover:bg-gray-100"
                onClick={() => setIsFullscreen(!isFullscreen)}>
                {isFullscreen ? (
                  <Minimize2 size={20} />
                ) : (
                  <Maximize2 size={20} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Code Editor Panel */}
        {isEditorOpen && (
          <div className="w-[40%] border-l border-gray-200 bg-black/15 relative h-full">
            <div className="p-4 border-b border-gray-200 bg-white/50 backdrop-blur-sm flex items-center justify-between">
              <h2 className="font-semibold">Code Editor</h2>
              <button
                className="p-2 hover:bg-gray-100 rounded-full"
                onClick={() => setIsEditorOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <div className="bg-white/50 rounded-lg min-h-[calc(90-10rem)] shadow-sm">
                <Editor
                  roomId={roomId}
                  socket={socket}
                  onCodeChange={(code) => {
                    setCodeRef(code);
                  }}
                />
              </div>
             
            </div>
          </div>
        )}
      </div>

      {showDialog && remoteEmail && (
        <Dialog
          user={remoteEmail}
          onAdmit={handleCallUser}
          onClose={() => setShowDialog(false)}
          
    
        />
      )}
    </div>
  );
};

export default RoomPage;
