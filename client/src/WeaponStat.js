function WeaponStat(props) {
    return (
        <div style={{display: "flex"}}>
            <h1 style={{marginLeft: "2vw", fontSize: "1.7vw", float: "left", marginTop: "0.4vw", marginBottom: "0"}} className={"textColor pixelFont strokedText2"}>{props.name}</h1>
            <h1 style={{marginRight: "2vw", fontSize: "1.7vw", float: "right", marginTop: "0.4vw", marginBottom: "0", marginLeft: "auto"}} id={props.id} className={"textColor pixelFont strokedText2"}>{props.stat}</h1>
        </div>
    )
}

export default WeaponStat