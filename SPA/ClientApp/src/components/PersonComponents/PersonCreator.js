import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@material-ui/core";
import { CircularProgress } from "@material-ui/core";
import Cookies from 'universal-cookie';
import AlertSnackbar from "../AlertSnackbar";
import PicturePicker from "../PicturePicker";

const cookies = new Cookies();


export default function PersonCreator(props) {

    const [name, setName] = useState(props.person===undefined ? "" : props.person.Name);
    const [imageURL, setImageURL] = useState(props.person===undefined ? "" : props.person.imageURL);
    const [InProgress, setInProgress] = useState(false);

    const [pickerOpen, setPickerOpen] = useState(false)

    const [Populated, setPopulated] = useState(false);

    const [result, setResult] = useState({ severity: "success", text: "idk" })
    const [SnackOpen, setSnackOpen] = useState(false);

    const handleCreatePerson = (event) => {

        if (name === "") {
            setResult({
                severity: "danger",
                text: "Name cannot be empty!"
            })
            setSnackOpen(true);
            return;
        }

        setInProgress(true);

        var requestOptions;

        if(props.person===undefined){
            requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', "sessionID": cookies.get("SessionID") },
                body: JSON.stringify({
                    "name": name,
                    "imageURL": imageURL
                })
            };    
        } else {
            requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', "sessionID": cookies.get("SessionID") },
                body: JSON.stringify({
                    "id" : props.person.id,
                    "name": name,
                    "imageURL": imageURL
                })
            };    
        }


        fetch("API/Persons", requestOptions)
            .then(response => {
                setInProgress(false);
                if ( !response.ok && response.status !== 201) { return { "error": response.text() } }
                return response.json()
            }).then(data => {
                if (data.error !== undefined) {
                    setResult({
                        severity: "danger",
                        text: data.error
                    })
                    setSnackOpen(true);
                } else {
                    //s u c c e s s
                    setResult({
                        severity: "success",
                        text: "Person " + (props.person === undefined ? "created" : "updated") + " successfully"
                    })
                    setSnackOpen(true);
                    props.setOpen(false)
                    if(props.setPersons !== undefined) {props.setPersons(undefined)}
                    if(props.setPerson !== undefined) {props.setPerson({...props.person, Name:name, imageURL: imageURL === "" ? "/images/blankperson.png" : imageURL})}
                    setName("");
                    setImageURL("");
                }
            })


    }

    if(props.open && !Populated){
        
        //Attempt to populate
        if(props.person !== undefined){
            setName(props.person.Name)
            setImageURL(props.person.imageURL)
        }

        setPopulated(true)
    }

    //Reset population
    if(!props.open && Populated) { setPopulated(false); }

    return (
        <React.Fragment>
            <Dialog maxWidth="lg" open={props.open} onClose={() => props.setOpen(false)} scroll="paper">
                <DialogTitle>{props.person===undefined ? "Create a new person" : "Edit a Person"}</DialogTitle>
                <DialogContent>
                    <table>
                        <tr>
                            <td>
                                <TextField label="Person Name" value={name} onChange={(event) => setName(event.target.value)} fullWidth
                                    style={{ marginTop: "5px", marginBottom: "5px" }} />                            </td>
                            <td rowSpan="2">
                                <Button onClick={()=>setPickerOpen(true)}>
                                    <img src={imageURL === "" ? "/images/blankperson.png" : imageURL} alt="Profile" width="100px" style={{ marginLeft: "25px", marginRight: "10px" }} />
                                </Button>
                            </td>
                        </tr>
                    </table>
                </DialogContent>
                <DialogActions>
                    {InProgress ? <CircularProgress size="20px" /> : <>
                        <Button onClick={handleCreatePerson}> OK </Button>
                        <Button onClick={() => { props.setOpen(false) }}> Cancel </Button></>}
                </DialogActions>
            </Dialog>

            <AlertSnackbar open={SnackOpen} setOpen={setSnackOpen} result={result}/>

            <PicturePicker open={pickerOpen} setOpen={setPickerOpen} imageURL={imageURL} setImageURL={setImageURL} defaultImage={"/images/Blankperson.png"}/>

        </React.Fragment>
    );

}
