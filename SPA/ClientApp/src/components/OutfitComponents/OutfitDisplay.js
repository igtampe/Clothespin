import { Button, CircularProgress, Grid, IconButton } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import React, { useState } from "react";
import OutfitCard from "./OutfitCard";
import Cookies from 'universal-cookie';
import OutfitCreator from "./OutfitCreator";
import {SortSelect} from "../WearableComponents/WearableDisplay"

const cookies = new Cookies();

export default function OutfitDisplay(props) {

    const [sortOrder, setSortOrder] = useState(0);

    const [displayedItems, setDisplayedItems] = useState(0);
    const [noMas, setNoMas] = useState(false)
    const [gettingMas, setGettingMas] = useState(false)

    const [creatorOpen, setCreatorOpen] = useState(false)
    const [colLoading, setColLoading] = useState(false)

    if (props.collection === undefined && props.setCollection !== undefined && !colLoading) {

        //Time to get this collection
        setColLoading(true)

        ///API/Persons/Clothes/Shirts?PersonID=38a015f4-388e-4866-030c-08d9c23a261d&Sort=0&Query=a&Type=0&State=0
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'SessionID': cookies.get('SessionID') },
        };

        var url = "API/Persons/Outfits"
            + "?PersonID=" + cookies.get("PersonID")
            + "&Sort=" + sortOrder
            + (props.query !== undefined && props.query !== "" ? "&Query=" + props.query : "")

        fetch(url,
            requestOptions)
            .then(response => {
                if (!response.ok) { 
                    console.error(response);
                    return undefined
                }
                return response.json()
            }).then(data => {
                if (data === undefined) { return; } else {
                    props.setCollection(data)
                    setDisplayedItems(20);
                    setNoMas(data.length !== 20)
                }
                setColLoading(false)
            })
    }

    const getMas = (event) => {
        setGettingMas(true)

        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'SessionID': cookies.get('SessionID') },
        };

        var url = "API/Persons/Outfits"
            + "?PersonID=" + cookies.get("PersonID")
            + "&Sort=" + sortOrder
            + (props.query !== undefined && props.query !== "" ? "&Query=" + props.query : "")
            + "&Skip=" + displayedItems


        fetch(url,
            requestOptions)
            .then(response => {
                setGettingMas(false)
                if (!response.ok) {
                    console.error(response);
                    return undefined
                }
                return response.json()
            }).then(data => {
                if (data === undefined) { } else {
                    props.setCollection(props.collection.concat(data))
                    setDisplayedItems(displayedItems + 20);
                    setNoMas(data.length !== displayedItems)
                }
            })
    }

    return (
        <React.Fragment>
            <Grid container spacing={2}>
                {
                    props.vertical
                        ? <>
                            <Grid item xs={12}>
                                <SortSelect sortOrder={sortOrder} setSortOrder={setSortOrder} setCollection={props.setCollection} />
                                <Button onClick={()=> setCreatorOpen(true)} fullWidth variant="outlined" style={{marginTop:"15px"}}>Create new Outfit</Button>
                            </Grid>
                        </>
                        : <>
                            <Grid item xs={3}>
                                <SortSelect sortOrder={sortOrder} setSortOrder={setSortOrder} setCollection={props.setCollection} />
                            </Grid>
                            <Grid item xs={4}> </Grid>
                            <Grid item xs={4}> </Grid>
                            <Grid item xs={1} style={{ textAlign: "right" }}>
                                <IconButton onClick={() => setCreatorOpen(true)}><Add /></IconButton>
                            </Grid>

                        </>
                }
            </Grid>
            <br />
            <div style={props.vertical ? {} : { height: '600px', overflowY: 'auto', overflowX: 'hidden' }}>
                {
                    props.collection === undefined
                        ? <div style={ props.vertical ? { textAlign: "center" } : { textAlign: "center", verticalAlign: "middle", lineHeight: "600px" }}>
                            <CircularProgress />
                        </div>
                        : <>{
                            props.collection.length === 0
                                ? <div style={ props.vertical ? { textAlign: "center" } : { textAlign: "center", verticalAlign: "middle", lineHeight: "600px" }}>
                                    You don't have any outfits
                                </div>
                                : <>
                                    <br />
                                    <Grid container spacing={2} justifyContent={props.vertical ? "center" : "flex-start"}>
                                        {props.collection.map(p => (<Grid item> <OutfitCard outfit={p} vertical={props.vertical}/> </Grid>))}
                                    </Grid>
                                    <div style={{ textAlign: "center", marginTop: "10px" }}>
                                        <Button hidden={noMas} disabled={gettingMas} color="primary" onClick={getMas}>{gettingMas ? <CircularProgress /> : "Load more"}</Button>
                                    </div>
                                </>
                        }</>
                }
            </div>

            <OutfitCreator setOutfits={props.setCollection} open={creatorOpen} setOpen={setCreatorOpen} vertical={props.vertical}/>

        </React.Fragment>
    );

}
