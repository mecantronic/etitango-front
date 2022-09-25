import * as React from 'react';
import cronograma from '../cronograma.json';

import { Box, Button, Grid, Link, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';

const number = {
  fontSize: 24,
  fontFamily: "default",
  color: "secondary.main",
  fontWeight: "medium",
  paddingLeft: 2,
};

const ImgBackground = process.env.PUBLIC_URL + "/img/logo/eti_ventania.jpg";
function Cronograma() {
  return (
    <Box component="section" sx={{ display: "flex", overflow: "hidden" }}>
      <Grid container
        sx={{
          my: 5,
          me: 10,
          position: "relative",
        }}
        spacing={3}
        direction="column"
        align="center"
      >
        <Grid item><Typography variant="h4" marked="center" component="h2">
          Cronograma ETIano
        </Typography></Grid>
        <Grid item>
          <img src={ImgBackground} alt="logo" height="100%" width="100%" />
        </Grid>
        <Grid item>
          <Grid container spacing={3} mt={6} px={15}>
            <Typography variant="h4" marked="center" component="body">
              Salón: Bomberos voluntarios de Sierra de La ventana.
            <Link href={"https://www.google.com/maps/place/Bomberos+Voluntarios+de+Sierra+de+la+Ventana,+D+Meyer+S%2Fn,+Sierra+de+la+Ventana,+Buenos+Aires/@-38.1368324,-61.7942031,15z/data=!4m5!3m4!1s0x95eceeb55cdf8d9b:0x758f7d5143f4040f!8m2!3d-38.1368324!4d-61.7942031"}>
              <Typography variant="body" marked="center" component="body">
              (Ver en Mapa Aquí)
              </Typography>
            </Link>
              </Typography>
            {cronograma.dias.map((dia, index) => (
              <Grid item key={`cronograma_${index}`} xs={12} md={4}>
                <Paper sx={{ padding: "24px", height: "100%" }}>
                  <Box sx={number}>{dia.dia}</Box>
                  <List>
                    {dia.actividades.map((actividad) => (
                      <ListItem>
                        <ListItemText primary={actividad} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item>
          <Button
            color="secondary"
            size="large"
            variant="contained"
            component="a"
            href="/inscripcion/"
          >
            Inscripción
          </Button>
        </Grid>
      </Grid >
    </Box >
  );
}

export default Cronograma;
