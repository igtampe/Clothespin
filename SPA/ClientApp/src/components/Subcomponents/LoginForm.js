import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import Grid from "@material-ui/core/Grid"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography";
import { CircularProgress, Container } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Cookies from 'universal-cookie';

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

    const [Pin, SetPin] = useState("");
    const [ID, SetID] = useState("");
    const [LoginInProgress, SetLoginInProgress] = useState(false);
    const [ResultOpen, setResultOpen] = useState(false);
    const [ResultText, setResultText] = useState("IDK what happened I wasn't set");

    const handleIDChange = (event) => { SetID(event.target.value); };
    const handlePinChange = (event) => { SetPin(event.target.value); };
    const handleCloseResultDialog = () => { setResultOpen(false); }

    const OnLoginButtonClick = (event) => { 
        SetLoginInProgress(true); 

        //Grab the ID and pin and create a tiny itty bitty object
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "id":ID, "pin":Pin })
        };

        console.log(requestOptions.body);

        fetch("Auth/", requestOptions)
            .then(response => {
                SetLoginInProgress(false);
                if(!response.ok){
                    setResultText(response.statusText);
                    setResultOpen(true);
                }
                return response.json()
            }).then(data => {
                console.log(data)
                if(data===undefined){
                } else if(ResultOpen){
                    setResultText(data);
                } else if(data==="00000000-0000-0000-0000-000000000000"){
                    setResultText("Username or password is incorrect");
                    setResultOpen(true);
                } else {
                    //We logged in, save a cookie, then let's get the heck out of here
                    cookies.set('SessionID', data, { path: '/' })
                    
                }
            })
    }

    return (
        <React.Fragment>
            <Container style={{ backgroundColor: '#ebebeb', padding: '50px' }}>
                <Typography>
                    <Typography variant="h6" className={classes.title}> Log In to Calico</Typography>
                    <Grid container spacing={3} style={{ paddingTop: "20px", paddingBottom: "20px" }}>
                        <Grid item xs={4}>
                            <TextField label="Neco ID" value={ID} onChange={handleIDChange} />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField label="Pin" value={Pin} type="password" onChange={handlePinChange} />
                        </Grid>
                    </Grid>
                    <div style={{ textAlign: 'right' }}>
                        <Button variant='contained' color='primary' disabled={LoginInProgress} onClick={OnLoginButtonClick}>
                            {LoginInProgress ? <CircularProgress size={20} /> : "Log In"
                            }
                        </Button>
                    </div>
                </Typography>
            </Container>

            <Dialog open={ResultOpen} onClose={handleCloseResultDialog} >
                <DialogTitle> Could not log in </DialogTitle>
                <DialogContent>
                    <DialogContentText>{ResultText}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseResultDialog} autoFocus> OK </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );

}
