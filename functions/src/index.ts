import * as functions from 'firebase-functions';
import * as NearbyCities from 'cities';
import fetch from 'node-fetch';

exports.findCities = functions.https.onCall((data, context) => {
  const positions = data.positions;
  const cities = positions.map(p => NearbyCities.gps_lookup(p._lat, p._long));

  return {
    cities,
  };
});

exports.notifyVisit = functions.firestore
  .document('visits/{visit}')
  .onCreate((snap, context) => {
    const visit = snap.data();
    const webhookUrl =
      'https://maker.ifttt.com/trigger/visit_created/with/key/ozV7HJWweMSFh4aT9Irzm1TqzTHgJfmOosEY_TrWQzP';

    // fetch(webhookUrl);
  });
