import { RequestAction } from '@redux-requests/core';

export const FETCH_COUNTRY_TIMELINE = 'FETCH_COUNTRY_TIMELINE';

export const fetchCountryTimeline = (countryCode: string): RequestAction => ({
  type: FETCH_COUNTRY_TIMELINE,
  request: {
    url: `https://api.thevirustracker.com/free-api?countryTimeline=${countryCode}`
  },
  meta: {
    cache: 120, // Cache for two minutes.
  }
});