import { Button, CircularProgress, Grid, IconButton, TextField } from "@material-ui/core";
import React, { useState } from "react";
import Cookies from 'universal-cookie';
import { SortSelect, SubSelect, WashSelect } from "./WearableDisplay";
import SearchIcon from "@material-ui/icons/Search"

const cookies = new Cookies();

export default function WearablePicker(props) {

    const [query, setQuery] = useState("");
    const [sortOrder, setSortOrder] = useState(0);
    const [subType, setSubType] = useState(-1);
    const [washState, setWashState] = useState(-1); 
    const [subTypes, setSubTypes] = useState(undefined);

    const [displayedItems, setDisplayedItems] = useState(0);
    const [noMas, setNoMas] = useState(false)
    const [gettingMas, setGettingMas] = useState(false)

    const [subLoading, setSubLoading] = useState(false);
    const [colLoading, setColLoading] = useState(false)

    const [collection, setCollection] = useState(undefined)

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

    if (collection === undefined && setCollection !== undefined && !colLoading) {

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
            + "&Query=" + query
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
                    setCollection(data)
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
            + (query !== undefined && query !== "" ? "&Query=" + query : "")
            + (subType === -1 ? "" : "&Type=" + subType)
            + (washState === -1 ? "" : "&State=" + washState)
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
                    setCollection(collection.concat(data))
                    setDisplayedItems(displayedItems + 20);
                    setNoMas(data.length !== displayedItems)
                }
            })
    }

    const handleSelect = (wearable, wasSelected) => (event) => {

        if(!props.isCollection){
            if(wasSelected) {props.setSelected(undefined)} 
            else {props.setSelected(wearable)}
            
            if(props.advanceAccordion && !wasSelected){props.advanceAccordion()}
        } else {

            var selected = [...props.selected]

            if(wasSelected) {selected.splice(selected.indexOf(wearable.id),1)} 
            else { selected.push(wearable.id)}
            props.setSelected(selected) //Refresh
        }
        
    }

    return (
        <React.Fragment>
            <Grid container spacing={2}>
                <Grid item xs={11}>

                    <TextField label="Search" value={query} onChange={(event) => setQuery(event.target.value)} fullWidth
                        style={{ marginTop: "5px", marginBottom: "5px" }} />

                </Grid>
                <Grid item xs={1}>
                    <IconButton onClick={() => setCollection(undefined)}><SearchIcon /></IconButton>
                </Grid>
                {
                    props.vertical
                        ? <>
                            <Grid item xs={12}>
                                <SortSelect sortOrder={sortOrder} setSortOrder={setSortOrder} setCollection={setCollection} />
                                {subTypes === undefined ? "" : <SubSelect subType={subType} setSubType={setSubType} subTypes={subTypes} setCollection={setCollection} />}
                                {props.washable ? <WashSelect washState={washState} setWashState={setWashState} setCollection={setCollection} /> : ""}
                            </Grid>
                        </>
                        : <>
                            <Grid item xs={4}>
                                <SortSelect sortOrder={sortOrder} setSortOrder={setSortOrder} setCollection={setCollection} />
                            </Grid>
                            <Grid item xs={4}>
                                {subTypes === undefined ? "" : <SubSelect subType={subType} setSubType={setSubType} subTypes={subTypes} setCollection={setCollection} />}
                            </Grid>
                            <Grid item xs={4}>
                                {props.washable ? <WashSelect washState={washState} setWashState={setWashState} setCollection={setCollection} /> : ""}
                            </Grid>

                        </>
                }
                <Grid item xs={12}>
                    <div>
                        {
                            collection === undefined
                                ? <div style={{ textAlign: "center" }}> <CircularProgress /></div>
                                : <>{
                                    collection.length === 0
                                        ? <div style={{ textAlign: "center" }}> No wearables of this type </div>
                                        : <>
                                            <br />
                                            <Grid container spacing={2}>
                                                {collection.map(Wearable => {
                                                    
                                                    var isSelected = false
                                                    if(props.selected !== undefined){
                                                        if(!props.isCollection){ isSelected=(props.selected.id===Wearable.id) }
                                                        else { isSelected = props.selected.includes(Wearable.id)}
                                                    }

                                                    return(<>
                                                    <Grid item xs>
                                                    <Button style={isSelected ? {backgroundColor:'#e0ffc7'} : {}} 
                                                    variant={ isSelected ? 'contained' : 'outlined'} onClick={handleSelect(Wearable,isSelected)}>
                                                        <table style={{minHeight:"100px", minWidth:"250px", maxWidth:"250px"}}>
                                                            <tr>
                                                                <td style={{ minWidth: "80x", maxWidth:"80px" }}>
                                                                    <img style={{ margin: "5px" }} src={Wearable === undefined ? "/images/" + props.type + ".png" :
                                                                    Wearable.imageURL === "" || Wearable.imageURL === undefined ? "/images/" + props.type + ".png" : Wearable.imageURL } 
                                                                    alt={props.type} width="75px" />
                                                                </td>
                                                                <td style={{ minWidth: "170x", maxWidth:"170px" }}>
                                                                    <div style={{ margin: "5px", textAlign: "left", lineHeight: "1.1em" }}>
                                                                        <b>{Wearable === undefined ? props.type : Wearable.name}</b><br />
                                                                        <i>{Wearable === undefined || subTypes === undefined ? "Unknown" : subTypes[Wearable.type].replace("_", " ")}</i>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </Button>
                                                    </Grid>
                                                </>)})}
                                            </Grid>
                                            <div style={{ textAlign: "center", marginTop: "10px" }}>
                                                <Button hidden={noMas} disabled={gettingMas} color="primary" onClick={getMas}>{gettingMas ? <CircularProgress /> : "Load more"}</Button>
                                            </div>
                                        </>
                                }</>
                        }
                    </div>
                </Grid>
            </Grid>
        </React.Fragment>
    );

}
