import { Box, Typography } from '@mui/material';
import * as React from 'react';

const ImgBackground = process.env.PUBLIC_URL + "/img/h/login-background.jpg";

export default function Portada() {
    return (
        <React.Fragment>
            <Box sx={{
                backgroundImage: `url(${ImgBackground})`,
                backgroundColor: "#7fc7d9",
                backgroundPosition: "center",
                backgroundSize: "cover",
                height: "625px",
                paddingTop: "25px"
            }}>
                {/* Increase the network loading priority of the background image. */}
                <img
                    style={{ display: "none" }}
                    src={ImgBackground}
                    alt="increase priority"
                />
                <Typography color="white" align="center" variant="h3" >
                    ETI "Ventania" - 4, 5 y 6 de Noviembre - Sierra de la Ventana
                </Typography>
            </Box>
        </React.Fragment>
    );
}
