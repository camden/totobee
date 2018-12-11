import firebase from 'firebase/app';
import * as firestore from 'firebase/firestore';
import * as storage from 'firebase/storage';

const config = {
  apiKey: 'AIzaSyDm6hxhhOJHyAamJf-Lc8n7QFIIBs9NCMg',
  authDomain: 'wheres-the-thing.firebaseapp.com',
  databaseURL: 'https://wheres-the-thing.firebaseio.com',
  projectId: 'wheres-the-thing',
  storageBucket: 'wheres-the-thing.appspot.com',
  messagingSenderId: '357698160052',
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export const Firestore = firebase.firestore();

Firestore.settings({
  timestampsInSnapshots: true,
});

export const Storage = firebase.storage().ref();
