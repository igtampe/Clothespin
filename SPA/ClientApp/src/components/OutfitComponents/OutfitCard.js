import React, { useState } from "react";
import {
    IconButton, Accordion, AccordionDetails, AccordionSummary,
    Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Button, Grid
} from "@material-ui/core";
import { ExpandMore, Edit, Delete } from '@material-ui/icons'
import Cookies from 'universal-cookie';
import { Alert } from "reactstrap";
import OutfitEditor from "./OutfitEditor";
import WearableMicroCard from "../WearableComponents/WearableMicroCard";

const cookies = new Cookies();

export default function OutfitCard(props) {

    const [expanded, setExpanded] = useState(false)
    const [Outfit, setOutfit] = useState(props.outfit)

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [editorOpen, setEditorOpen] = useState(false);

    const [result, setResult] = useState({ severity: "success", text: "idk" })
    const [SnackOpen, setSnackOpen] = useState(false);

    const onRealDeleteClick = (event) => {

        setConfirmOpen(false)

        //Send the request 
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'SessionID': cookies.get('SessionID') },
        };

        var url = "API/Persons/Outfits?ID=" + Outfit.id

        fetch(url, requestOptions)
            .then(response => {
                if (!response.ok) {
                    console.error(response);
                    return undefined
                }
                return response.json()
            }).then(data => {
                if (data === undefined) {
                    setResult({ severity: "danger", text: "Could not delete" })
                    setSnackOpen(true);
                }
                else {
                    setOutfit(data)
                    setResult({ severity: "success", text: Outfit.name + "'s been deleted!" })
                    setSnackOpen(true);
                }
            })

    }
    const toggleExpanded = (event) => { setExpanded(!expanded); }

    return (
        <React.Fragment>
            <Accordion hidden={!Outfit ? false : Outfit.deleted} expanded={expanded} onChange={toggleExpanded} style={{ borderRadius: "10px", border: "2px solid #e0e0e0", maxWidth: "300px" }}>
                <AccordionSummary>
                    <div style={{ margin: "5px", textAlign: "left", lineHeight: "1em" }}>
                        <img src={Outfit && (!Outfit.imageURL || Outfit.imageURL === "") ? '/images/Outfit.png' : Outfit.imageURL} alt='Outfit' width="250px" /><br /><br />
                        <b>{Outfit === undefined ? "Outfit" : Outfit.name} <ExpandMore style={expanded ? { transform: 'scaleY(-1)' } : {}} /> </b><br /><br />
                        {Outfit === undefined ? "" : Outfit.description}
                    </div>
                </AccordionSummary>
                <AccordionDetails>


                    <Grid container spacing={2}>

                        <Grid item xs={12}>

                            <Grid container spacing={2}>

                                {props.outfit.shirt ? <>
                                    <Grid item xs={12}>
                                        <i>Shirt:</i>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <WearableMicroCard wearable={props.outfit.shirt} type='Shirt' washable /><br />
                                    </Grid>
                                </> : ""}

                                {props.outfit.overshirts && props.outfit.overshirts.length > 0 ? <>
                                    <Grid item xs={12}>
                                        <i>Overshirt(s)</i><br />
                                    </Grid>
                                    {props.outfit.overshirts.map(o => (
                                        <Grid item xs={12}>
                                            <WearableMicroCard wearable={o} type='Overshirt' washable />
                                        </Grid>
                                    ))}

                                </> : ""}

                                {props.outfit.belt ? <>
                                    <Grid item xs={12}><br />
                                        <i>Belt</i><br />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <WearableMicroCard wearable={props.outfit.belt} type='Belt' /><br />
                                    </Grid>
                                </> : ""}

                                {props.outfit.pants ? <>
                                    <Grid item xs={12}>
                                        <i>Pants</i><br />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <WearableMicroCard wearable={props.outfit.pants} type='Pants' washable /><br />
                                    </Grid>
                                </> : ""}

                                {props.outfit.socks ? <>
                                    <Grid item xs={12}>
                                        <i>Socks</i><br />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <WearableMicroCard wearable={props.outfit.socks} type='Socks' washable /><br />
                                    </Grid>
                                </> : ""}

                                {props.outfit.shoes ? <>
                                    <Grid item xs={12}>
                                        <i>Shoes</i><br />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <WearableMicroCard wearable={props.outfit.shoes} type='Shoes' /><br />
                                    </Grid>
                                </> : ""}

                                {props.outfit.accessories && props.outfit.accessories.length > 0 ? <>
                                    <Grid item xs={12}>
                                        <i>Accessories</i><br />
                                    </Grid>
                                    {props.outfit.accessories ? props.outfit.accessories.map(o => (
                                        <Grid item xs={12}>
                                            <WearableMicroCard wearable={o} type='Accessory' />
                                        </Grid>
                                    )) : ""}
                                    <br />
                                </> : ""}
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <table style={{ minWidth: "265px", maxWidth: "265px", justifyContent: "center" }}>
                                <tr>
                                    <td style={{ minWidth: "160px" }}></td>
                                    <td><IconButton disabled={!Outfit} onClick={() => setConfirmOpen(true)}><Delete /></IconButton></td>
                                    <td><IconButton disabled={!Outfit} onClick={() => setEditorOpen(true)}><Edit /></IconButton></td>
                                </tr>
                            </table>
                        </Grid>

                    </Grid>
                </AccordionDetails>
            </Accordion>

            <Dialog maxWidth="xs" open={confirmOpen} scroll="paper">
                <DialogTitle>Delete {Outfit.name}?</DialogTitle>
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

            <OutfitEditor outfit={Outfit} setOutfit={setOutfit} open={editorOpen} setOpen={setEditorOpen} sizeable={props.sizeable} vertical={props.vertical} />

        </React.Fragment>
    );

}
