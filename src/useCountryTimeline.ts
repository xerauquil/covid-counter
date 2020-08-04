import { useEffect, useMemo, useRef } from 'react';
import { getQuerySelector } from '@redux-requests/core';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCountryTimeline, FETCH_COUNTRY_TIMELINE } from './State/countryTimeline';


const useCountryTimeline = (countryCode: string) => {
  const dispatch = useDispatch();


  // Dispatch FETCH_COUNTRY_TIMELINE action so redux-requests catches it.
  useEffect( () => {
    dispatch(fetchCountryTimeline(countryCode));
  },
  [dispatch, countryCode]);

  // get the fetching data and status from redux-requests
  const { data, loading, error, pristine } = useSelector(
    getQuerySelector<Response>({
      type: FETCH_COUNTRY_TIMELINE
    })
  );
  // if there is data, map it into a simpler object otherwise let it be null
  const simplifiedData = useRef<CountryAndTimeline | null>(null);
  simplifiedData.current = useMemo(() => {
    if (data) {

      const {
        countrytimelinedata: [{
          info: {
            code,
            title
          }
        }],
        timelineitems: [timelineItems]
      } = data;

      // create an empty timeline object then fill it up with the API response's data.
      const timeline: Timeline = {};
      Object.entries(timelineItems).forEach( (
        [
          date,
          {
            total_cases: cases,
            total_deaths: deaths,
            new_daily_cases: casesToday,
            new_daily_deaths: deathsToday,
            total_recoveries: recoveries,
          }
        ]
      ) => {
        // if this particular country has > 0 cases return it.
        if (cases)
          timeline[date] = {
            deathsToday,
            cases,
            casesToday,
            deaths,
            recoveries
          };
      });

      // set the simplified data to a CountryAndTimeline
      return {
        timeline,
        countryInfo: {
          code,
          title
        }
      };
    }
    return null;
  }, [data]);
  
  
  return { data: simplifiedData.current, loading, pristine, error };
};

interface CountryAndTimeline {
  countryInfo: {
    code: string,
    title: string
  },
  timeline: Timeline
} 

interface Timeline {
  [date: string]: TimelineEntry
}

interface TimelineEntry {
  casesToday: number
  deathsToday: number
  cases: number
  deaths: number
  recoveries: number
}

interface Response {
  countrytimelinedata: [{
    info: {
      code: string,
      title: string
    }
  }];

  timelineitems: [{
    [date: string]: {
      new_daily_cases: number
      new_daily_deaths: number
      total_cases: number
      total_deaths: number
      total_recoveries: number
    }
  }];
}


export default useCountryTimeline;