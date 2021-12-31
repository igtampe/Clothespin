import React, { useState } from "react";
import { useHistory } from 'react-router-dom'
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import CircularProgress from "@material-ui/core/CircularProgress";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Cookies from 'universal-cookie';
import Constants from '../Constants'

// react.school/material-ui

const useStyles = makeStyles((theme) => ({
  menuButton: { marginRight: theme.spacing(2) },
  title: { flexGrow: 1 },
  customHeight: { minHeight: 200 },
  offset: theme.mixins.toolbar
}));

const cookies = new Cookies();

export default function ButtonAppBar() {
  const classes = useStyles();
  const [example, setExample] = useState("primary");
  const isCustomColor = example === "customColor";
  const isCustomHeight = example === "customHeight";

  const [User, setUser] = useState({

    name: "Nobody",
    id: "00000",
    notifications: [],
    type: "No Type",
    ready: false,
    inprogress:false,
    set: false
  })

  if (cookies.get('SessionID') === undefined && User.ready===false) {
      console.log("No cookie")
      setUser({ ...User, ready:true })
  } else if(User.ready===false && User.inprogress===false) {
    setUser({ ...User, inprogress:true })
    //We have a cookie and a session. Let's get it

    console.log("The cookie: " + cookies.get('SessionID'));

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: cookies.get('SessionID')
    };

    console.log(requestOptions.body);

    fetch(Constants.ApiURL + "INFO?SessionID="+cookies.get('SessionID'), requestOptions)
        .then(response => {
            if(!response.ok){
              console.log(response);
              setUser({ ...User, ready:true })
              cookies.remove('SessionID')
              return undefined
            }
            return response.json()
        }).then(data => {
            console.log(data)
            if(data===undefined){} else {
                //We have a user!!!!!
                console.log(data);
                setUser({
                  name: data.name,
                  id: data.id,
                  notifications: data.notifications,
                  type: data.type.name + " account",
                  ready: true,
                  inprogress:false,
                  set: true              
                })
            }
        })

  }

  //We don't really need to check the session. Things will fail when we try to get their account summary

  return (
    <React.Fragment>
      <AppBar color={"primary"}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}> Calico </Typography>
          {
            User.ready ? <React.Fragment>
              {
                User.set ?
                  <React.Fragment>
                    <Typography>
                    {User.name} ({User.id}) <IconButton>{User.notifications.length}</IconButton>
                    </Typography>
                  </React.Fragment>
                  : <React.Fragment>
                    <Button color="inherit" onClick={() => setExample("default")}> Log In </Button>
                    <Button color="inherit" onClick={() => setExample("primary")}> Sign Up </Button>
                  </React.Fragment>
              }
            </React.Fragment> : <CircularProgress color="secondary" />
          }
        </Toolbar>
      </AppBar>
      <Toolbar />
    </React.Fragment>
  );
}
