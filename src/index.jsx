import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/index.scss';
import reportWebVitals from './reportWebVitals.jsx';
import {Route, Routes} from "react-router";
import {BrowserRouter as Router} from "react-router-dom"
import Page404 from "./Page404.jsx";
import App from "./app/App.jsx";
import DirectorPage from "./director/DirectorPage.jsx";
import DirectorLogin from "./director/DirectorLogin.jsx";
import IndexPage from "./home/IndexPage.jsx";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<IndexPage />}></Route>
                <Route path="/app/*" element={<App/>}/>
                <Route path="/join/:uuid" element={null}/>
                <Route path="/director" element={<DirectorPage/>}/>
                <Route path="/login" element={<DirectorLogin/>}/>
                <Route path="*" element={<Page404/>}/>
            </Routes>
        </Router>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
