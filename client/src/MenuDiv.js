import MenuInfoItem from "./MenuInfoItem";
import { useEffect, useState } from "react";

function MenuDiv(props) {
    const [leaderboard, setLeaderboard] = useState([])

    useEffect(() => {
        try {
            fetch("https://zfr-backend.vercel.app/api/getTop").then((data) => data.json()).then((data) => {
            setLeaderboard(data);
            });
        } catch (error) {
            console.log(error);
        }
    }, [])

    return (
        <div style={{position: "relative", backgroundColor: "rgba(0,0,0,0.5)", width: "26vw", height: "30vw", margin: "2vw", border: "0.4vw solid black"}}>
            <h1 className={"strokedText3 textColor pixelFont"} style={{fontSize: "3.9vw", marginTop: "1vw", marginBottom: "0.25vw"}}>{props.title}</h1>
            {!props.globalLeaderboard?
            <>
                <MenuInfoItem first="Move" second="WASD"></MenuInfoItem>
                <MenuInfoItem first="Aim/Fire" second="Mouse"></MenuInfoItem>
                <MenuInfoItem first="Reload" second="R"></MenuInfoItem>
                <MenuInfoItem first="Shop" second="B"></MenuInfoItem>
            </>
            :
            <>
                <MenuInfoItem first="Player" second="Waves"></MenuInfoItem>
            </>
            }
            {props.globalLeaderboard && 
                leaderboard.map((item, index) => {
                    return <div key={index} style={{display: "inline-block", width: "100%", color: "white", fontSize: "2.2vw", margin: "0", marginTop: "0.1vw",marginBottom: "0.1vw"}}> 
                        <p className={"textColor strokedText2 pixelFont"} style={{float: "left", margin: "0", marginLeft: "4vw"}}>{item.username}</p>
                        <p className={"textColor strokedText2 pixelFont"} style={{float: "right", margin: "0", marginRight: "4vw"}}>{item.waves}</p>
                    </div>
                })
            }
        </div>
    )
}

export default MenuDiv;