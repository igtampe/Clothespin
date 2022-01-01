import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import CircularProgress from "@material-ui/core/CircularProgress";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Cookies from 'universal-cookie';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import LogoutButton from "./Subcomponents/LogoutButton"
import PersonPicker from "./Subcomponents/PersonPicker";

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
  const history = useHistory();

  const [User, setUser] = useState({
    Username: "00000",
    ready: false,
    inprogress: false,
    set: false
  })

  const [Person, setPerson] = useState({
    Name: "",
    imageURL: "",
    status: 0
  })

  const [sessionExpired, setSessionExpired] = useState(false);
  const [personPicker, setPersonPicker] = useState(false);

  if (cookies.get('SessionID') === undefined && User.ready === false) {
    console.log("No cookie")
    setUser({ ...User, ready: true })
  } else if (User.ready === false && User.inprogress === false) {
    setUser({ ...User, inprogress: true })
    //We have a cookie and a session. Let's get it

    console.log("The cookie: " + cookies.get('SessionID'));

    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'SessionID': cookies.get('SessionID') },
    };

    console.log(requestOptions.headers);

    fetch("API/Users", requestOptions)
      .then(response => {
        if (!response.ok) {
          console.log(response);
          setUser({ ...User, ready: true })
          return undefined
        }
        return response.json()
      }).then(data => {
        console.log(data)
        if (data === undefined) {
          setSessionExpired(true)
        } else {
          //We have a user!!!!!
          console.log(data);
          setUser({
            Username: data.userID,
            ready: true,
            inprogress: false,
            set: true
          })

          if (cookies.get("PersonID") === undefined) { setPerson({ ...Person, status:1 }); return; }

          const PersonRequestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'SessionID': cookies.get('SessionID') },
          };

          fetch("API/Persons/" + cookies.get("PersonID"), PersonRequestOptions)
            .then(response => {
              if (!response.ok) {
                console.log(response);
                setUser({ ...User, ready: true })
                return undefined
              }
              return response.json()
            }).then(data => {
              console.log(data)
              if (data === undefined) {
                setPerson({ ...Person, status:1 });
                return;
              } else {
                setPerson({
                  Name: data.name,
                  imageURL: data.imageURL === "" ? "/images/blankPerson.png" : data.imageURL,
                  status: 2
                });
              }})
        }
      })

  }

  //We don't really need to check the session. Things will fail when we try to get their account summary

  return (
    <React.Fragment>
      <AppBar color={"primary"}>
        <Toolbar>
          <a href="/">
            <img src="iconshaded.png" alt="Clothespin logo" width="50" height="50" /></a>
          <Typography variant="h6" className={classes.title} style={{ marginLeft: "10px", fontFamily: 'DM Serif Display' }}>Clothespin </Typography>
          {
            User.ready ? <React.Fragment>
              {
                User.set ?
                  <React.Fragment>
                    <Button onClick={() => { setPersonPicker(true) }} style={{ textTransform:"none"}}>
                      {Person.status === 0 ? <CircularProgress size="20px" color="secondary" style={{ marginRight: "20px" }} /> : <>{
                        Person.status === 1 ? "No person selected (" + User.Username + ")"
                          : <>
                            <img src={Person.imageURL} alt="Selected Person" width="30px" style={{ margin: "5px", marginLeft:"10px"}} /> {Person.Name + " "}
                          </>
                      }</>}
                    </Button>
                    <LogoutButton />
                  </React.Fragment>
                  : <React.Fragment>
                    <Button color="inherit" onClick={() => history.go("/Login")}> Log In </Button>
                  </React.Fragment>
              }
            </React.Fragment> : <CircularProgress color="secondary" />
          }
        </Toolbar>
      </AppBar>
      <Toolbar />

      <PersonPicker open={personPicker} setOpen={setPersonPicker} Username = {User.Username}/>

      <Dialog open={sessionExpired} >
        <DialogTitle> Session Expired </DialogTitle>
        <DialogContent>
          <DialogContentText>Your session was not found on the server, and has most likely expired. Please log in again.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <LogoutButton />
        </DialogActions>
      </Dialog>


    </React.Fragment>
  );
}
