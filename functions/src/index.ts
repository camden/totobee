import * as functions from 'firebase-functions';

exports.findCities = functions.https.onCall((data, context) => {
  const positions = data.positions;

  return {
    cities: [],
  };
});
