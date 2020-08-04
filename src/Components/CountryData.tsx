import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, Fade, Grid, Paper, Typography } from '@material-ui/core';
import { Bar, LinearComponentProps } from 'react-chartjs-2';
import useCountryTimeline from '../useCountryTimeline';
import useCountriesStatistics from '../useCountriesStatistics';
import { colors } from '../colors';
import TitledCounter from '../vComponents/TitledCounter';

interface ISeparatedEntries {
  dates: string[],
  totalCasesPerDay: number[],
  newCasesPerDay: number[],
  totalDeathsPerDay: number[],
  newDeathsPerDay: number[],
  totalRecoveriesPerDay: number[]
}

const CountryData: React.FC = () => {
  const { code } = useParams();

  
  
  const countryTimeline = useCountryTimeline(code);
  const countryStatistics = useCountriesStatistics(code);
  

  const loading = countryStatistics.loading || countryTimeline;

  // check whether the data has arrived if it hasn't let "timeline" = undefined
  const { timeline } = countryTimeline.data ?? {};

  // do the same thing but with the statistics
  const {
    title = '',
    cases: totalCases = 0,
    deaths: totalDeaths = 0,
    recovered: totalRecovered = 0,
  } = countryStatistics.data ?? {};
  
  const separatedEntries: ISeparatedEntries = useMemo(() => {
    const tempObj: ISeparatedEntries = {
      dates:                 [],
      totalCasesPerDay:      [],
      newCasesPerDay:        [],
      totalDeathsPerDay:     [],
      newDeathsPerDay:       [],
      totalRecoveriesPerDay: []
    };

    if (timeline) {
      Object.entries(timeline)
        .forEach(([date,
          {
            deaths,
            cases,
            casesToday,
            deathsToday,
            recoveries
          }], index) => {
          tempObj.dates[index] = date;
          tempObj.totalCasesPerDay[index] = cases;
          tempObj.newCasesPerDay[index] = casesToday;
          tempObj.totalDeathsPerDay[index] = deaths;
          tempObj.newDeathsPerDay[index] = deathsToday;
          tempObj.totalRecoveriesPerDay[index] = recoveries;
        });
    }

    return tempObj;
  },
  [timeline]);
  
  return (
    <Fade in={!loading && !!countryStatistics.data && !!countryTimeline.data}>
      <Container maxWidth='lg'>
        <Typography align='center' variant='h2' component='h1'>
          {title} Covid-19 statistics
        </Typography>
        <Grid container justify='center'>
          <Grid xs={12} item>
            <TitledCounter color={colors.Cases} value={totalCases} title='Total Cases' />
          </Grid>
          <Grid xs={12} item>
            <TitledCounter color={colors.Deaths} value={totalDeaths} title='Deaths' />
          </Grid>
          <Grid xs={12} item>
            <TitledCounter color={colors.Recovered} value={totalRecovered} title='Recovered' />
          </Grid>
        </Grid>
        <Paper>
          <PreconfiguredTitledGraph
            data={{
              datasets: [
                {
                  label: 'Total Deaths',
                  data: separatedEntries.totalDeathsPerDay,
                  backgroundColor: `${colors.Deaths}CC`,
                  hoverBackgroundColor: colors.Deaths,
                },
                {
                  label: 'Total Cases',
                  data: separatedEntries.totalCasesPerDay,
                  backgroundColor: `${colors.Cases}CC`,
                  hoverBackgroundColor: colors.Cases,
                }
              ],
              labels: separatedEntries.dates
            }}
            title='Total cases to death ratio.'
          />
          <PreconfiguredTitledGraph 
            title='New Cases Per Day' 
            data={{
              datasets: [
                {
                  label: 'Daily Cases',
                  data: separatedEntries.newCasesPerDay,
                  backgroundColor: '#000000CC',
                  hoverBackgroundColor: colors.Cases
                },
              ],
              labels: separatedEntries.dates
            }}
          />
          <PreconfiguredTitledGraph
            title='New Deaths Per Day'
            data={{
              datasets: [
                {
                  label: 'Daily Deaths',
                  data: separatedEntries.newDeathsPerDay,
                  backgroundColor: '#000000CC',
                  hoverBackgroundColor: colors.Deaths,
                },
              ],
              labels: separatedEntries.dates
            }}
          />
        </Paper>
      </Container>
    </Fade>
  );
};

function formatZeroesToKorM(value: number) {
  if (value < 1000) return value;
  return (value < 1000000) ? `${value/1000}K` : `${value/1000000}M`;
}

type PreconfiguredGraphProps = 
  LinearComponentProps & {
    title: string
  };

function PreconfiguredTitledGraph({ data, title }: PreconfiguredGraphProps) {
  return (
    <>
      <Box marginLeft={10} marginTop={20}>
        <Typography variant='h2'>
          {title}
        </Typography>
      </Box>
      <Bar
        data={data}
        options={{
          tooltips: {
            mode: 'index',
            intersect: 'false'
          },
          scales: {
            xAxes: [{
              gridLines: {
                display: false
              },
              scaleLabel: {
                display: true,
              },
              stacked: true,
              ticks: {
                maxTicksLimit: 10
              }
            }],
            yAxes: [{
              ticks: {
                min: 0,
                maxTicksLimit: 7,
                stepSize: 2.5,
                callback: formatZeroesToKorM
              }
            }]
          }
        }}
      />
    </>
  );
}
export default CountryData;