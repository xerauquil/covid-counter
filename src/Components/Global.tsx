import React from 'react';
import { Grid, Fade, Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TitledCounter from '../vComponents/TitledCounter';
import useGlobalStatistics from '../useGlobalStatistics';
import { colors } from '../colors';

const useStyles = makeStyles({
  title: {
    fontWeight: 700,
  }
});


const Global: React.FC = () => {

  const classes = useStyles();


  // TODO do something when an error occurs. 'error' is left intentionally.
  const { data, loading, error } = useGlobalStatistics();

  const isThereActualData = (!loading && !!data);
  const {
    cases,
    deaths,
    recovered,
    seriousCases
  } = data ?? {};

  return (
    <Fade in={isThereActualData}>
      <Container maxWidth="lg">
        <Grid container spacing={10}>
          <Grid item xs={12}>
            <Typography className={classes.title} align='center' variant="h1">
              Global Statistics:
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TitledCounter color={colors.Cases} value={cases || 0} title="Cases" />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TitledCounter color={colors.Recovered} value={recovered || 0} title="Recovered" />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TitledCounter color={colors.SeriousCases} value={seriousCases || 0} title="Serious Cases" />
          </Grid>
          <Grid item xs={12}>
            <TitledCounter color={colors.Deaths} value={deaths || 0} title="Deaths" />
          </Grid>
        </Grid>
      </Container>
    </Fade>
  );
};


export default Global;

