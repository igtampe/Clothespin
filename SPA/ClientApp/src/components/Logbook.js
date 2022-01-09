import { Box, CircularProgress, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button, Grid } from "@material-ui/core";
import { Search, Add } from "@material-ui/icons";
import React, { useState } from "react";
import Cookies from "universal-cookie";
import OutfitMiniCard from "./OutfitComponents/OutfitMiniCard";
import useWindowDimensions from "./Hooks/useWindowDimensions";
import LogCreator from "./LogbookComponents/LogCreator";

const cookies = new Cookies();

export default function LogbookComponent() {

    const { width } = useWindowDimensions();

    const [query, setQuery] = useState("");
    const [logs, setLogs] = useState(undefined)
    const [loading, setLoading] = useState(false)
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")

    const [editorOpen, setEditorOpen] = useState(false);

    const [displayedItems, setDisplayedItems] = useState(0);
    const [noMas, setNoMas] = useState(false)

    const startSearch = (event) => { setLogs(undefined) }

    if (!logs && !loading) {
        setLoading(true)

        ///API/Persons/Clothes/Shirts?PersonID=38a015f4-388e-4866-030c-08d9c23a261d&Sort=0&Query=a&Type=0&State=0
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'SessionID': cookies.get('SessionID') },
        };

        var url = "API/Persons/Log"
            + "?PersonID=" + cookies.get("PersonID")
            + (query !== undefined && query !== "" ? "&Query=" + query : "")
            + (startDate !== "" ? "&StartDate=" + startDate : "")
            + (endDate !== "" ? "&EndDate=" + endDate : "")

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
                    setLogs(data)
                    setDisplayedItems(20);
                    setNoMas(data.length !== 20)
                }
                setLoading(false)
            })

    }

    const getMas = (event) => {

        if (noMas || loading) { return; }

        setLoading(true)
        ///API/Persons/Clothes/Shirts?PersonID=38a015f4-388e-4866-030c-08d9c23a261d&Sort=0&Query=a&Type=0&State=0
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'SessionID': cookies.get('SessionID') },
        };

        var url = "API/Persons/Log"
            + "?PersonID=" + cookies.get("PersonID")
            + (query !== undefined && query !== "" ? "&Query=" + query : "")
            + (startDate !== "" ? "&StartDate=" + startDate : "")
            + (endDate !== "" ? "&EndDate=" + endDate : "")

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
                    setLogs(logs.concat(data))
                    setDisplayedItems(displayedItems + 20);
                    setNoMas(data.length !== displayedItems)
                }
                setLoading(false)
            })

    }

    var Vertical = width < 900;

    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }} style={{ marginLeft: "25px", marginRight: "25px" }}>
                <TextField fullWidth label="Search" value={query} onChange={(event) => { setQuery(event.target.value) }} />
                <IconButton onClick={startSearch}><Search /></IconButton>
                <IconButton onClick={()=>setEditorOpen(true)}><Add /></IconButton>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-end' }} style={{ marginLeft: "25px", marginRight: "25px" }}>
                <Grid container style={{ marginTop: '15px' }} spacing={2}>
                    <Grid item xs={Vertical ? 12 : 6}>
                        <TextField label="Start" type="date" value={startDate} onChange={(event) => { 
                            setStartDate(event.target.value) 
                            startSearch();
                        }} InputLabelProps={{ shrink: true, }} fullWidth />
                    </Grid>
                    <Grid item xs={Vertical ? 12 : 6}>
                        <TextField label="End" type="date" value={endDate} onChange={(event) => { 
                            setEndDate(event.target.value) 
                            startSearch();
                        }} InputLabelProps={{ shrink: true, }} fullWidth />
                    </Grid>
                </Grid>
            </Box>

            <br />
            <TableContainer component={Paper}>
                <Table style={{ minWidth: '75%' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ maxWidth: '50px' }}>Date Logged</TableCell>
                            <TableCell style={{ maxWidth: '210px' }}>Outfit</TableCell>
                            <TableCell style={{ maxWidth: '100%' }}>Notes</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            !logs ?
                                <TableRow>
                                    <TableCell colSpan={3} style={{ textAlign: "center" }}><CircularProgress /></TableCell>
                                </TableRow> : <>{

                                    logs.length === 0 ?
                                        <TableRow>
                                            <TableCell colSpan={3} style={{ textAlign: "center" }}>No logs were found</TableCell>
                                        </TableRow> : <>{

                                            logs.map(L => {

                                                var D = new Date(L.date)

                                                return (
                                                    <TableRow>
                                                        <TableCell style={{ maxWidth: '50px' }}>{D.toDateString()}</TableCell>
                                                        <TableCell style={{ maxWidth: '210px' }}><OutfitMiniCard outfit={L.outfit} /></TableCell>
                                                        <TableCell style={{ maxWidth: '100%' }}>{L.note}</TableCell>
                                                    </TableRow>
                                                )
                                            }
                                            )
                                        }
                                        </>
                                }
                                </>
                        }
                    </TableBody>
                </Table>
            </TableContainer>

            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <Button hidden={noMas || loading} variant='contained' color='primary' onClick={getMas}> Get More </Button>
            </div>

            <LogCreator open={editorOpen} setOpen={setEditorOpen} vertical={Vertical} setLogs={setLogs} />

        </React.Fragment>
    );

}
