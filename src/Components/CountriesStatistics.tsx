import React, { useMemo } from 'react';
import {
  Link as MuiLink,
  Fade,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel, Theme,
  Toolbar, Typography, TableContainer, Container,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import useCountriesStatistics, { CountriesStatisticsT } from '../useCountriesStatistics';
import { colors } from '../colors';
import useGlobalStatistics from '../useGlobalStatistics';


/*
* Most of this code was shamelessly stolen from Material-UI docs.
* Exactly where it was stolen from - Enhanced table.
*
* I am a thief, but a fair one.
* */

interface Column {
  key: keyof CountriesStatisticsT[number];
  label: string;
  numeric: boolean;
}

const useStyles = makeStyles<Theme>({
  table: {
    height: '100vh'
  },
  red: {
    // backgroundColor: '#F72C25',
    backgroundColor: colors.Deaths
  },
  yellow: {
    // backgroundColor: '#FFEB3B',
    backgroundColor: colors.Cases
  },
  green: {
    backgroundColor: colors.Recovered
  },
});

interface CountriesStatisticsProps {
  className?: string
}

const CountriesStatistics: React.FC<CountriesStatisticsProps> = (
  {
    className: divContainerClassName
  }
) => {
  const countriesStatistics = useCountriesStatistics();
  const globalStatistics = useGlobalStatistics();
  const classes = useStyles();
  const columns: Column[] = [
    { key: 'title', label: 'Title', numeric: false },
    { key: 'cases', label: 'Total Cases', numeric: true },
    { key: 'newCasesToday', label: 'New Cases Today', numeric: true },
    { key: 'deaths', label: 'Total Deaths', numeric: true },
    { key: 'newDeathsToday', label: 'New Deaths Today', numeric: true },
    { key: 'recovered', label: 'Total Recovered', numeric: true },
    { key: 'activeCases', label: 'Active Cases', numeric: true },
    { key: 'seriousCases', label: 'Serious Cases', numeric: true },
  ];
  const [order, setOrder] = React.useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = React.useState<string>(
    columns[0].key,
  );
  const handleRequestSort = (property: string,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const loading = countriesStatistics.loading && globalStatistics.loading;
  const countryPath = '/country/';


  return (
    <Fade in={!loading && !!countriesStatistics.data}>
      <Container className={divContainerClassName}>
        <Paper>
          <Toolbar>
            <Typography variant='h4'>
              Affected Countries' Statistics
            </Typography>
          </Toolbar>
          <TableContainer className={classes.table}>
            <Table stickyHeader>
              <EnhancedTableHead
                headCellsLabels={columns}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                <TableRow selected />
                {
                  // added useMemo for optimisation since sorting this many items can take a bit of time.
                  useMemo(() =>
                    stableSort(
                      // if countriesStatistics.data hasn't arrived yet - leave table empty. It won't be visible during load time so it doesn't matter.
                      Object.values(countriesStatistics.data ?? {}),
                      getComparator(order, orderBy)
                    )
                      .map((country) =>

                        <TableRow
                          hover
                          key={country.id}
                        >
                          <TableCell align='left'>
                            <MuiLink component={Link} to={`${countryPath}${country.code}`} color="secondary">
                              {country.title}
                            </MuiLink>
                          </TableCell>

                          <TableCell align='right'>
                            {country.cases}
                          </TableCell>

                          <TableCell align='right' className={country.newCasesToday > 0 ? classes.yellow : undefined}>
                            {country.newCasesToday}
                          </TableCell>

                          <TableCell align='right'>
                            {country.deaths}
                          </TableCell>

                          <TableCell align='right' className={country.newDeathsToday > 0 ? classes.red : undefined}>
                            {country.newDeathsToday}
                          </TableCell>

                          <TableCell align='right' className={country.recovered > 0 ? classes.green : undefined}>
                            {country.recovered}
                          </TableCell>

                          <TableCell align='right'>
                            {country.activeCases}
                          </TableCell>

                          <TableCell align='right'>
                            {country.seriousCases}
                          </TableCell>
                        </TableRow>
                      ), 
                  // eslint wants me to to put the colors object's properties as deps. They're meant to be
                  // eslint-disable-next-line react-hooks/exhaustive-deps
                  [order, orderBy, countriesStatistics.data])
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Fade>
  );

};


interface TableHeadProps {
  headCellsLabels: Column[]
  order: 'asc' | 'desc'
  orderBy: string
  onRequestSort: (id: string) => void
}


function EnhancedTableHead(props: TableHeadProps) {
  const { headCellsLabels, order, orderBy, onRequestSort } = props;

  return (
    <TableHead>
      <TableRow>
        {headCellsLabels.map((headCellData) => (
          <TableCell
            align={headCellData.numeric ? 'right' : 'left'}
            key={headCellData.key}
            sortDirection={orderBy === headCellData.key ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCellData.key}
              direction={orderBy === headCellData.key ? order : 'asc'}
              onClick={() => onRequestSort(headCellData.key)}
            >
              {headCellData.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}


function descendingComparator<T extends object>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<T extends object>(
  order: 'asc' | 'desc',
  orderBy: keyof T,
) {
  return order === 'desc'
    ? (a: T, b: T) => descendingComparator(a, b, orderBy)
    : (a: T, b: T) => -descendingComparator(a, b, orderBy);
}


function stableSort<T extends object>(
  array: T[],
  comparator: ReturnType<typeof getComparator>,
) {
  const stabilizedThis = array.map((el, index) => ({ el, index }));
  stabilizedThis.sort((a, b) => {
    const order = comparator(a.el, b.el);
    if (order !== 0) return order;
    return a.index - b.index;
  });
  return stabilizedThis.map((el) => el.el);
}

export default CountriesStatistics;
