import { Button, Container } from "@material-ui/core";
import React from "react";
import useWindowDimensions from "./Hooks/useWindowDimensions";
import { useHistory } from "react-router-dom";

export default function HomeComponent() {

  const { width } = useWindowDimensions();

  const history = useHistory();

  var Vertical = width < 900;

  const sendToLogin = (event) => { history.push("/Login") }

  return (
    <React.Fragment>
      <Container style={{ background: "#e0e0e0", padding: "50px", verticalAlign: "middle" }}>
        {!Vertical ? <img src="/homeimage.png" width="100%" style={{ marginBottom: "20px" }} alt="Clothespin"/> : ""}
        <div style={{ fontFamily: 'DM Serif Display' }}><h1><b>Welcome to Clothespin</b></h1></div>
        <p> Clothespin is a comprehensive system to help you track how much you use your clothes. Simply register your closet,
          your most common outfits, and with a bit of daily logging and some time, gain insights into your clothing usage.</p>
        <div style={{ textAlign: "right", marginTop: "0px" }}><Button onClick={sendToLogin} variant="contained" color="primary">Get Started</Button></div>
      </Container>
    </React.Fragment>
  );

}
