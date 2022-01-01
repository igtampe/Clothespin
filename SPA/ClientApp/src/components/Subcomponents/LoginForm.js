import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography";
import { CircularProgress, Container } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Cookies from 'universal-cookie';
import { useHistory } from "react-router-dom";

// react.school/material-ui

const useStyles = makeStyles((theme) => ({
    menuButton: {
        marginRight: theme.spacing(2)
    },
    title: {
        flexGrow: 1
    },
    customHeight: {
        minHeight: 200
    },
    offset: theme.mixins.toolbar
}));

const cookies = new Cookies();

export default function LoginForm() {
    const classes = useStyles();
    const history = useHistory();

    const [Pin, SetPin] = useState("");
    const [ID, SetID] = useState("");
    const [LoginInProgress, SetLoginInProgress] = useState(false);
    const [ResultOpen, setResultOpen] = useState(false);
    const [Result, setResult] = useState({
        Action: "do something",
        Text: "Desconozco"
    });

    const handleIDChange = (event) => { SetID(event.target.value); };
    const handlePinChange = (event) => { SetPin(event.target.value); };
    const handleCloseResultDialog = () => { setResultOpen(false); }

    const OnLoginButtonClick = (event) => {
        SetLoginInProgress(true);

        //Grab the ID and pin and create a tiny itty bitty object
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "username": ID, "password": Pin })
        };

        console.log(requestOptions.body);

        fetch("API/Users", requestOptions)
            .then(response => {
                SetLoginInProgress(false);
                if (!response.ok) {
                    setResult({ Action: "Login", Text: response.statusText });
                    setResultOpen(true);
                }
                return response.json()
            }).then(data => {
                console.log(data)
                if (data === undefined) {
                } else if (ResultOpen) {
                    setResult({ Action: "Login", Text: data });
                } else if (data === "00000000-0000-0000-0000-000000000000") {
                    setResult({ Action: "Login", Text: "Username or password is incorrect" });
                    setResultOpen(true);
                } else {
                    //We logged in, save a cookie, then let's get the heck out of here
                    cookies.set('SessionID', data, { path: '/', maxAge: 60 * 60 * 24 }) //The cookie will expire in a day
                    history.go("/Home")
                }
            })
    }

    const OnRegisterButtonClick = (event) => {

        //Check that the ID and Pin are *not* empty
        if (ID === undefined || ID === "") {
            setResult({ Action: "Register", Text: "Username cannot be empty!" });
            setResultOpen(true);
            return;
        }

        if (Pin === undefined || Pin === "") {
            setResult({ Action: "Register", Text: "Pin cannot be empty!" });
            setResultOpen(true);
            return;
        }

        SetLoginInProgress(true);

        //Now actually try this
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "username": ID, "password": Pin })
        };

        console.log(requestOptions.body);

        fetch("API/Users/register", requestOptions)
            .then(response => {
                SetLoginInProgress(false);
                if (!response.ok) {
                    setResult({ Action: "Register", Text: response.statusText });
                    setResultOpen(true);
                }
                return response.text();
            }).then(data => {
                console.log(data)
                if (data === undefined) {
                } else if (data === "") {
                    //We have successfully registered. Now try to login
                    OnLoginButtonClick();
                    return;
                } else { setResult({ Action: "Register", Text: data }); }
            })
    }

    return (
        <React.Fragment>
            <Container style={{ backgroundColor: '#ebebeb', padding: '50px' }}>
                <Typography>

                    <Typography variant="h6" className={classes.title}
                        style={{ fontFamily: "DM Serif Display", textAlign: "center" }}>
                        <img src="icon.png" alt="Logo" width="200" /><br />Welcome to Clothespin
                    </Typography>
                    <TextField label="Username" value={ID} onChange={handleIDChange} fullWidth
                        style={{ marginTop: "5px", marginBottom: "5px" }} /><br />
                    <TextField label="Password" value={Pin} type="password" onChange={handlePinChange} fullWidth
                        style={{ marginTop: "5px", marginBottom: "5px" }} /><br />

                    <br />

                    <div style={{ textAlign: 'center' }}>
                        <Button variant='contained' color='primary' disabled={LoginInProgress} onClick={OnLoginButtonClick}
                            style={{ margin: "10px" }}>
                            {LoginInProgress ? <CircularProgress size={20} /> : "Log In"}
                        </Button> or
                        <Button variant='contained' color='secondary' disabled={LoginInProgress} onClick={OnRegisterButtonClick}
                            style={{ margin: "10px" }}>
                            {LoginInProgress ? <CircularProgress size={20} /> : "Register"}
                        </Button>
                    </div>
                </Typography>
            </Container>

            <Dialog open={ResultOpen} onClose={handleCloseResultDialog} >
                <DialogTitle> Could not {Result.Action} </DialogTitle>
                <DialogContent>
                    <DialogContentText>{Result.Text}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseResultDialog} autoFocus> OK </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );

}
