import * as functions from 'firebase-functions';
import * as NearbyCities from 'cities';

exports.findCities = functions.https.onCall((data, context) => {
  const positions = data.positions;
  const cities = positions.map(p => NearbyCities.gps_lookup(p._lat, p._long));

  return {
    cities,
  };
});
