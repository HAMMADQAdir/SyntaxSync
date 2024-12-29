import logo from './logo.svg';
import './App.css';
import { Routes,Route } from 'react-router-dom';
import Lobby from './components/Lobby.js';
import Room from './components/Room.jsx';
import VideoCall from './components/videocall.jsx';


function App() {
  return (
  <>
  <div>
    <Routes>
      <Route path='/' element = {<Lobby/>}/>
      <Route path='/room/:roomId/:email' element = {<Room />}/>
    </Routes>

   
  </div>
  </>
  );
}

export default App;
