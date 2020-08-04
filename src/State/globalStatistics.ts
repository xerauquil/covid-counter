import { RequestAction } from '@redux-requests/core';

export const FETCH_GLOBAL_STATISTICS = 'FETCH_GLOBAL_STATISTICS';

export const fetchGlobalStatistics = (): RequestAction => ({
  type: FETCH_GLOBAL_STATISTICS,
  request: {
    url: 'https://api.thevirustracker.com/free-api?global=stats'
  }
  ,
  meta: {
    cache: 120 // Cache for two minutes
  }
});