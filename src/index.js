import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyB7TsecXi2gMrYLG6_OEVa6dqq5EKIox6k",

  authDomain: "western-welded-7df50.firebaseapp.com",

  databaseURL: "https://western-welded-7df50-default-rtdb.firebaseio.com",

  projectId: "western-welded-7df50",

  storageBucket: "western-welded-7df50.firebasestorage.app",

  messagingSenderId: "895109999072",

  appId: "1:895109999072:web:c1f2ebea876fb4d3b86385"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);
