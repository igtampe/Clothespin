import { Snackbar } from "@material-ui/core";
import React from "react";
import { Alert } from "reactstrap";

export default function AlertSnackbar(props) {

    const handleClose = (event) =>{ props.setOpen(false) }

    return(
        <Snackbar open={props.open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} color={props.result ? props.result.severity : 'success'} sx={{ width: '100%' }}>
                {props.result ? props.result.text : 'something happened!'}
            </Alert>
        </Snackbar>
    )
    
}