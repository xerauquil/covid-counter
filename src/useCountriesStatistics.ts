import { useEffect, useMemo, useRef } from 'react';
import { getQuerySelector, QueryState } from '@redux-requests/core';
import { useDispatch, useSelector } from 'react-redux';
import { FETCH_COUNTRIES_STATISTICS, fetchCountriesStatistics } from './State/countriesStatistics';

function useCountriesStatistics(
  countryCode: string
): QueryState<CountryStatisticsT | null>;
function useCountriesStatistics(): QueryState<CountriesStatisticsT | null>; 
function useCountriesStatistics(countryCode?: string)  {
  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCountriesStatistics());
  }, [dispatch]);

  const { data, loading, error, pristine } = useSelector(
    getQuerySelector<Response>({
      type: FETCH_COUNTRIES_STATISTICS,
    }),
  );


  const simplifiedData = useRef<CountriesStatisticsT | null>(null);

  simplifiedData.current = useMemo((): CountriesStatisticsT | null => {

    if (data) {

      const { countryitems: [countries] } = data;

      const tempData: CountriesStatisticsT = {};

      Object.values(countries)
        .forEach(({
          total_cases:            cases,
          total_active_cases:     activeCases,
          total_new_cases_today:  newCasesToday,
          total_new_deaths_today: newDeathsToday,
          total_unresolved:       unresolved,
          total_serious_cases:    seriousCases,
          total_recovered:        recovered,
          total_deaths:           deaths,
          code,
          title,
          ourid:                  id,
        }) => {
          // filter out values that aren't a country statistics object and also filter out countries with no cases at all
          if (cases > 0)
            tempData[code] = {
              id,
              title,
              deaths,
              cases,
              code,
              unresolved,
              seriousCases,
              recovered,
              newDeathsToday,
              newCasesToday,
              activeCases,
            };
        });

      return tempData;

    }

    return null;
  }, [data]);

  if (countryCode)
    return {
      data: simplifiedData.current?.[countryCode] || null,
      error,
      loading,
      pristine,
    };


  return {
    data: simplifiedData.current,
    error,
    loading,
    pristine,
  };
}


export type CountriesStatisticsT = {
  [code: string]: CountryStatisticsT
};

export interface CountryStatisticsT {
  id: number,
  title: string
  code: string
  cases: number
  activeCases: number
  deaths: number
  recovered: number
  unresolved: number
  seriousCases: number
  newCasesToday: number
  newDeathsToday: number
}

type Response = {
  countryitems: [{
    [index: number]: {
      ourid: number
      code: string
      title: string
      total_active_cases: number
      total_cases: number
      total_deaths: number
      total_new_cases_today: number
      total_new_deaths_today: number
      total_recovered: number
      total_serious_cases: number
      total_unresolved: number
    }
  }]
};

export default useCountriesStatistics;