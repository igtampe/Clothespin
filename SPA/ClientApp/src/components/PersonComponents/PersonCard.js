import React from "react";
import Button from "@material-ui/core/Button";
import Cookies from 'universal-cookie';
import { useHistory } from "react-router-dom";

const cookies = new Cookies();

export default function PersonCard(props) {

    const history = useHistory();

    const defaultOnClick = (event) => {
        cookies.set('PersonID', props.person.id, { path: '/', maxAge: 60 * 60 * 24 }) //The cookie will expire in a day
        history.go("/Home")
    }

    return (
        <React.Fragment>
            <Button onClick={props.onClick === undefined ? defaultOnClick : props.onClick} variant="outlined" style={{minWidth:"225px",maxWidth:"225px", textTransform:"none"}}>
            <table style={{minWidth:"215px",maxWidth:"215px"}}>
                <tr>
                    <td style={{minWidth:"80x"}}><img style={{margin:"5px"}} src={props.person === undefined ? "/images/Add.png" : 
                        props.person.imageURL === "" || props.person.imageURL === undefined ? "/images/Blankperson.png" : props.person.imageURL
                    
                } alt="Profile" width="75px"/></td>
                    <td style={{minWidth:"120px"}}><div style={{margin:"5px", textAlign:"left"}}>{props.person === undefined ? "New Person" : props.person.name}</div></td>
                </tr>
            </table>
            </Button>
        </React.Fragment>
    );

}
