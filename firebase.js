import firebase from "firebase";

const firebaseConfig = {
	apiKey: "AIzaSyC78EZRwFRgkqQuBHULhMggiUt3nuzqs8A",
	authDomain: "chat-app-ce813.firebaseapp.com",
	projectId: "chat-app-ce813",
	storageBucket: "chat-app-ce813.appspot.com",
	messagingSenderId: "251586446424",
	appId: "1:251586446424:web:09cd2adc920cab3a8eb62d",
};

//if firebase isn't initialized yet, initialize it.  Otherwise continue using existing firebase
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
