import { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getQuerySelector, QueryState } from '@redux-requests/core';
import { fetchGlobalStatistics, FETCH_GLOBAL_STATISTICS } from './State/globalStatistics';


const useGlobalStatistics = (): QueryState<GlobalStatistics | null> => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchGlobalStatistics());
  }, [dispatch]);

  const { data, loading, error, pristine } = useSelector(
    getQuerySelector<Response>({
      type: FETCH_GLOBAL_STATISTICS
    })
  );

  // Check whether the data has arrived. If it has simplify it. Otherwise just let it be null.
  const simplifiedData = useRef<GlobalStatistics | null>(null);
  simplifiedData.current = useMemo(() => {
    if (data) {
      const { results: [{
        total_new_deaths_today: deathsToday,
        total_new_cases_today: casesToday,
        total_serious_cases: seriousCases,
        total_unresolved: unresolved,
        total_recovered: recovered,
        total_deaths: deaths,
        total_active_cases: activeCases,
        total_cases: cases,
        total_affected_countries: affectedCountries
      }] } = data;
      return {
        activeCases,
        cases,
        deaths,
        recovered,
        seriousCases,
        unresolved,
        casesToday,
        deathsToday,
        affectedCountries
      };
    }
    return null;
  }, [data]);

  return {
    data: simplifiedData.current,
    loading,
    error,
    pristine
  };
};

interface GlobalStatistics {
  activeCases: number
  cases: number
  deaths: number
  recovered: number
  seriousCases: number
  unresolved: number
  casesToday: number
  deathsToday: number
  affectedCountries: number
}

type Response = 
    {
      results: [{
        total_active_cases: number
        total_affected_countries: number
        total_cases: number
        total_deaths: number
        total_new_cases_today: number
        total_new_deaths_today: number
        total_recovered: number
        total_serious_cases: number
        total_unresolved: number
      }]
    };

export default useGlobalStatistics;