import React, { useState } from "react";
import {
    IconButton, Accordion, AccordionDetails, AccordionSummary, FormControl, InputLabel, Select, MenuItem,
    Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Button
} from "@material-ui/core";
import { ExpandMore, Edit, Delete } from '@material-ui/icons'
import Cookies from 'universal-cookie';
import { Alert } from "reactstrap";
import WearableEditor from "./WearableEditor";

const cookies = new Cookies();

export default function WearableCard(props) {

    const Distinguishers = ["Universal", "Men's", "Women's", "Boy's", "Girl's"]

    const [expanded, setExpanded] = useState(false)
    const [Wearable, setWearable] = useState(props.wearable)

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [editorOpen, setEditorOpen] = useState(false);

    const [result, setResult] = useState({
        severity: "success",
        text: "idk"
    })

    const [SnackOpen, setSnackOpen] = useState(false);

    const onRealDeleteClick = (event) => {

        setConfirmOpen(false)

        //Send the request 
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'SessionID': cookies.get('SessionID') },
        };

        var url = "API/Clothes/" + props.type
            + "?ID=" + Wearable.id

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
                        text: "Could not delete"
                    })
                    setSnackOpen(true);
                }
                else {
                    setWearable(data)
                    setResult({
                        severity: "success",
                        text: Wearable.name + "'s been deleted!"
                    })
                    setSnackOpen(true);
                }
            })

    }

    const onChangeWashState = (event) => {

        var value = event.target.value;
        if (value === undefined) {

            if (event.target.innerText === "MARK DIRTY") { value = 2 }
            else if (event.target.innerText === "MARK CLEAN") { value = 0 }
            else {
                setResult({ severity: "danger", text: "Unknown target washstate" })
                setSnackOpen(true);
                return;
            }
        }

        //Send the request 
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'SessionID': cookies.get('SessionID') },
            body: JSON.stringify({ ...Wearable, "state": value })
        };

        var url = "API/Clothes/" + props.type
            + "?ID=" + Wearable.id

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
                        text: "Could not update wash state for this item"
                    })

                    setSnackOpen(true);

                }
                else {
                    setWearable(data)
                    setResult({
                        severity: "success",
                        text: Wearable.name + "'s wash state has been updated"
                    })
                    setSnackOpen(true);
                }
            })
    }

    const toggleExpanded = (event) => { setExpanded(!expanded); }

    return (
        <React.Fragment>
            <Accordion hidden={!Wearable ? false : Wearable.deleted} expanded={expanded} onChange={toggleExpanded} style={{ borderRadius: "10px", border: "2px solid #e0e0e0", maxWidth: "300px" }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <table>
                        <tr>
                            <td style={{ minWidth: "80x" }}><img style={{ margin: "5px" }} src={Wearable === undefined ? "/images/" + props.type + ".png" :
                                Wearable.imageURL === "" || Wearable.imageURL === undefined ? "/images/" + props.type + ".png" : Wearable.imageURL

                            } alt={props.type} width="75px" /></td>
                            <td style={{ minWidth: "155px" }}>
                                <div style={{ margin: "5px", textAlign: "left", lineHeight: "1.1em" }}>
                                    <b>{Wearable === undefined ? props.type : Wearable.name}</b><br />
                                    <i>{Wearable === undefined || props.subtypes === undefined ? "Unknown" : props.subtypes[Wearable.type].replace("_", " ")}</i>
                                </div>
                            </td>
                        </tr>
                    </table>
                </AccordionSummary>
                <AccordionDetails>
                    <table style={{ minWidth: "265px", maxWidth: "265px", justifyContent: "center" }}>
                        {props.sizeable && Wearable !== undefined ? <tr><td colSpan={3}> Size: {Distinguishers[Wearable.distinguisher]} {Wearable.size} ({Wearable.region})</td></tr> : ""}
                        <tr><td colSpan={3}>{Wearable === undefined ? "" : Wearable.color}<br /><br /></td></tr>
                        <tr><td colSpan={3}>{Wearable === undefined ? "" : Wearable.description}<br /><br /></td></tr>
                        {props.children ? <tr><td colSpan={3}>{props.children}</td></tr> : <>
                            {props.washable ?
                            <tr>
                                <td colSpan={3}>
                                    {Wearable && (Wearable.state === 0 || Wearable.state === 1)
                                        ? <Button fullWidth id="DirtyBTN" onClick={onChangeWashState} variant="contained" color="secondary">Mark Dirty</Button>
                                        : <Button fullWidth id="CleanBTN" onClick={onChangeWashState} variant="contained" color="primary">Mark Clean</Button>}
                                    <br /><br />
                                </td>
                            </tr> : ""}
                            <tr>
                                <td style={{ minWidth: "160px" }}>
                                    {props.washable ?
                                        <FormControl fullWidth>
                                            <InputLabel fullWidth>Wash State</InputLabel>
                                            <Select fullWidth label="Label" value={Wearable === undefined ? 0 : Wearable.state}
                                                disabled={!Wearable} onChange={onChangeWashState}>
                                                <MenuItem value={0}>Clean</MenuItem>
                                                <MenuItem value={1}>Semi-Clean</MenuItem>
                                                <MenuItem value={2}>Dirty</MenuItem>
                                                <MenuItem value={3}>Washing</MenuItem>
                                                {/**<MenuItem value={4}Drying</MenuItem>**/}
                                                <MenuItem value={5}>Washed</MenuItem>
                                            </Select></FormControl> : ""}
                                </td>
                                <td><IconButton disabled={!Wearable || props.disableDelete} onClick={() => setConfirmOpen(true)}><Delete /></IconButton></td>
                                <td><IconButton disabled={!Wearable} onClick={() => setEditorOpen(true)}><Edit /></IconButton></td>
                        </tr></>
                        }
                    </table>
                </AccordionDetails>
            </Accordion>

            <Dialog maxWidth="xs" open={confirmOpen} scroll="paper">
                <DialogTitle>Delete {Wearable.name}?</DialogTitle>
                <DialogContent>
                    This item will be marked as deleted and you won't see it again (unless it's been used in an existing outfit).<br /><br /> Are you sure you want to do this?
                </DialogContent>
                <DialogActions>
                    <Button onClick={onRealDeleteClick}> Yes </Button>
                    <Button onClick={() => { setConfirmOpen(false) }}> No </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={SnackOpen} autoHideDuration={6000} onClose={() => setSnackOpen(false)}>
                <Alert onClose={() => setSnackOpen(false)} color={result.severity} sx={{ width: '100%' }}>
                    {result.text}
                </Alert>
            </Snackbar>

            <WearableEditor type={props.type} types={props.types} wearable={Wearable} setWearable={setWearable}
                subtypes={props.subtypes} open={editorOpen} setOpen={setEditorOpen} sizeable={props.sizeable} />

        </React.Fragment>
    );

}
