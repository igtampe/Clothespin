import React, { useState } from "react";
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
  CircularProgress, Grid
} from "@material-ui/core";
import PersonCard from "./PersonCard"
import Cookies from 'universal-cookie';
import PersonCreator from "./PersonCreator";

//import LogoutButton from "./LogoutButton";
//import PasswordChangeButton from "./PasswordChangeButton";

//<PasswordChangeButton/>
//<LogoutButton />

const cookies = new Cookies();

export default function PersonPicker(props) {

  const [Persons, setPersons] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [CreatorOpen, setCretorOpen] = useState(false);

  if (props.open && Persons === undefined && loading === false) {
    setLoading(true)

    //Lets get some people
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'SessionID': cookies.get('SessionID') },
    };


    fetch("API/Persons", requestOptions)
      .then(response => {
        if (!response.ok) {
          console.error(response);
          return undefined
        }
        return response.json()
      }).then(data => {
        if (data === undefined) { } else {
          setPersons(data)
          setLoading(false)
        }
      })

  }

  return (
    <React.Fragment>
      <Dialog fullWidth maxWidth="sm" open={props.open} onClose={() => props.setOpen(false)}>
        <DialogTitle style={{ textAlign: "center" }}>Pick a person</DialogTitle>
        <DialogContent>
          {
            Persons === undefined ? <div style={{ textAlign: "center" }}><CircularProgress /></div> :
              <Grid container spacing={2} alignItems="center" justifyContent="center">

                {Persons.map(P => (<Grid item> <PersonCard person={P} /> </Grid>))}

                <Grid item>
                  <PersonCard onClick={() => setCretorOpen(true)} />
                </Grid>

              </Grid>
          }
        </DialogContent>
        <DialogActions />
      </Dialog>
      <PersonCreator open={CreatorOpen} setOpen={setCretorOpen} setPersons={setPersons} />

    </React.Fragment>
  );

}
