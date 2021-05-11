import "../styles/globals.css";
import {useEffect} from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import Login from "./login";
import Loader from "../components/Loader";
import firebase from "firebase";

function MyApp({ Component, pageProps }) {
	const [user, loading] = useAuthState(auth);

	useEffect(() => {
		if (user) {
			db.collection("users").doc(user.uid).set(
				{
					//using set instead of update in case it's the first time the user logs in and doesn't have a record.
					email: user.email,
					lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
					photoURL: user.photoURL,
				},
				{ merge: true }
			); //setting merge to true because .set replaces everything in document without it. merge will update rather than replace
		}
	}, [user]);

	if (loading) return <Loader />;

	if (!user) return <Login />;

	return <Component {...pageProps} />;
}

export default MyApp;
