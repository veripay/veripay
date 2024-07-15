import React from 'react';
import './AthleteLoginPage.scss'
import Cookies from "js-cookie";
import {Navigate} from "react-router-dom";


export default class AthleteLoginPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {email: '', password: '', error: '', redirect: false};

        this.handleSubmit = this.handleSubmit.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setPassword = this.setPassword.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log(this.state.email, this.state.password);
        let users = this.props.database.getAthletes();

        let authenticatedUsers = users.filter(user => user.email === this.state.email && user.password === this.state.password);
        console.log(authenticatedUsers,authenticatedUsers.length);
        if (authenticatedUsers.length > 0) {
            Cookies.set('athlete-id', authenticatedUsers[0].id);
            this.setState({redirect: true});
        } else {
            this.setState({error: "Email or password not found"});
        }
    }

    setEmail(event) {
        this.setState({email: event.target.value});

    }
    setPassword(event) {
        this.setState({password: event.target.value});

    }

    render() {
        return (<>
                {this.state.redirect ? <Navigate to={"/app"} /> : ""}
                <div className="login-container">
                    <div className="login-card">
                        <h1 className={"athlete"}>Welcome</h1>
                        <h2 className={"athlete"}>Sign in to your account</h2>
                        <form onSubmit={this.handleSubmit}>
                            <div className="input-group">
                                <input
                                    type="text"
                                    id="email"
                                    value={this.state.email}
                                    onChange={this.setEmail}
                                    required
                                    placeholder="Email"
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="password"
                                    id="password"
                                    value={this.state.password}
                                    onChange={this.setPassword}
                                    required
                                    placeholder="Password"
                                />
                            </div>
                            <button className="athlete-submit" type="submit">Sign In</button>
                        </form>
                        {this.state.error ? <p className="error">{this.state.error}</p> : ""}
                    </div>
                </div>
            </>
        )
    }
}

