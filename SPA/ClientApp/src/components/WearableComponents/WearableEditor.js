import React, { useState } from "react";
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid,
    InputLabel, MenuItem, Select, TextField
} from "@material-ui/core";
import Cookies from 'universal-cookie';
import AlertSnackbar from "../AlertSnackbar";
import PicturePicker from "../PicturePicker";

const cookies = new Cookies();

export default function WearableEditor(props) {

    const [name, setName] = useState("");
    const [imageURL, setImageURL] = useState("");
    const [subtype, setSubtype] = useState(0);
    const [color, setColor] = useState("");
    const [distinguisher, setDistinguisher] = useState(0);
    const [size, setSize] = useState("");
    const [region, setRegion] = useState("US");
    const [description, setDescription] = useState("")

    const [pickerOpen, setPickerOpen] = useState(false)

    const [populated, setPopulated] = useState(false);

    const [result, setResult] = useState({
        severity: "success",
        text: "idk"
    })

    const [SnackOpen, setSnackOpen] = useState(false);

    if (props.wearable && !populated && props.open) {
        //Populate
        setPopulated(true);
        setName(props.wearable.name)
        setImageURL(props.wearable.imageURL)
        setColor(props.wearable.color)
        setSubtype(props.wearable.type)
        setDescription(props.wearable.description)

        if (props.sizeable) {
            setDistinguisher(props.wearable.distinguisher)
            setRegion(props.wearable.region)
            setSize(props.wearable.size)
        }
    }

    const ClearForm = () => {
        setName("")
        setImageURL("")
        setSubtype(0)
        setColor("")
        setDescription("")

        setDistinguisher(0)
        setRegion("US")
        setSize("")
        setPopulated(false)
    }

    const handleClosing = (event) => {

        props.setOpen(false)
        ClearForm();
    }

    const handleOK = (event) => {

        if (name === "") {
            setResult({
                severity: "danger",
                text: "Name cannot be empty!"
            })

            setSnackOpen(true);
        }

        //Send the request 
        var requestOptions;
        var url;

        if (props.wearable) {
            requestOptions = { method: 'PUT' };
            url = "API/Clothes/" + props.type + "?ID=" + props.wearable.id
        } else {
            requestOptions = { method: 'POST', };
            url = "API/Clothes/" + props.type + "?PersonID=" + cookies.get('PersonID')
        }

        requestOptions = {
            ...requestOptions,
            headers: { 'Content-Type': 'application/json', 'SessionID': cookies.get('SessionID') },
            body: JSON.stringify({
                ...props.wearable,
                type: subtype, name: name, description: description,
                imageURL: imageURL, color: color, distinguisher: distinguisher,
                size: size, region: region
            })
        }

        fetch(url,
            requestOptions)
            .then(response => {
                if (!response.ok) {
                    console.error(response);
                    return undefined
                }
                return response.json()
            }).then(data => {
                if (data === undefined) {

                    setResult({
                        severity: "danger",
                        text: "Could not " + (props.wearable ? "update" : "create") + " this item"
                    })

                    setSnackOpen(true);

                } else {
                    setResult({
                        severity: "success",
                        text: name + " has been " + (props.wearable ? "updated" : "created") + "!"
                    })

                    if (props.setWearables) { props.setWearables(undefined) }
                    if (props.setWearable) { props.setWearable(data) }

                    setSnackOpen(true);

                    handleClosing();
                }
            })

    }

    const Distinguishers = ["Universal", "Men's", "Women's", "Boy's", "Girl's"]

    return (
        <React.Fragment>
            <Dialog fullWidth maxWidth="sm" open={props.open} onClose={handleClosing}>
                <DialogTitle>Create a new {props.type}</DialogTitle>
                <DialogContent>
                    <table style={{ width: "100%" }}>
                        <tr>
                            <td>
                                <TextField label="Name" value={name} onChange={(event) => setName(event.target.value)} fullWidth
                                    style={{ marginTop: "5px", marginBottom: "5px" }} />                            </td>
                            <td rowSpan="2" style={{ width: "135px" }}>
                                <Button onClick={()=>setPickerOpen(true)}>
                                    <img src={imageURL === "" ? "/images/" + props.type + ".png" : imageURL} alt="Profile" width="100px" style={{ marginLeft: "25px", marginRight: "10px" }} />
                                </Button>
                            </td>
                        </tr>
                    </table>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField label="Color" value={color} onChange={(event) => setColor(event.target.value)} fullWidth
                                style={{ marginTop: "5px", marginBottom: "5px" }} />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth style={{ marginTop: "5px", marginBottom: "5px" }}>
                                <InputLabel fullWidth>Subtype</InputLabel>
                                <Select fullWidth label="Label" value={subtype} onChange={(event) => { setSubtype(event.target.value) }}>
                                    {props.subtypes ? props.subtypes.map((element, index) => <MenuItem value={index}>{element.replace('_', ' ')}</MenuItem>) : ""}
                                </Select></FormControl>
                        </Grid>
                        {props.sizeable
                            ? <>
                                <Grid item xs={4}>
                                    <FormControl fullWidth style={{ marginTop: "5px", marginBottom: "5px" }}>
                                        <InputLabel fullWidth>Size Distinguisher</InputLabel>
                                        <Select fullWidth label="Label" value={distinguisher} onChange={(event) => { setDistinguisher(event.target.value) }}>
                                            {Distinguishers.map((element, index) => <MenuItem value={index}>{element.replace('_', ' ')}</MenuItem>)}
                                        </Select></FormControl>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField label="Size" value={size} onChange={(event) => setSize(event.target.value)} fullWidth
                                        style={{ marginTop: "5px", marginBottom: "5px" }} />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField label="Size Region" value={region} onChange={(event) => setRegion(event.target.value)} fullWidth
                                        style={{ marginTop: "5px", marginBottom: "5px" }} />
                                </Grid>
                            </> : ""}
                        <Grid item xs={12}>
                            <TextField label="Description/Notes" value={description} onChange={(event) => setDescription(event.target.value)} fullWidth multiline
                                style={{ marginTop: "5px", marginBottom: "5px" }} maxRows={6} minRows={6} variant="filled" color="secondary" />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleOK}>OK</Button>
                    <Button onClick={handleClosing}>Cancel</Button>
                </DialogActions>
            </Dialog>

            <AlertSnackbar open={SnackOpen} setOpen={setSnackOpen} result={result} />

            <PicturePicker open={pickerOpen} setOpen={setPickerOpen} imageURL={imageURL} setImageURL={setImageURL} defaultImage={"/images/" + props.type + ".png"}/>

        </React.Fragment>
    );

}
