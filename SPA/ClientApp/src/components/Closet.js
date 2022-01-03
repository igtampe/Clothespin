import React, { useState } from "react";
import { Tab, Tabs, Typography, Box, TextField, Divider, Grid, IconButton } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search"
import WearableDisplay from "./WearableComponents/WearableDisplay";
import Cookies from 'universal-cookie';
import useWindowDimensions from "./Hooks/useWindowDimensions";

const cookies = new Cookies();

//Maybe this should've  been a default component? strange....
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} id={`vertical-tabpanel-${index}`} aria-labelledby={`vertical-tab-${index}`} {...other} style={{ width: "100%" }}>
            <Box sx={{ p: 3 }}> <Typography>{children}</Typography> </Box>
        </div>
    );
}

function ClosetTabs(props) {
    const IconWidth = "40px";

    return (
        <Tabs orientation={props.orientation} variant="scrollable" value={props.value} onChange={props.handleChange} sx={{ borderRight: 1, borderColor: 'divider' }}>
            <Tab icon={<img src="/images/clear/outfit.png" alt="Outfit" width={IconWidth} />} label={"Outfits (" + (props.Outfits === undefined ? "..." : props.Outfits.length) + ")"} />
            <Tab icon={<img src="/images/clear/shirt.png" alt="Shirt" width={IconWidth} />} label={"Shirts (" + (props.Shirts === undefined ? "..." : props.Shirts.length) + ")"} />
            <Tab icon={<img src="/images/clear/overshirt.png" alt="Overshirts" width={IconWidth} />} label={"Overshirts (" + (props.Overshirts === undefined ? "..." : props.Overshirts.length) + ")"} />
            <Tab icon={<img src="/images/clear/belt.png" alt="Belts" width={IconWidth} />} label={"Belts (" + (props.Belts === undefined ? "..." : props.Belts.length) + ")"} />
            <Tab icon={<img src="/images/clear/pants.png" alt="Pants" width={IconWidth} />} label={"Pants (" + (props.Pants === undefined ? "..." : props.Pants.length) + ")"} />
            <Tab icon={<img src="/images/clear/sock.png" alt="Socks" width={IconWidth} />} label={"Socks (" + (props.Socks === undefined ? "..." : props.Socks.length) + ")"} />
            <Tab icon={<img src="/images/clear/shoe.png" alt="Shoes" width={IconWidth} />} label={"Shoes (" + (props.Shoes === undefined ? "..." : props.Shoes.length) + ")"} />
            <Tab icon={<img src="/images/clear/Accessory.png" alt="Accesories" width={IconWidth} />} label={"Accessories (" + (props.Accessories === undefined ? "..." : props.Accessories.length) + ")"} />
        </Tabs>

    )

}

export default function ClosetComponent() {

    const { height, width } = useWindowDimensions();

    const [value, setValue] = React.useState(0);
    const [query, setQuery] = useState("")

    const [Outfits, setOutfits] = useState(undefined)

    const [Shirts, setShirts] = useState(undefined)
    const [Overshirts, setOvershirts] = useState(undefined)
    const [Belts, setBelts] = useState(undefined)
    const [Pants, setPants] = useState(undefined)
    const [Socks, setSocks] = useState(undefined)
    const [Shoes, setShoes] = useState(undefined)
    const [Accessories, setAccessories] = useState(undefined)

    const handleChange = (event, newValue) => { setValue(newValue); };
    const startSearch = (event) => {

        setOutfits(undefined)
        setShirts(undefined)
        setOvershirts(undefined)
        setBelts(undefined)
        setPants(undefined)
        setSocks(undefined)
        setShoes(undefined)
        setAccessories(undefined)
    }

    if (cookies.get("PersonID") === undefined) {
        return <React.Fragment>
            <div style={{ textAlign: "center", verticalAlign: "middle", lineHeight: "100%", Height: "100%" }}>
                Select a person to get started!
            </div>
        </React.Fragment>
    }

    var Vertical = width < 900;

    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }} style={{marginLeft:"25px", marginRight:"25px"}}>
                <TextField fullWidth label="Search" value={query} onChange={(event) => { setQuery(event.target.value) }} />
                <IconButton onClick={startSearch}><SearchIcon /></IconButton>
            </Box>
            <br />
            <Divider />
            {Vertical ? <ClosetTabs orientation="horizontal" value={value} handleChange={handleChange}
                Outfits={Outfits} Shirts={Shirts} Overshirts={Overshirts} Belts={Belts} Pants={Pants} Socks={Socks} Shoes={Shoes} Accessories={Accessories} /> : ""}
            <Box sx={{ bgcolor: 'background.paper', display: 'flex' }} >
                {/* This should've really been a map operation but oh well */}
                {!Vertical ? <ClosetTabs orientation="vertical" value={value} handleChange={handleChange}
                    Outfits={Outfits} Shirts={Shirts} Overshirts={Overshirts} Belts={Belts} Pants={Pants} Socks={Socks} Shoes={Shoes} Accessories={Accessories} /> : ""}

                <TabPanel value={value} index={0}>
                    <h1>Outfit Management Panel</h1>
                    Coming soon!
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <WearableDisplay query={query} types="Shirts" type="Shirt" collection={Shirts} setCollection={setShirts} sizeable washable vertical={Vertical}/>
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <WearableDisplay query={query} types="Overshirts" type="Overshirt" collection={Overshirts} setCollection={setOvershirts} sizeable washable vertical={Vertical}/>
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <WearableDisplay query={query} types="Belts" type="Belt" collection={Belts} setCollection={setBelts} sizeable vertical={Vertical}/>
                </TabPanel>
                <TabPanel value={value} index={4}>
                    <WearableDisplay query={query} types="Pants" type="Pants" collection={Pants} setCollection={setPants} sizeable washable vertical={Vertical}/>
                </TabPanel>
                <TabPanel value={value} index={5}>
                    <WearableDisplay query={query} types="Socks" type="Socks" collection={Socks} setCollection={setSocks} washable vertical={Vertical}/>
                </TabPanel>
                <TabPanel value={value} index={6}>
                    <WearableDisplay query={query} types="Shoes" type="Shoes" collection={Shoes} setCollection={setShoes} sizeable vertical={Vertical}/>
                </TabPanel>
                <TabPanel value={value} index={7}>
                    <WearableDisplay query={query} types="Accessories" type="Accessory" collection={Accessories} setCollection={setAccessories} vertical={Vertical}/>
                </TabPanel>
            </Box>

        </React.Fragment>
    );

}
