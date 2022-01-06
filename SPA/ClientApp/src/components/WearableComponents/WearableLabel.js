import React from "react";

export default function WearableLabel(props) {

    if(!props.wearable){return (<></>)}

    return (
        <React.Fragment>
            <table>
                <tr>
                    <td><img src={props.wearable.imageURL === "" ? 'images/' + props.type + '.png' : props.wearable.imageURL} alt="item" height='25px' 
                    style={{ marginLeft: '5px', marginRight: '5px' }} /></td>
                    <td>{props.wearable.name}</td>
                </tr>
            </table>
        </React.Fragment>
    );

}
