import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Snackbar, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { Alert } from "reactstrap";
import Cookies from 'universal-cookie';
import { ExpandMore } from '@material-ui/icons'
import WearablePicker from "../WearableComponents/WearablePicker";

const cookies = new Cookies();

export default function OutfitCreator(props) {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("")
    const [imageURL, setImageURL] = useState("")

    const [shirt, setShirt] = useState(undefined)
    const [pants, setPants] = useState(undefined)
    const [belt, setBelt] = useState(undefined)
    const [shoes, setShoes] = useState(undefined)
    const [socks, setSocks] = useState(undefined)

    const [overshirts, setOvershirts] = useState([])
    const [accessories, setAccessories] = useState([])

    const [result, setResult] = useState({ severity: "success", text: "idk" })
    const [SnackOpen, setSnackOpen] = useState(false);

    const [openAccordion, setOpenAccordion] = useState(-1);

    const Wearables = [
        {
            name: 'Shirts', type: 'Shirt', types: 'Shirts',
            selected: shirt, setSelected: setShirt,
            isCollection: false, sizeable: true, washable: true,
        },
        {
            name: 'Overshirts', type: 'Overshirt', types: 'Overshirts',
            selected: overshirts, setSelected: setOvershirts,
            isCollection: true, sizeable: true, washable: true,
        },
        {
            name: 'Belts', type: 'Belt', types: 'Belts',
            selected: belt, setSelected: setBelt,
            isCollection: false, sizeable: true, washable: false,
        },
        {
            name: 'Pants', type: 'Pants', types: 'Pants',
            selected: pants, setSelected: setPants,
            isCollection: false, sizeable: true, washable: true,
        },
        {
            name: 'Socks', type: 'Socks', types: 'Socks',
            selected: socks, setSelected: setSocks,
            isCollection: false, sizeable: false, washable: true,
        },
        {
            name: 'Shoes', type: 'Shoes', types: 'Shoes',
            selected: shoes, setSelected: setShoes,
            isCollection: false, sizeable: true, washable: false,
        },
        {
            name: 'Accessories', type: 'Accessory', types: 'Accessories',
            selected: accessories, setSelected: setAccessories,
            isCollection: true, sizeable: false, washable: false,
        },
    ]

    const ClearForm = () => {
        setName("")
        setDescription("")

        setShirt(undefined)
        setPants(undefined)
        setBelt(undefined)
        setShoes(undefined)
        setSocks(undefined)
        setOvershirts([])
        setAccessories([])
    }

    const handleClosing = (event) => {
        props.setOpen(false)
        ClearForm();
    }

    const handleOpenAccordion = (panel) => (event, isExpanded) => { setOpenAccordion(isExpanded ? panel : -1); };
    const advanceAccordion = (event) => { setOpenAccordion(openAccordion + 1) }

    const handleOK = (event) => {

        if (name === "") {
            setResult({
                severity: "danger",
                text: "Name cannot be empty!"
            })

            setSnackOpen(true);
            return
        }

        //Send the request 
        var requestOptions;
        var url;

        requestOptions = { method: 'POST', };
        url = "API/Persons/Outfits/Create"

        requestOptions = {
            ...requestOptions,
            headers: { 'Content-Type': 'application/json', 'SessionID': cookies.get('SessionID') },
            body: JSON.stringify({
                shirtID: shirt ? shirt.id : null, pantID: pants? pants.id : null, beltID: belt? belt.id : null, 
                shoesID: shoes? shoes.id : null, socksID: socks? socks.id : null, 
                overshirtIDs: overshirts, accessoryIDs: accessories, name: name, description: description, imageURL: imageURL,
                personID: cookies.get('PersonID')
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
                if (data===undefined) {
                    setResult({ severity: "danger", text: "Could not create this outfit" })
                    setSnackOpen(true);
                } else {
                    setResult({ severity: "success", text: name + " has been created!" })
                    if (props.setOutfits) { props.setOutfits(undefined) }

                    setSnackOpen(true);
                    handleClosing();
                }
            })

    }

    return (
        <React.Fragment>
            <Dialog fullWidth maxWidth="lg" open={props.open} onClose={handleClosing}>
                <DialogTitle>Create a new Outfit</DialogTitle>
                <DialogContent>
                    <table style={{ width: "100%" }}>
                        {
                            props.vertical ?
                            <tr>
                                <td style={{ width: "100%", textAlign:'center'}}>
                                    <img src={imageURL === "" ? "/images/outfit.png" : imageURL} alt="Profile" width="200px" style={{ marginLeft: "25px", marginRight: "10px" }} />
                                </td> 
                            </tr>
                        : "" }
                        <tr>
                            <td>
                                <TextField label="Name" value={name} onChange={(event) => setName(event.target.value)} fullWidth
                                    style={{ marginTop: "5px", marginBottom: "5px" }} />
                            </td>
                            {
                                props.vertical ? "" :
                                    <td rowSpan="3" style={{ width: "135px" }}>
                                        <img src={imageURL === "" ? "/images/outfit.png" : imageURL} alt="Profile" width="200px" style={{ marginLeft: "25px", marginRight: "10px" }} />
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
                    <br/>
                    <Divider />
                    <br/>
                    {
                        Wearables.map((p, i) => (
                            <Accordion expanded={openAccordion === i} onChange={handleOpenAccordion(i)}>
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <img src={"/images/clear/" + p.type + ".png"} alt={p.type} height='25px' style={{marginRight: '20px' }}/> {p.name + ": "} <div style={{ marginLeft: '5px' }}>
                                        {p.selected === undefined
                                            ? <i style={{ color: '#707070' }}> Select an item</i>
                                            : <>{p.isCollection
                                                ? <> {p.selected.length} item(s) selected</>
                                                : <table>
                                                    <tr>
                                                        <td><img src={p.selected.imageURL === "" ? 'images/' + p.type + '.png' : p.selected.imageURL} alt="item" height='25px' style={{ marginLeft: '5px', marginRight: '5px' }} /></td>
                                                        <td>{p.selected.name}</td>
                                                    </tr>
                                                </table>}</>
                                        }</div>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }} style={{ width: "100%" }}>
                                        <WearablePicker type={p.type} types={p.types} sizeable={p.sizeable} washable={p.washable}
                                            vertical={props.vertical} selected={p.selected} setSelected={p.setSelected} isCollection={p.isCollection} advanceAccordion={advanceAccordion} />
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        )
                        )
                    }
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
