import React, { useState } from "react";
import {
    Accordion, AccordionDetails, AccordionSummary, FormControl,
    InputLabel, Select, MenuItem, Snackbar, Button, Grid
} from "@material-ui/core";
import { ExpandMore } from '@material-ui/icons'
import Cookies from 'universal-cookie';
import { Alert } from "reactstrap";

const cookies = new Cookies();

export default function WearableMicroCard(props) {

    const [expanded, setExpanded] = useState(false)
    const [Wearable, setWearable] = useState(props.wearable)

    const [result, setResult] = useState({ severity: "success", text: "idk" })
    const [SnackOpen, setSnackOpen] = useState(false);

    const onChangeWashState = (event) => {

        var value = event.target.value;
        if (value === undefined) {

            if (event.target.innerText === "MARK DIRTY") {
                console.log("Dirty!")
                value = 2
            }
            else if (event.target.innerText === "MARK CLEAN") {
                console.log("Clean!")
                value = 0
            }
            else {
                console.log(event);
                setResult({
                    severity: "danger",
                    text: "Unknown target washstate"
                })

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
                    if(props.setWearable) {props.setWearable(data)}
                    setResult({ severity: "success", text: Wearable.name + "'s wash state has been updated" })
                    setSnackOpen(true);
                }
            })
    }

    const toggleExpanded = (event) => { setExpanded(!expanded); }

    if(!Wearable) { return(<></>) }

    return (
        <React.Fragment>
            <Accordion hidden={!Wearable ? false : Wearable.deleted} expanded={!props.washable ? false : expanded} 
            onChange={!props.washable ? undefined : toggleExpanded} style={{ borderRadius: "10px", border: "2px solid #e0e0e0", maxWidth: "300px" }}>
                <AccordionSummary expandIcon={!props.washable? undefined :<ExpandMore />}>
                    <table>
                        <tr>
                            <td style={{ minWidth: "80x" }}><img style={{ margin: "5px" }} src={Wearable === undefined ? "/images/" + props.type + ".png" :
                                Wearable.imageURL === "" || Wearable.imageURL === undefined ? "/images/" + props.type + ".png" : Wearable.imageURL
                            } alt={props.type} width="50px" /></td>
                            <td style={{ minWidth: "155px" }}>
                                <div style={{ margin: "5px", textAlign: "left", lineHeight: "1.1em" }}>
                                    <b>{Wearable === undefined ? props.type : Wearable.name}</b>
                                </div>
                            </td>
                        </tr>
                    </table>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={2}>
                    <Grid item xs={12}>
                            {Wearable && (Wearable.state === 0 || Wearable.state === 1)
                                ? <Button fullWidth id="DirtyBTN" onClick={onChangeWashState} variant="contained" color="secondary">Mark Dirty</Button>
                                : <Button fullWidth id="CleanBTN" onClick={onChangeWashState} variant="contained" color="primary">Mark Clean</Button>}
                        </Grid>
                        <Grid item xs={12}>
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
                                </Select></FormControl>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>

            <Snackbar open={SnackOpen} autoHideDuration={6000} onClose={() => setSnackOpen(false)}>
                <Alert onClose={() => setSnackOpen(false)} color={result.severity} sx={{ width: '100%' }}>
                    {result.text}
                </Alert>
            </Snackbar>

        </React.Fragment>
    );

}
