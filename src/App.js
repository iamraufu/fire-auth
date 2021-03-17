import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: ''
  })
  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
      .then(result => {
        const { displayName, photoURL, email } = result.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signedInUser);
        console.log(displayName, photoURL, email)
      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
      })
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
      .then(result => {
        const signedOutUser = {
          isSignedIn: false,
          name: '',
          email: '',
          photo: ''
        }
        setUser(signedOutUser);
      }).catch((error) => {
        console.log(error)
      });
  }

  const handleBlur = (event) => {
    if (event.target.name ==='email') {
      const isValidEmail = /\S+@\S+\.\S+/.test(event.target.value)
      console.log(isValidEmail)
    }
    if(event.target.name === 'password'){
      const isValidPassword = /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{7,}$/.test(event.target.value)
      console.log(isValidPassword)
    }
    console.log(event.target.name, event.target.value)
  }

  const handleSubmit = () => {
    console.log("submitted")
  }

  return (
    <div className="App">
      <header className="App-header">
        {user.isSignedIn ?
          <button onClick={handleSignOut}>Sign Out</button> :
          <button onClick={handleSignIn}>Sign In</button>
        }
        {
          user.isSignedIn &&
          <div className="">
            <p>Welcome, {user.name}</p>
            <p>Your email: {user.email}</p>
            <img src={user.photo} alt='' />
          </div>
        }
        <h1>Authentication System</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" onBlur={handleBlur} name='email' placeholder='Your Email' required />
          <br />
          <input type="password" onBlur={handleBlur} name="password" id="" placeholder='Your Password' required />
          <br />
          <input type="submit" value="Submit" />
        </form>
      </header>
    </div>
  );
}

export default App;
