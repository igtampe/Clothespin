import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { Alert } from "reactstrap";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default function OutfitEditor(props) {

    const [name, setName] = useState("");
    const [imageURL, setImageURL] = useState("");
    const [description, setDescription] = useState("")

    const [populated, setPopulated] = useState(false);

    const [result, setResult] = useState({ severity: "success", text: "idk" })

    const [SnackOpen, setSnackOpen] = useState(false);

    if (props.outfit && !populated && props.open) {
        //Populate
        setPopulated(true);
        setName(props.outfit.name)
        setDescription(props.outfit.description)
    }

    const ClearForm = () => {
        setName("")
        setDescription("")
        setPopulated(false)
    }

    const handleClosing = (event) => {
        props.setOpen(false)
        ClearForm();
    }

    const handleOK = (event) => {

        if (name === "") {
            setResult({ severity: "danger", text: "Name cannot be empty!" })
            setSnackOpen(true);
        }

        //Send the request 
        var requestOptions;
        var url;

        if (props.outfit) {
            requestOptions = { method: 'PUT' };
            url = "API/Persons/Outfits"
        } else {
            return; //We do not create outfits using the outfit editor (unlike the wearable editor that is reusable)
            //requestOptions = { method: 'POST', };
            //url = "API/Clothes/" + props.type + "?PersonID=" + cookies.get('PersonID')
        }

        console.log(url)

        requestOptions = {
            ...requestOptions,
            headers: { 'Content-Type': 'application/json', 'SessionID': cookies.get('SessionID') },
            body: JSON.stringify({ id: props.outfit.id, name: name, description: description, imageURL:imageURL })
        }

        fetch(url, requestOptions)
            .then(response => {
                if (!response.ok) {
                    console.error(response);
                    return undefined
                }
                return response.json()
            }).then(data => {
                if (data === undefined) {

                    setResult({ severity: "danger", text: "Could not update this item" })
                    setSnackOpen(true);

                } else {
                    setResult({ severity: "success", text: name + " has been updated!" })
                    if (props.setOutfit) { props.setOutfit(data) }

                    setSnackOpen(true);
                    handleClosing();
                }
            })

    }

    return (
        <React.Fragment>
            <Dialog fullWidth maxWidth="sm" open={props.open} onClose={handleClosing}>
                <DialogTitle>Editing {name}</DialogTitle>
                <DialogContent>
                    <table style={{width:'100%'}}>
                        {props.vertical ? 
                            <tr>
                                <td style={{textAlign:'center'}}>
                                    <img src={imageURL === "" ? "/images/outfit.png" : imageURL} alt="Profile" width="200px"    />
                                    <br/>
                                </td>
                            </tr>
                        : ""}
                        <tr>
                            <td>
                                <TextField label="Name" value={name} onChange={(event) => setName(event.target.value)} fullWidth
                                    style={{ marginTop: "5px", marginBottom: "5px" }} />                            </td>
                            {
                                props.vertical ? "" : 
                                <td rowSpan="3" style={{width:'225px'}}>
                                    <img src={imageURL === "" ? "/images/outfit.png" : imageURL} alt="Profile" width="200px" style={{ marginLeft: "25px", marginRight: "10px"}} />
                                </td>
                            }
                        </tr>
                        <tr>
                            <td>
                                <TextField label="Image URL" value={imageURL} onChange={(event) => setImageURL(event.target.value)} fullWidth
                                    style={{ marginTop: "5px", marginBottom: "5px" }} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <TextField label="Description/Notes" value={description} onChange={(event) => setDescription(event.target.value)} fullWidth multiline
                                    style={{ marginTop: "5px", marginBottom: "5px" }} maxRows={3} minRows={3} variant="filled" color="secondary" />
                            </td>
                        </tr>
                    </table>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleOK}>OK</Button>
                    <Button onClick={handleClosing}>Cancel</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={SnackOpen} autoHideDuration={6000} onClose={() => setSnackOpen(false)}>
                <Alert onClose={() => setSnackOpen(false)} color={result.severity} sx={{ width: '100%' }}>
                    {result.text}
                </Alert>
            </Snackbar>

        </React.Fragment>
    );

}
