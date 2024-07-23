import React from 'react';
import { Link } from "react-router-dom";
import './IndexPage.scss';


export default function IndexPage() {
  return <div className="choice-container">
    <div className="choice-card">
      <h2 className="user-select-header">I am an...</h2>
      <Link className="choice" to="/app">Athlete 🏃‍♂️ </Link>
      <Link className="choice" to="/admin">Admin 👨‍💻 </Link>
    </div>
  </div>

}
