import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import FA from "react-fontawesome";
import "font-awesome/css/font-awesome.min.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
          <FA name="rocket fw" spin />
        </p>
      </div>
    );
  }
}

export default App;
