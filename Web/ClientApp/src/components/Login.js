import React from "react";
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography";
import LoginForm from './LoginSubcomponents/LoginForm'

export default function LoginComponent() {
    return (
        <React.Fragment>
            <Typography>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    style={{ minHeight: '50vh' }}
                >
                    <Grid item xs={10}>
                        <LoginForm/>
                    </Grid>
                </Grid>
            </Typography>
        </React.Fragment>
    );

}
