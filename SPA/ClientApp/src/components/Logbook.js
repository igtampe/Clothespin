import { Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import React, { useState } from "react";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export default function LogbookComponent() {

    const[query,setQuery] = useState("");
    const[logs, setLogs] = useState(undefined)
    const[loading, setLoading] = useState(false)

    const[displayedItems, setDisplayedItems]= useState(0);
    const[noMas, setNoMas] = useState(false)

    const startSearch = (event) => { setLogs(undefined) }

    if(!logs && !loading){
        setLoading(true)

        ///API/Persons/Clothes/Shirts?PersonID=38a015f4-388e-4866-030c-08d9c23a261d&Sort=0&Query=a&Type=0&State=0
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'SessionID': cookies.get('SessionID') },
        };

        console.log(requestOptions.headers);
        var url = "API/Persons/Log"
            + "?PersonID=" + cookies.get("PersonID")
            + (query !== undefined && query !== "" ? "&Query=" + query : "")
        console.log(url)

        fetch(url,
            requestOptions)
            .then(response => {
                if (!response.ok) { 
                    console.error(response);
                    return undefined
                }
                return response.json()
            }).then(data => {
                console.log(data)
                if (data === undefined) { return; } else {
                    setLogs(data)
                    setDisplayedItems(20);
                    setNoMas(data.length !== 20)
                    console.log(data)
                }
                setLoading(false)
            })

    }

    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }} style={{marginLeft:"25px", marginRight:"25px"}}>
                <TextField fullWidth label="Search" value={query} onChange={(event) => { setQuery(event.target.value) }} />
                <IconButton onClick={startSearch}><Search /></IconButton>
            </Box>            
            <br />
            <TableContainer component={Paper}>
                <Table style={{minWidth:'75%'}}>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{maxWidth:'25px'}}>Date Logged</TableCell>
                            <TableCell style={{maxWidth:'50px'}}>Outfit</TableCell>
                            <TableCell>Notes</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>Today</TableCell>
                            <TableCell>The Outfit (add a button to edit this thing. Clear on OK)</TableCell>
                            <TableCell>Notes </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </React.Fragment>
    );

}
