import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser,setNewUser] = useState(false)
  const [user, setUser] = useState({
    isSignedIn: false,
    newUser: false,
    name: '',
    email: '',
    password: '',
    photo: '',
    error:'',
    success: false
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
    let isFieldValid = true;
    if (event.target.name === 'email') {
      isFieldValid = /\S+@\S+\.\S+/.test(event.target.value)
    }
    if (event.target.name === 'password') {
      isFieldValid = /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{7,}$/.test(event.target.value)
    }
    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[event.target.name] = event.target.value;
      setUser(newUserInfo);
    }
  }

  const handleSubmit = (event) => {
    // console.log(user.email, user.password);
    if (newUser && user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then((res) => {
        const newUserInfo = {...user};
        newUserInfo.error = ''; 
        newUserInfo.success = true;
        setUser(newUserInfo);
        updateUserName(user.name);
      })
      .catch((error) => {
        const newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
      });
    }

    if(!newUser && user.email && user.password){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(res => {
      const newUserInfo = {...user};
      newUserInfo.error = ''; 
      newUserInfo.success = true;
      setUser(newUserInfo);
      console.log('sign in', res.user)                                            
  })
  .catch((error) => {
    const newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
  });
    }

    event.preventDefault();
    
  }

  const updateUserName = name =>{
    const user = firebase.auth().currentUser;

  user.updateProfile({
  displayName: name
}).then(function() {
  console.log('name updated')
}).catch(function(error) {
  console.log(error)
});
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
        <input type="checkbox" onChange ={()=>setNewUser(!newUser)} name="newUser" id=""/>
        <label htmlFor="newUser">New User Sign Up</label>
        <form onSubmit={handleSubmit}>
          { newUser && <input type="text" onBlur={handleBlur} name='name' placeholder='Your Name' />}
          <br />
          <input type="text" onBlur={handleBlur} name='email' placeholder='Your Email' required />
          <br />
          <input type="password" onBlur={handleBlur} name="password" id="" placeholder='Your Password' required />
          <br />
          <input type="submit" value={newUser? "Sign Up":"Sign In"} />
        </form>
        <p style={{color:'red'}}>{user.error}</p>
        {
          user.success && <p style={{color:'green'}}>Successfully Signed {newUser? 'Up':'In'}</p>
        }
      </header>
    </div>
  );
}

export default App;
