import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user,setUser] =useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: ''
  })
  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
    .then(result => {
      const {displayName,photoURL, email} = result.user;
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo:photoURL
      }
      setUser(signedInUser);
      console.log(displayName,photoURL,email)
    })
    .catch(err=>{
      console.log(err);
      console.log(err.message);
    })
  }
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={handleSignIn}>Sign In</button>
        {
          user.isSignedIn && 
          <div className="">
            <p>Welcome, {user.name}</p>
          <p>Your email: {user.email}</p>
          <img src={user.photo} alt=''/>
          </div>
        }
      </header>
    </div>
  );
}

export default App;
