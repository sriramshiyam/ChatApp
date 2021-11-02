import './App.css';
import { useEffect, useState } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, onSnapshot, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import ChatRoom from './components/chatRoom';
import SignIn from './components/SignIn';


const firebaseApp = initializeApp({
  apiKey: "AIzaSyCLd0T2lGqthD228hTvXo1iA8_RN8ympjg",
  authDomain: "javascript-app-97710.firebaseapp.com",
  databaseURL: "https://javascript-app-97710-default-rtdb.firebaseio.com",
  projectId: "javascript-app-97710",
  storageBucket: "javascript-app-97710.appspot.com",
  messagingSenderId: "530185312849",
  appId: "1:530185312849:web:0d51e01d3667a9885c3670",
  measurementId: "G-2S4RXSVPYQ"
});

function App() {
  const db = getFirestore();
  let def = doc(db, 'messages/8kSlFDCrXA2YpPnhwuWX');

  const auth = getAuth(firebaseApp);
  const provider = new GoogleAuthProvider();

  const [user, setUser] = useState('');

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        setUser(user);
      }
    });
  }, [])

  async function signin() {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        setUser(result.user);
      }).catch((error) => {
        // Handle Errors here.
        console.log(error);
        // ...
      });

  }

  function signout() {
    signOut(auth).then(() => {
      console.log('signed out');
      setUser('');
    }).catch((error) => {
      console.log(error);
    });
  }

  // sending data to the firestore 
  function sub(message) {

    try {
      function writeData() {
        let docData = {
          chat: arrayUnion({
            message: message,
            photo: user.photoURL,
            name: user.displayName,
            id: user.uid
          })
        }
        updateDoc(def, docData);
      }
      writeData();
      console.log('data written in firestore');
    } catch (e) {
      console.error("Error writing document: ", e);
    }

  }

  return (
    <div className="App">
      <header>
        <h2>CHAT APP 🔥💬</h2>
        <button style={{ display: user ? 'block' : 'none' }} onClick={signout} className="signout">SignOut <svg stroke="currentColor" fill="currentColor" stroke-width="0" version="1.1" x="0px" y="0px" viewBox="0 0 48 48" enable-background="new 0 0 48 48" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
	c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
	c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
	C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg></button>
      </header>
      {user ? <ChatRoom sub={sub} user={user} onSnapshot={onSnapshot} def={def} /> : <SignIn signin={signin} />}
    </div>
  );
}

export default App