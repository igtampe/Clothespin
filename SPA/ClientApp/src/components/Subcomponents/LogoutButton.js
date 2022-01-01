import React from "react";
import { useHistory } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import Cookies from 'universal-cookie';
import LogoutIcon from '@material-ui/icons/ExitToApp'

const cookies = new Cookies();

export default function LogoutButton() {

    const history = useHistory();

    const handleLogout = (event) => {

        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'SessionID' : cookies.get('SessionID') },
          body : "\"" + cookies.get('SessionID') + "\""
        };
    
        fetch("API/Users/Out",requestOptions).then( response => {
          console.log(response.body)
          cookies.remove("SessionID")
          cookies.remove("PersonID")
          history.go("/Login")
        })
    
      }
    
    return (
        <React.Fragment>
            <IconButton color="inherit" onClick={handleLogout}><LogoutIcon/></IconButton>
        </React.Fragment>
    );

}
