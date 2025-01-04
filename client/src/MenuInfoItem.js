function MenuInfoItem(props) {
    return (
        <div style={{display: "inline-block", width: "100%", fontSize: "2.8vw", margin: "0", marginTop: "0.75vw",marginBottom: "0.75vw"}}>
            <p className={"textColor strokedText3 pixelFont"} style={{float: "left", margin: "0", marginLeft: "4vw"}}>{props.first}</p>
            <p className={"textColor strokedText3 pixelFont"} style={{float: "right", margin: "0", marginRight: "4vw"}}>{props.second}</p>
        </div>

    )
}

export default MenuInfoItem;