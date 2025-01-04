import WeaponStat from "./WeaponStat"

function ShopColumn (props) {
    return (
        <div className={"shopColumn"} style={{display: "block", textAlign: "center"}}>
            <h1 style={{margin: "1vw", fontSize: "3vw", marginBottom: "0"}} className={"textColor pixelFont strokedText3"}>{props.name}</h1>
            <img src={props.icon} style={{width: "15vw", margin: "auto", marginTop: "0"}}/>
            <h1 id={props.name + "Level"} style={{margin: "1vw", fontSize: "3vw", marginBottom: "0"}} className={"textColor pixelFont strokedText3"}>Level: 1</h1>
            <WeaponStat id={props.name + "BulletSpeed"} stat={props.bulletSpeed} name="Bullet Speed:"/>
            <WeaponStat id={props.name + "Damage"} stat={props.damage} name="Damage:"/>
            <WeaponStat id={props.name + "Accuracy"} stat={props.accuracy} name="Accuracy:"/>
            <WeaponStat id={props.name + "FireRate"} stat={props.fireRate} name="Rate of Fire:"/>
            <WeaponStat id={props.name + "MaxAmmo"} stat={props.maxAmmo} name="Max Ammo:"/>
            <WeaponStat id={props.name + "ReleadSpeed"} stat={props.reloadSpeed} name="Reload Speed:"/>
            <WeaponStat id={props.name + "Cost"} stat={props.cost} name="Cost:"/>
            <button onClick={(e) => props.ec(e.target, props.name)} id={props.name + "EquipButton"} style={{margin: "1vw", fontSize: "2.2vw", marginBottom: "0", display: "none"}} className={"textButton textColor pixelFont strokedText3"}>Equip</button>
            <button onClick={(e) => props.bc(e.target, props.name)} id={props.name + "BuyButton"} style={{margin: "1vw", fontSize: "2.2vw", marginBottom: "0"}} className={"textButton textColor pixelFont strokedText3"}>Buy</button>
        </div>
    )
}
export default ShopColumn