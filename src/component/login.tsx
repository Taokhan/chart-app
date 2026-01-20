import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import "./login.css";

class Login extends Component {
  state = {
    username: "",
    password: "",
    redirect: false
  };

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { username, password } = this.state;

    if (username === "admin" && password === "admin") {
      this.setState({ redirect: true });
    } else {
      alert("Invalid");
    }
  };

  render() {
    if (this.state.redirect) {
      return <Navigate to="/chart" />;
    }

    return (
      <div className="login">
        <h4>Login</h4>
        <form onSubmit={this.handleSubmit}>
          <div className="text_area">
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="text_input"
              onChange={this.handleChange}
            />
          </div>

          <div className="text_area">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="text_input"
              onChange={this.handleChange}
            />
          </div>

          <input type="submit" value="LOGIN" className="btn" />
        </form>
      </div>
    );
  }
}

export default Login;
