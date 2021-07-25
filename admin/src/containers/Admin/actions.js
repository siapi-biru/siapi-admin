/*
 *
 * Admin actions
 *
 */

import { GET_STRAPI_LATEST_RELEASE_SUCCEEDED, SET_APP_ERROR } from './constants';

export function getSiapiLatestReleaseSucceeded(latestSiapiReleaseTag, shouldUpdateSiapi) {
  return {
    type: GET_STRAPI_LATEST_RELEASE_SUCCEEDED,
    latestSiapiReleaseTag,
    shouldUpdateSiapi,
  };
}

export function setAppError() {
  return {
    type: SET_APP_ERROR,
  };
}
