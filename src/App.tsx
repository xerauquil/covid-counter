import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import theme from './theme';
import Global from './Components/Global';
import CountriesStatistics from './Components/CountriesStatistics';
import CountryData from './Components/CountryData';

const useStyles = makeStyles({
  main: {
    overflowX: 'hidden',
  },
  countriesStatistics: {
    marginTop: '4rem'
  },
});

function App() {
  const { main: mainClassname, countriesStatistics } = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main className={mainClassname}>
        <Router basename={process.env.PUBLIC_URL}>
          <Switch>
            <Route path='/' exact>
              <Global />
              <CountriesStatistics className={countriesStatistics} />
            </Route>
            <Route path='/country/:code'>
              <CountryData />
            </Route>
          </Switch>
        </Router>
      </main>
    </ThemeProvider>
  );
}

export default App;
