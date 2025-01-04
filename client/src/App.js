import './App.css';
import MenuDiv from './MenuDiv'
import Game from './Game';
import { useState, useEffect} from 'react';

function App() {
  const [username, setUsername] = useState("");
  const [spawned, setSpawned] = useState(false);
  const startSound = document.getElementById("buttonSound")

  return (
    <>
      <Game spawned={spawned} setSpawned={setSpawned} username={username || "Fighter"}></Game>
      {!spawned &&
        <div style={{textAlign: "center"}}>
          <h1 className={"strokedText5 textColor pixelFont"} style={{fontSize: "7vw", position: "absolute", left: "15vw", width: "70vw"}}>Zombie Fighter Redux</h1>
          <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", paddingTop: "7vw"}}>
            <MenuDiv title="Global Leaderboard"  globalLeaderboard={true}></MenuDiv>
            <div style={{margin: "5vw", display: "block"}} >
              <h1 className={"strokedText2 pixelFont textColor"} style={{fontSize: "2vw", margin: "auto", marginBottom: "1vw"}}>{"High Score: " + (localStorage.getItem("ZFHighScore") || "0")}</h1>
              <input type="text" placeholder='Username...' value={username} onChange={(e) => setUsername(e.target.value)} className={"textColor pixelFont " + (username? "strokedText2" : "")} style={{boxShadow: "0vw 0.5vw 0vw rgba(0, 0, 0, 0.5)", caretColor: "black", width: "20vw", height: "4.4vw", fontSize: "3vw", textIndent: "1vw", border: "0.3vw solid black"}}></input>
              <button className={"strokedText4 pixelFont textColor textButton"} style={{fontSize: "4vw", display: "block", margin: "auto", marginTop: "2vw"}} onClick={() => {
                setSpawned(true)
                startSound.play();
              }}>Play</button>
            </div>
            <MenuDiv title="Controls" globalLeaderboard={false}></MenuDiv>
          </div>
        </div>
      }
      
    </>
    
  );
}

export default App;
