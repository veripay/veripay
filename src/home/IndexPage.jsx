import React from 'react';
import {Link} from "react-router-dom";
import './IndexPage.scss';


export default function IndexPage() {
    return <div className="choice-container">
        <div className="choice-card">
            <h1 className={"director"}>I am a...</h1>
            <Link className="choice" to="/app">Athlete</Link>
            <Link className="choice" to="/director/login">Director</Link>
        </div>
    </div>

}
