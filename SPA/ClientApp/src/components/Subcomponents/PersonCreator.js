import React, { useState } from "react";
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import LogoutButton from "./LogoutButton";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, TextField } from "@material-ui/core";
import { CircularProgress } from "@material-ui/core";
import Cookies from 'universal-cookie';
import { Alert } from "reactstrap";

const cookies = new Cookies();


export default function PersonCreator(props) {

    const [name, setName] = useState("");
    const [imageURL, setImageURL] = useState("");
    const [inProgress, setInProgress] = useState("");

    const [result, setResult] = useState({
        severity: "success",
        text: "idk"
    })

    const [SnackOpen, setSnackOpen] = useState(false);

    const handleCreatePerson = (event) => {


        if (name === "") {
            setResult({
                severity:"danger",
                text:"Name cannot be empty!"
            })
            setSnackOpen(true);
            return;
        }

        setInProgress(true);

        //Grab the ID and pin and create a tiny itty bitty object
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', "sessionID": cookies.get("SessionID")},
            body: JSON.stringify({
                "name": name,
                "imageURL": imageURL
            })
        };

        console.log(requestOptions);

        fetch("API/Persons", requestOptions)
            .then(response => {
                setInProgress(false);
                if(response.status!=201){ return { "error" : response.text()} }
                return response.json()
            }).then(data => {
                console.log(data)
                if (data.error !== undefined) {
                    setResult({
                        severity:"danger",
                        text:data.error
                    })
                    setSnackOpen(true);
                } else {
                    //s u c c e s s
                    setResult({
                        severity:"success",
                        text:"Person created successfully"
                    })
                    setSnackOpen(true);
                    props.setOpen(false)
                    props.setPersons(undefined)
                    setName("");
                    setImageURL("");
                }
            })


    }

    return (
        <React.Fragment>
            <Dialog maxWidth="lg" open={props.open} onClose={() => props.setOpen(false)} scroll="paper">
                <DialogTitle>Create a new person</DialogTitle>
                <DialogContent>
                    <table>
                        <tr>
                            <td>
                                <TextField label="Person Name" value={name} onChange={(event) => setName(event.target.value)} fullWidth
                                    style={{ marginTop: "5px", marginBottom: "5px" }} />                            </td>
                            <td rowSpan="2"><img src={imageURL === "" ? "/images/blankperson.png" : imageURL} alt="Profile" width="100px" style={{ marginLeft: "25px", marginRight: "10px" }} /></td>
                        </tr>
                        <tr>
                            <td>
                                <TextField label="Image URL" value={imageURL} onChange={(event) => setImageURL(event.target.value)} fullWidth
                                    style={{ marginTop: "5px", marginBottom: "5px" }} />
                            </td>
                        </tr>
                    </table>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCreatePerson} autoFocus> OK </Button>
                    <Button onClick={() => { props.setOpen(false) }} autoFocus> Cancel </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={SnackOpen} autoHideDuration={6000} onClose={()=>setSnackOpen(false)}>
                <Alert onClose={()=>setSnackOpen(false)} color={result.severity} sx={{ width: '100%' }}>
                    {result.text}
                </Alert>
            </Snackbar>

        </React.Fragment>
    );

}
