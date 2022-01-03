import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, IconButton, AppBar, CircularProgress, Toolbar, Typography, Button,
  Drawer, List, Divider, ListItem, ListItemIcon, ListItemText, Box
} from "@material-ui/core";
import Cookies from 'universal-cookie';
import { useHistory } from "react-router-dom";
import LogoutButton from "./Subcomponents/LogoutButton"
import PersonPicker from "./PersonComponents/PersonPicker";
import MenuIcon from "@material-ui/icons/Menu";
import PasswordChangeButton from "./Subcomponents/PasswordChangeButton";
import PersonCreator from "./PersonComponents/PersonCreator";

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
    id:"",
    Name: "",
    imageURL: "",
    status: 0
  })

  const [sessionExpired, setSessionExpired] = useState(false);
  const [personPicker, setPersonPicker] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [Editor, setEditor] = useState(false);

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

          if (cookies.get("PersonID") === undefined) { 
            setPerson({ ...Person, status: 1 }); 
            setPersonPicker(true)
            return; 
          }

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
                setPerson({ ...Person, status: 1 });
                setPersonPicker(true)
                return;
              } else {
                setPerson({
                  id:cookies.get("PersonID"),
                  Name: data.name,
                  imageURL: data.imageURL === "" ? "/images/blankPerson.png" : data.imageURL,
                  status: 2
                });
              }
            })
        }
      })

  }

  const sendToLogin = (event) =>{ 
    history.push("/Login") 
    setMenuOpen(false);
  }

  return (
    <React.Fragment>
      <AppBar color={"primary"}>
        <Toolbar>
          <IconButton onClick={() => { setMenuOpen(true) }} style={{ marginRight: "15px" }}><MenuIcon /></IconButton>
          <a href="/">
            <img src="iconshaded.png" alt="Clothespin logo" width="50" height="50" /></a>
          <Typography variant="h6" className={classes.title} style={{ marginLeft: "10px", fontFamily: 'DM Serif Display' }}>Clothespin </Typography>
          {
            User.ready ? <React.Fragment>
              {
                User.set ?
                  <React.Fragment>
                    <Button onClick={() => { setPersonPicker(true) }} style={{ textTransform: "none" }}>
                      {Person.status === 0 ? <CircularProgress size="20px" color="secondary" style={{ marginRight: "20px" }} /> : <>{
                        Person.status === 1 ? "No person selected (" + User.Username + ")"
                          : <>
                            <img src={Person.imageURL} alt="Selected Person" width="30px" style={{ margin: "5px", marginLeft: "10px" }} /> {Person.Name + " "}
                          </>
                      }</>}
                    </Button>
                    <LogoutButton />
                  </React.Fragment>
                  : <React.Fragment>
                    <Button color="inherit" onClick={sendToLogin}> Log In </Button>
                  </React.Fragment>
              }
            </React.Fragment> : <CircularProgress color="secondary" />
          }
        </Toolbar>
      </AppBar>
      <Toolbar style={{ marginBottom: "20px" }} />

      <PersonPicker open={personPicker} setOpen={setPersonPicker} Username={User.Username} />

      <Dialog open={sessionExpired} >
        <DialogTitle> Session Expired </DialogTitle>
        <DialogContent>
          <DialogContentText>Your session was not found on the server, and has most likely expired. Please log in again.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <LogoutButton />
        </DialogActions>
      </Dialog>

      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
        >
          <List>
            <ListItem key="Logo">
              <img src="iconshaded.png" alt="Clothespin logo" width="50" height="50" />
              <Typography variant="h6" className={classes.title} style={{ marginLeft: "10px", fontFamily: 'DM Serif Display' }}>Clothespin </Typography>
            </ListItem>
          </List>
          <Divider/>
          { User.ready && ! User.set ? 
            <List>
              <ListItem button key="Login" onClick={sendToLogin}>
                <ListItemIcon> <img src="/images/clear/blankperson.png" alt="Manage Person" width="30px" style={{ margin: "5px", marginLeft: "10px" }} /> </ListItemIcon>
                <ListItemText>Login</ListItemText>
              </ListItem>
            </List>
          : <>
          <List>
            <ListItem button key="Person" onClick={() => setPersonPicker(true)}>
              {Person.status === 0 ? <CircularProgress size="20px" color="secondary" style={{ marginRight: "20px" }} /> : <>{
                Person.status === 1 ?
                  <><ListItemIcon> <img src={"/images/clear/blankperson.png"} alt="Selected Person" width="30px" style={{ margin: "5px", marginLeft: "10px" }} /> </ListItemIcon>
                    <ListItemText> Pick a person </ListItemText></>
                  : <><ListItemIcon><img src={Person.imageURL} alt="Selected Person" width="30px" style={{ margin: "5px", marginLeft: "10px" }} /></ListItemIcon>
                    <ListItemText>{Person.Name}</ListItemText></>
              }</>}
            </ListItem>
            {Person.status === 2 ?
              <ListItem button key="ManagePerson" onClick={() => setEditor(true)}>
                <ListItemIcon><img src="/images/clear/blankpersonmanage.png" alt="Manage Person" width="30px" style={{ margin: "5px", marginLeft: "10px" }} /></ListItemIcon>
                <ListItemText>Edit {Person.Name}</ListItemText>
              </ListItem>
              : ""}
              </List>
              <Divider />
              <List>
            <ListItem button key="Closet" onClick={() => {history.push("/Closet"); setMenuOpen(false)}}>
              <ListItemIcon><img src="/images/clear/Shirt.png" alt="Manage Person" width="30px" style={{ margin: "5px", marginLeft: "10px" }} /></ListItemIcon>
              <ListItemText>Closet</ListItemText>
            </ListItem>
            <ListItem button key="Logbook" onClick={() => {history.push("/Logbook"); setMenuOpen(false)}}>
              <ListItemIcon><img src="/images/clear/Logbook.png" alt="Logbook" width="30px" style={{ margin: "5px", marginLeft: "10px" }} /></ListItemIcon>
              <ListItemText>Logbook</ListItemText>
            </ListItem>
            <ListItem button key="Statistics" onClick={() => {history.push("/Statistics"); setMenuOpen(false)}}>
              <ListItemIcon><img src="/images/clear/Statistics.png" alt="Insights" width="30px" style={{ margin: "5px", marginLeft: "10px" }} /></ListItemIcon>
              <ListItemText>Insights</ListItemText>
            </ListItem>
            </List>
            <Divider />
            <List>
            <ListItem key="AccountManagement">
              <PasswordChangeButton />
              <LogoutButton />
            </ListItem>
          </List></>}
          
          {!process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? 
            <>
              <Divider/>
              <List><a href="/Swagger">
                <ListItem>
                  <ListItemText style={{textAlign:"center"}}>Swagger</ListItemText>
                </ListItem></a>
              </List>
            </>
          : ""}    

        </Box>
      </Drawer>

      <PersonCreator open={Editor} setOpen={setEditor} person={Person} setPerson={setPerson} />

    </React.Fragment>
  );
}
