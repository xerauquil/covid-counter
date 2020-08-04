import { applyMiddleware, combineReducers, createStore } from 'redux';
import { HandleRequestConfig, handleRequests } from '@redux-requests/core';
import { createDriver } from '@redux-requests/axios';
import axios from 'axios';

interface IRequestAction {
  request: {
    url: string
  }
}

// handle current API warnings. They're sent as html in the response body along with the JSON
const onSuccess: HandleRequestConfig['onSuccess'] = (response: {data: unknown}, RequestAction) => {
  const { request: { url } } = RequestAction as IRequestAction;
  const urlObj = new URL(url);
  // console.log(response);

  if (urlObj.host === 'api.thevirustracker.com') {
    const { data } = response;
    // if data is a string that most likely means that there is HTML in the response body and it couldn't be parsed properly
    // so just remove the html and reParse the JSON and hopefully the html isn't too complex for the Regex to work.
    if (typeof data === 'string') {
      const strippedStr = (data as string).replace(
        /<.+/ig,
        ''
      );
      console.warn('The API is throwing weird warnings again... Spam @thevirustracker\'s twitter to fix it. (P.S. They will know what you\'re talking about)');
      return {
        ...response,
        data: JSON.parse(strippedStr)
      };
    }
  }
  return response;
};


const configureStore = () => {
  const { requestsReducer, requestsMiddleware } = handleRequests({
    driver: createDriver(axios),
    onSuccess
  });

  const reducers = combineReducers({
    requests: requestsReducer
  });

  return createStore(
    reducers,
    applyMiddleware(...requestsMiddleware)
  );
};





export default configureStore();



