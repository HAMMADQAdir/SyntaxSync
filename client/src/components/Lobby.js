import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../utils/SocketProvider.js";
import { Video, Users, ArrowRight } from "lucide-react";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";
const Lobby = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");
  const [errors, setErrors] = useState({});
  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );
  const generateRoomid = () => {
    const newRoomId = uuid(); // Generate a new UUID
    setRoom(newRoomId); // Update the state with the new room ID
    console.log(newRoomId); // Log the newly generated room ID
    toast.success(`Room ID generated: ${newRoomId}`);
  };
  const handleJoinRoom = useCallback(
    (data) => {
      const { email, room } = data;
      navigate(`/room/${room}/${email}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Header Section */}
        <div className="text-center mb-8">
          <div className="bg-white w-16 h-16 rounded-2xl shadow-md flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Join Meeting</h1>
          <p className="text-gray-500 mt-2">
            Enter room details to get started
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleSubmitForm} className="space-y-6">
            {/* Room ID Input */}
            <div>
              <label
                htmlFor="roomId"
                className="block text-sm font-medium text-gray-700 mb-2">
                Room ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="roomId"
                  name="roomId"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.roomId ? "border-red-500" : "border-gray-200"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Enter room ID"
                />
                {errors.roomId && (
                  <p className="mt-1 text-sm text-red-500">{errors.roomId}</p>
                )}
              </div>
            </div>

            {/* Username Input */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    errors.username ? "border-red-500" : "border-gray-200"
                  } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  placeholder="Enter your name"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-500">{errors.username}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg 
                     flex items-center justify-center gap-2 transition-colors duration-200">
              Join Room
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Quick Join Info */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 text-center">
              Want to create a new room?{" "}
              <button
                onClick={generateRoomid}
                className="text-green-500 hover:text-green-600 font-medium">
                Generate Room ID
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
