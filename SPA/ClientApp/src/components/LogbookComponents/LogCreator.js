import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Grid, Divider, Accordion, AccordionSummary, AccordionDetails, Box, CircularProgress } from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import WearableLabel from "../WearableComponents/WearableLabel";
import WearablePicker from "../WearableComponents/WearablePicker";
import Cookies from "universal-cookie";
import OutfitCard from "../OutfitComponents/OutfitCard";
import AlertSnackbar from "../AlertSnackbar";

const cookies = new Cookies();

export default function LogCreator(props) {

    const [date, setDate] = useState("")
    const [note, setNote] = useState("")

    const [shirt, setShirt] = useState(undefined)
    const [pants, setPants] = useState(undefined)
    const [belt, setBelt] = useState(undefined)
    const [shoes, setShoes] = useState(undefined)
    const [socks, setSocks] = useState(undefined)

    //These are for outfit creation
    const [name, setName] = useState('')
    const [imageURL, setImageURL] = useState('')
    const [description, setDescription] = useState('')
    const [creatorOpen, setCreatorOpen] = useState('')
    //We should've REALLY made this a separate component but I really just want to end this project pls

    const [overshirts, setOvershirts] = useState([])
    const [accessories, setAccessories] = useState([])

    const [openAccordion, setOpenAccordion] = useState(-1);

    const [potentialOutfits, setPotentialOutfits] = useState(undefined)
    const [loading, setLoading] = useState(false);
    const [outfit, setOutfit] = useState(undefined)

    const [displayedItems, setDisplayedItems] = useState(0);
    const [noMas, setNoMas] = useState(false)

    const [result, setResult] = useState({ severity: "success", text: "idk" })
    const [SnackOpen, setSnackOpen] = useState(false);

    //Defined if the form is blank and no searching should occur
    const Blank = (shirt === undefined && pants === undefined && belt === undefined && shoes === undefined && socks === undefined && overshirts.length === 0 && accessories.length === 0)

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
        setDate('')
        setNote('')

        setShirt(undefined)
        setPants(undefined)
        setBelt(undefined)
        setShoes(undefined)
        setSocks(undefined)
        setOvershirts([])
        setAccessories([])

        setOutfit(undefined)
        setPotentialOutfits(undefined)
        setLoading(false);

    }

    const onClosing = () => {
        ClearForm();
        props.setOpen(false)
    }

    if (potentialOutfits === undefined && !Blank && !loading) {

        //Time to get this collection
        setLoading(true)

        //Prepare the body
        var Body = {};
        if (shirt) { Body = { ...Body, shirtID: shirt.id } }
        if (belt) { Body = { ...Body, beltID: belt.id } }
        if (pants) { Body = { ...Body, pantID: pants.id } }
        if (socks) { Body = { ...Body, socksID: socks.id } }
        if (shoes) { Body = { ...Body, shoesID: shoes.id } }

        if (overshirts.length > 0) { Body = { ...Body, overshirtIDs: overshirts } }
        if (accessories.length > 0) { Body = { ...Body, accessoryIDs: accessories } }


        ///API/Persons/Clothes/Shirts?PersonID=38a015f4-388e-4866-030c-08d9c23a261d&Sort=0&Query=a&Type=0&State=0
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'SessionID': cookies.get('SessionID') },
            body: JSON.stringify(Body)
        };

        var url = "API/Persons/Outfits"

        fetch(url, requestOptions)
            .then(response => {
                if (!response.ok) {
                    console.error(response);
                    return undefined
                }
                return response.json()
            }).then(data => {
                if (data === undefined) { return; } else {
                    setPotentialOutfits(data)
                    setDisplayedItems(20);
                    setNoMas(data.length !== 20)
                }
                setLoading(false)
            })
    }

    const getMas = (event) => {
        setLoading(true)

        //Prepare the body
        var Body = {};
        if (shirt) { Body = { ...Body, shirtID: shirt.id } }
        if (belt) { Body = { ...Body, beltID: belt.id } }
        if (pants) { Body = { ...Body, pantID: pants.id } }
        if (socks) { Body = { ...Body, socksID: socks.id } }
        if (shoes) { Body = { ...Body, shoesID: shoes.id } }

        if (overshirts.length > 0) { Body = { ...Body, overshirtIDs: overshirts } }
        if (accessories.length > 0) { Body = { ...Body, accessoryIDs: accessories } }


        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'SessionID': cookies.get('SessionID') },
            body: JSON.stringify(Body)
        };

        var url = "API/Persons/Outfits?Skip=" + displayedItems


        fetch(url,
            requestOptions)
            .then(response => {
                setLoading(false)
                if (!response.ok) {
                    console.error(response);
                    return undefined
                }
                return response.json()
            }).then(data => {
                if (data === undefined) { } else {
                    setPotentialOutfits(potentialOutfits.concat(data))
                    setDisplayedItems(displayedItems + 20);
                    setNoMas(data.length !== displayedItems)
                }
            })
    }

    const handleOpenAccordion = (panel) => (event, isExpanded) => {
        setOpenAccordion(isExpanded ? panel : -1);
        if(!isExpanded) {setPotentialOutfits(undefined)}
    };

    const advanceAccordion = (event) => {
        setOpenAccordion(openAccordion + 1)
        setPotentialOutfits(undefined)
    }

    const handleOK = (event) => {

        if(!outfit) {
            setResult({severity:'danger', text:'You must select an outfit!'})
            setSnackOpen(true)
            return;
        }
        
        if(date==='') { 
            setResult({severity:'danger', text:'Date cannot be blank!'}) 
            setSnackOpen(true)
            return;
        }

        onClosing();

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'SessionID': cookies.get('SessionID') },
            body: JSON.stringify({
                outfitID:outfit.id, date:date, note:note,
                personID: cookies.get('PersonID')
            })
        };

        var url = "API/Persons/Log"

        fetch(url, requestOptions)
            .then(response => {
                if (!response.ok) {
                    console.error(response);
                    return undefined
                }
                return response.json()
            }).then(data => {
                if (data === undefined) { 
                    setResult({severity:'danger', text:'Log was not created! Algo paso (?)'})
                    setSnackOpen(true)
                    props.setLogs(undefined)
                 } else {
                    setResult({severity:'success', text:'Log entry created successfully!'})
                    setSnackOpen(true)
                    props.setLogs(undefined)
                }
                setLoading(false)
            })



    }

    const handleCreate = (event) => {
        if (name === "") {
            setResult({ severity: "danger", text: "Name cannot be empty!" })
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

        setCreatorOpen(false)

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
                    setPotentialOutfits(undefined)   
                }
            })



    }

    return (
        <React.Fragment>

            <Dialog maxWidth='xl' fullWidth open={props.open} onClose={onClosing}>

                <DialogTitle> Create a new log entry </DialogTitle>
                <DialogContent>

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField label="Log Date" type="date" value={date} onChange={(event) => { setDate(event.target.value) }} InputLabelProps={{ shrink: true, }} fullWidth />
                            <TextField label="Notes" value={note} onChange={(event) => setNote(event.target.value)} fullWidth multiline
                                style={{ marginTop: "5px", marginBottom: "5px" }} maxRows={3} minRows={3} variant="filled" color="secondary" />
                            <br />
                            <Divider />
                            <b>What did you wear on this day?</b>
                            <br />
                            <br />
                            {
                                Wearables.map((p, i) => (
                                    <Accordion expanded={openAccordion === i} onChange={handleOpenAccordion(i)}>
                                        <AccordionSummary expandIcon={<ExpandMore />}>
                                            <img src={"/images/clear/" + p.type + ".png"} alt={p.type} height='25px' style={{ marginRight: '20px' }} /> {p.name + ": "} <div style={{ marginLeft: '5px' }}>
                                                {p.selected === undefined
                                                    ? <i style={{ color: '#707070' }}> Select an item</i>
                                                    : <>{p.isCollection
                                                        ? <> {p.selected.length} item(s) selected</>
                                                        : <WearableLabel wearable={p.selected} type={p.type} />}</>
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

                        </Grid>
                        <Grid item xs={12}>
                            {
                                Blank ?

                                    <div style={{ textAlign: 'center' }}>
                                        Select a Wearable from above to begin
                                    </div>

                                    : <>{!potentialOutfits ?
                                        <div style={{ textAlign: 'center' }}>
                                            <CircularProgress />
                                        </div>
                                        : <div>

                                            <b>Select an Outfit:</b><br/><br/>
                                            
                                            <Grid container spacing={2}>
                                                
                                            {potentialOutfits.map(o=>{
                                                
                                                var selected = outfit && outfit.id===o.id

                                                return(<>
                                                <Grid item xs>
                                                <OutfitCard outfit={o}> 
                                                    <Button style={selected ? {backgroundColor:'#e0ffc7', width:'100%'} : {width:'100%'}} variant={selected ? 'contained' : 'outlined'}
                                                    onClick={()=>{if(selected){setOutfit(undefined)} else {setOutfit(o)}}}>
                                                        {selected ? 'Outfit selected' : 'Select this outfit'}
                                                    </Button>
                                                </OutfitCard>
                                                </Grid>                                                
                                                </>)
                                            })}

                                            </Grid>

                                            <div hidden={!potentialOutfits || loading} style={{ textAlign: 'center', marginTop: '50px' }}>
                                                { !noMas ? <><Button hidden={noMas && false} variant='contained' color='primary' onClick={getMas}> Get More </Button><br/><br/></>:<></>}
                                                <b>Didn't find a matching outfit?</b><br/>
                                                <Button variant='contained' color='primary' onClick={()=>{setCreatorOpen(true)}}> Create a new outfit </Button>
                                            </div>
                                        </div>
                                    }</>
                            }


                        </Grid>
                    </Grid>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleOK}> OK </Button>
                    <Button onClick={onClosing}> Cancel </Button>
                </DialogActions>

            </Dialog>

            <AlertSnackbar open={SnackOpen} setOpen={setSnackOpen} result={result}/>

            <Dialog fullWidth maxWidth="sm" open={creatorOpen} onClose={()=>{setCreatorOpen(false)}}>
                <DialogTitle>Creating {name}</DialogTitle>
                <DialogContent>
                    <table style={{ width: '100%' }}>
                        {props.vertical ?
                            <tr>
                                <td style={{ textAlign: 'center' }}>
                                    <img src={imageURL === "" ? "/images/outfit.png" : imageURL} alt="Profile" width="200px" />
                                    <br />
                                </td>
                            </tr>
                            : ""}
                        <tr>
                            <td>
                                <TextField label="Name" value={name} onChange={(event) => setName(event.target.value)} fullWidth
                                    style={{ marginTop: "5px", marginBottom: "5px" }} />                            </td>
                            {
                                props.vertical ? "" :
                                    <td rowSpan="3" style={{ width: '225px' }}>
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCreate}>OK</Button>
                    <Button onClick={()=>{setCreatorOpen(false)}}>Cancel</Button>
                </DialogActions>
            </Dialog>

        </React.Fragment>

    )

}
