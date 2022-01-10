import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { Snackbar } from "@material-ui/core";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import { CircularProgress } from "@material-ui/core";
import Cookies from 'universal-cookie';
import { Alert } from "reactstrap";

const cookies = new Cookies();

export default function PasswordChangeButton(props) {

    const [OldPassword, setOldPass] = useState("");
    const [NewPassword, setNewPass] = useState("");
    const [PassMatch, setPassMatch] = useState(true)

    const [PassOpen, setPassOpen] = useState(false);
    const [InProgress, setInProgress] = useState(false);
    const [result, setResult] = useState({
        severity: "success",
        text: "idk"
    })

    const [SnackOpen, setSnackOpen] = useState(false);

    const handleChangePass = (event) => {
        if (OldPassword === "" || NewPassword === "") {
            setResult({
                severity:"danger",
                text:"Old and new passwords must not be empty"
            })
            setSnackOpen(true);
            return;
        }

        if (!PassMatch) {
            setResult({
                severity:"danger",
                text:"Passwords do not match"
            })
            setSnackOpen(true);
            return;
        }

        setInProgress(true);

        //Grab the ID and pin and create a tiny itty bitty object
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "sessionID": cookies.get("SessionID"),
                "current": OldPassword,
                "new": NewPassword
            })
        };

        fetch("API/Users", requestOptions)
            .then(response => {
                setInProgress(false);
                return response.text()
            }).then(data => {
                if (data !== "") {
                    setResult({
                        severity:"danger",
                        text:data
                    })
                    setSnackOpen(true);
                } else {
                    //s u c c e s s
                    setResult({
                        severity:"success",
                        text:"Password changed successfully"
                    })
                    setSnackOpen(true);
                    setPassOpen(false);
                    setOldPass("");
                    setNewPass("");

                }
            })

    }

    return (
        <React.Fragment>

            <Button onClick={() => { setPassOpen(true) }}> Change Password </Button>

            <Dialog maxWidth="xs" open={PassOpen} onClose={() => setPassOpen(false)}>
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent>
                    <TextField label="Old Password" value={OldPassword} type="password" disabled={InProgress} onChange={(event) => setOldPass(event.target.value)} fullWidth
                        style={{ marginTop: "5px", marginBottom: "5px" }} /><br />
                    <TextField label="New Password" value={NewPassword} type="password" disabled={InProgress} onChange={(event) => setNewPass(event.target.value)} fullWidth
                        style={{ marginTop: "5px", marginBottom: "5px" }} /><br />
                    <TextField label="Confirm Password" type="password" disabled={InProgress} error={!PassMatch} helperText={PassMatch ? "" : "Passwords do not match"} onChange={(event) => setPassMatch(event.target.value === NewPassword)} fullWidth
                        style={{ marginTop: "5px", marginBottom: "5px" }} /><br />
                </DialogContent>
                <DialogActions>
                    {InProgress ? <CircularProgress size="20px"/> : <>
                        <Button onClick={handleChangePass}>OK</Button>
                        <Button onClick={() => setPassOpen(false)}>Cancel</Button>
                    </>
                    }
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
