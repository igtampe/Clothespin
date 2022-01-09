import { Button, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, IconButton } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import React, { useState } from "react";
import WearableCard from "./WearableCard";
import Cookies from 'universal-cookie';
import WearableEditor from "./WearableEditor";

const cookies = new Cookies();

export function SortSelect(props) {
    return (
        <FormControl fullWidth style={{marginTop:"15px"}}>
            <InputLabel fullWidth>Sort Order</InputLabel>
            <Select fullWidth label="Label" value={props.sortOrder} onChange={(event) => {
                props.setSortOrder(event.target.value)
                props.setCollection(undefined)
            }}>
                <MenuItem value={0}>Name</MenuItem>
                <MenuItem value={1}>Name (Desc)</MenuItem>
                <MenuItem value={2}>Type</MenuItem>
                <MenuItem value={3}>Type (Desc)</MenuItem>
            </Select></FormControl>
    )

}

export function SubSelect(props) {
    return (<FormControl fullWidth style={{marginTop:"15px"}}>
        <InputLabel fullWidth>Show</InputLabel>
        <Select fullWidth label="Label" value={props.subType} onChange={(event) => {
            props.setSubType(event.target.value)
            props.setCollection(undefined)
        }}>
            <MenuItem value={-1}>All Subtypes</MenuItem>
            {props.subTypes.map((element, index) => <MenuItem value={index}>{element.replace('_', ' ')}</MenuItem>)}
        </Select></FormControl>)
}

export function WashSelect(props) {
    return (<FormControl fullWidth style={{marginTop:"15px"}}>
        <InputLabel fullWidth>Wash State</InputLabel>
        <Select fullWidth label="Label" value={props.washState} onChange={(event) => {
            props.setWashState(event.target.value)
            props.setCollection(undefined)
        }}>
            <MenuItem value={-1}>Any</MenuItem>
            <MenuItem value={0}>Clean</MenuItem>
            <MenuItem value={1}>Semi-Clean</MenuItem>
            <MenuItem value={2}>Dirty</MenuItem>
            <MenuItem value={3}>Washing</MenuItem>
            {/**<MenuItem value={4}Drying</MenuItem>**/}
            <MenuItem value={5}>Washed</MenuItem>
        </Select></FormControl>
    )
}



export default function WearableDisplay(props) {

    const [sortOrder, setSortOrder] = useState(0);
    const [subType, setSubType] = useState(-1);
    const [washState, setWashState] = useState(-1);
    const [subTypes, setSubTypes] = useState(undefined);

    const [displayedItems, setDisplayedItems] = useState(0);
    const [noMas, setNoMas] = useState(false)
    const [gettingMas, setGettingMas] = useState(false)

    const [creatorOpen, setCreatorOpen] = useState(false)
    const [subLoading, setSubLoading] = useState(false);
    const [colLoading, setColLoading] = useState(false)

    if (subTypes === undefined && !subLoading) {

        setSubLoading(true)

        //Get the shirt subtypes
        fetch("/API/Clothes/Types/" + props.types)
            .then((response) => response.json())
            .then((data) => {
                setSubTypes(data)
                setSubLoading(false);
            })
    }

    if (props.collection === undefined && props.setCollection !== undefined && !colLoading) {

        //Time to get this collection
        setColLoading(true)

        ///API/Persons/Clothes/Shirts?PersonID=38a015f4-388e-4866-030c-08d9c23a261d&Sort=0&Query=a&Type=0&State=0
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'SessionID': cookies.get('SessionID') },
        };

        var url = "API/Persons/Clothes/" + props.types
            + "?PersonID=" + cookies.get("PersonID")
            + "&Sort=" + sortOrder
            + (props.query !== undefined && props.query !== "" ? "&Query=" + props.query : "")
            + (subType === -1 ? "" : "&Type=" + subType)
            + (washState === -1 ? "" : "&State=" + washState)

        fetch(url,
            requestOptions)
            .then(response => {
                if (!response.ok) {
                    console.error(response);
                    return undefined
                }
                return response.json()
            }).then(data => {
                if (data === undefined) { } else {
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

        var url = "API/Persons/Clothes/" + props.types
            + "?PersonID=" + cookies.get("PersonID")
            + "&Sort=" + sortOrder
            + (props.query !== undefined && props.query !== "" ? "&Query=" + props.query : "")
            + (subType === -1 ? "" : "&Type=" + subType)
            + (washState === -1 ? "" : "&State=" + washState)
            + "&Skip=" + displayedItems

        console.log(url)

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
                                {subTypes === undefined ? "" : <SubSelect subType={subType} setSubType={setSubType} subTypes={subTypes} setCollection={props.setCollection} />}
                                {props.washable ? <WashSelect washState={washState} setWashState={setWashState} setCollection={props.setCollection} /> : ""}
                                <Button onClick={()=> setCreatorOpen(true)} fullWidth variant="outlined" style={{marginTop:"15px"}}>Create new {props.type}</Button>
                            </Grid>
                        </>
                        : <>
                            <Grid item xs={3}>
                                <SortSelect sortOrder={sortOrder} setSortOrder={setSortOrder} setCollection={props.setCollection} />
                            </Grid>
                            <Grid item xs={4}>
                                {subTypes === undefined ? "" : <SubSelect subType={subType} setSubType={setSubType} subTypes={subTypes} setCollection={props.setCollection} />}
                            </Grid>
                            <Grid item xs={4}>
                                {props.washable ? <WashSelect washState={washState} setWashState={setWashState} setCollection={props.setCollection} /> : ""}
                            </Grid>
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
                                    No wearables of this type
                                </div>
                                : <>
                                    <br />
                                    <Grid container spacing={2} justifyContent={props.vertical ? "center" : "flex-start"}>
                                        {props.collection.map(p => (<Grid item> <WearableCard type={props.type} types={props.types} subtypes={subTypes} sizeable={props.sizeable} washable={props.washable} wearable={p} /> </Grid>))}
                                    </Grid>
                                    <div style={{ textAlign: "center", marginTop: "10px" }}>
                                        <Button hidden={noMas} disabled={gettingMas} color="primary" onClick={getMas}>{gettingMas ? <CircularProgress /> : "Load more"}</Button>
                                    </div>
                                </>
                        }</>
                }
            </div>

            <WearableEditor type={props.type} types={props.types} setWearables={props.setCollection}
                subtypes={subTypes} open={creatorOpen} setOpen={setCreatorOpen} sizeable={props.sizeable} />

        </React.Fragment>
    );

}
