import { RequestAction } from '@redux-requests/core';

export const FETCH_COUNTRIES_STATISTICS = 'FETCH_COUNTRIES_STATISTICS';

export const fetchCountriesStatistics = (): RequestAction => ({
  type: FETCH_COUNTRIES_STATISTICS,
  request: {
    url: 'https://api.thevirustracker.com/free-api?countryTotals=ALL'
  }
  ,
  meta: {
    cache: 120, // Cache for two minutes
  }
});


