## Key Points

[Syntax Sync](#syntax-sync) is an advanced collaborative platform designed for real-time synchronization and editing of code across multiple users. Built with WebRTC and WebSockets, it combines the power of real-time communication with efficient code collaboration tools. The platform aims to enhance team productivity by providing an interactive environment where participants can code, debug, and execute programs simultaneously while staying in sync.

[Video Demo](#video-demo)

[Key Features](#key-features)

[Technology Stack](#technology-stack)

[How To Run](#how-to-run)

[Use Cases](#use-cases)


Syntax Sync is an advanced collaborative platform designed for real-time synchronization and editing of code across multiple users. Built with WebRTC and WebSockets, it combines the power of real-time communication with efficient code collaboration tools. The platform aims to enhance team productivity by providing an interactive environment where participants can code, debug, and execute programs simultaneously while staying in sync.


Video Demo:

https://github.com/user-attachments/assets/29906b30-b418-4f47-9cf6-ece3a43ded2c


Key Features:

Real-Time Code Collaboration: Seamlessly write, edit, and share code in real-time with full synchronization across users.
Integrated Code Execution: Run your code directly within the platform with real-time feedback for instant debugging.
Video Conferencing with Screen Sharing: Built-in WebRTC-based video calling and screen sharing to enhance team communication.
Syntax Highlighting and Language Support: Optimized editor with support for multiple programming languages and syntax highlighting.
User-Friendly Interface: Intuitive design with tools for effortless navigation and collaboration.


Technology Stack:

#Frontend: React.js, Ace/Monaco Editor for code editing.
#Backend: Node.js with Express.js, integrated WebSocket server for real-time communication.
#WebRTC: Peer-to-peer connection for video calling and screen sharing.
#CodeEditor: Code Mirror
#Compiler: From Pistorn Api check out-> https://piston.readthedocs.io/en/latest/api-v2/
{base Url: "https://emkc.org/api/v2/piston",endpoint:"/execute"} to execute code

How To Run:

Note: You must have nodejs installed in your device

first clone the repo : paste the url in your terminal-> git clone https://github.com/HAMMADQAdir/SyntaxSync.git
then 

cd backend 

npm i (this will download all the neccessary packages

npm start (to run the backend code)

similary:

cd client

npm i

npm run dev (to runthe client side code)



Use Cases:

Pair Programming
Online Coding Interviews
Remote Team Development
Real-Time Debugging and Code Reviews
Whether you’re a developer, team lead, or educator, Syntax Sync is your go-to solution for collaborative coding.

