import React, { useState } from "react";
import {
    IconButton, Accordion, AccordionDetails, AccordionSummary,
    Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Button, Grid, Divider
} from "@material-ui/core";
import { ExpandMore, Edit, Delete } from '@material-ui/icons'
import Cookies from 'universal-cookie';
import { Alert } from "reactstrap";
import OutfitEditor from "./OutfitEditor";
import WearableLabel from "../WearableComponents/WearableLabel";

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
                    <Divider/>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Grid container spacing={2}>

                                {props.outfit.shirt ?
                                    <Grid item xs={12}>
                                        <img src={"/images/clear/shirt.png"} alt={'shirt'} height='25px' style={{ marginLeft:'5px', marginRight: '5px' }}/> <b>Shirt:</b>
                                        <br/><WearableLabel wearable={props.outfit.shirt} type={'shirt'}/>
                                    </Grid> : ""}

                                {props.outfit.overshirts && props.outfit.overshirts.length > 0 ?
                                    <Grid item xs={12}>
                                        <img src={"/images/clear/overshirt.png"} alt={'overshirt'} height='25px' style={{ marginLeft:'5px', marginRight: '5px' }}/> <b>Overshirts:</b><br/>  
                                        {props.outfit.overshirts.map(p=>(<WearableLabel wearable={p} type={'overshirt'}/>))}
                                    </Grid>: ""}

                                {props.outfit.belt ?
                                    <Grid item xs={12}>
                                        <img src={"/images/clear/belt.png"} alt={'belt'} height='25px' style={{ marginLeft:'5px', marginRight: '5px' }}/> <b>Belt:</b>
                                        <br/><WearableLabel wearable={props.outfit.belt} type={'belt'}/>
                                    </Grid>: ""}

                                {props.outfit.pants ?
                                    <Grid item xs={12}>
                                        <img src={"/images/clear/pants.png"} alt={'pants'} height='25px' style={{ marginLeft:'5px', marginRight: '5px' }}/> <b>Pants:</b>
                                        <br/><WearableLabel wearable={props.outfit.pants} type={'pants'}/>
                                    </Grid>: ""}

                                {props.outfit.socks ?
                                    <Grid item xs={12}>
                                        <img src={"/images/clear/socks.png"} alt={'socks'} height='25px' style={{ marginLeft:'5px', marginRight: '5px' }}/> <b>Socks:</b>
                                        <br/><WearableLabel wearable={props.outfit.socks} type={'socks'}/>
                                    </Grid>: ""}

                                {props.outfit.shoes ?
                                    <Grid item xs={12}>
                                        <img src={"/images/clear/shoes.png"} alt={'shoes'} height='25px' style={{ marginLeft:'5px', marginRight: '5px' }}/> <b>Shoes:</b>
                                        <br/><WearableLabel wearable={props.outfit.shoes} type={'shoes'}/>
                                    </Grid>: ""}

                                {props.outfit.accessories && props.outfit.accessories.length > 0 ?
                                    <Grid item xs={12}>
                                        <img src={"/images/clear/accessory.png"} alt={'accessory'} height='25px' style={{ marginLeft:'5px', marginRight: '5px' }}/> <b>Accessories:</b><br/>
                                        {props.outfit.accessories.map(p=>(<WearableLabel wearable={p} type={'accessory'}/>))}
                                    </Grid>: ""}
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
