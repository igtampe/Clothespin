import React, { useState } from "react";
import { Button } from "@material-ui/core";
import OutfitEditor from "./OutfitEditor";

export default function OutfitMiniCard(props) {

    const [Outfit, setOutfit] = useState(props.outfit)
    const [editorOpen, setEditorOpen] = useState(false);
    const [totalOutfitItems,setTotalOutfitItems] = useState(-1)

    if(totalOutfitItems===-1 && Outfit){
        setTotalOutfitItems(0);
        var T = 0;

        if(Outfit.shirt) {T++}
        if(Outfit.belt) {T++}
        if(Outfit.pants) {T++}
        if(Outfit.socks) {T++}
        if(Outfit.shoes) {T++}
        if(Outfit.overshirts) {T+=Outfit.overshirts.length}
        if(Outfit.accessories) {T+=Outfit.accessories.length}
        
        setTotalOutfitItems(T);
    }

    return (
        <React.Fragment>
            <Button disabled={!Outfit} onClick={props.onClick ? props.onClick : () => setEditorOpen(true)} 
            style={{ ...props.style, textTransform: "none", textAlign:'left', lineHeight:'1.2em' , minWidth:'200px', maxWidth:'200px'}} 
            variant={props.variant ?? 'outlined'} color={props.color ?? ''}>

            <table style={{minWidth:'100%'}}>
                <tr>
                    <td rowSpan={2} style={{minWidth:'50px', maxWidth:'50px'}}> 
                        <img src={Outfit && (!Outfit.imageURL || Outfit.imageURL === "") ? '/images/Outfit.png' : Outfit.imageURL} alt='Outfit' height='40px' style={{ marginRight: '10px' }} />
                    </td>
                    <td> 
                        <b>{Outfit === undefined ? "Outfit" : Outfit.name}</b> <br/>
                        <i> {totalOutfitItems} Item(s)</i>
                    </td>
                </tr>
            </table>
            </Button>

            <OutfitEditor outfit={Outfit} setOutfit={setOutfit} open={editorOpen} setOpen={setEditorOpen} sizeable={props.sizeable} vertical={props.vertical} />

        </React.Fragment>
    );

}
