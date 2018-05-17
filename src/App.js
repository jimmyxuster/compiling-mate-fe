import React, { Component } from 'react';
import './App.css';
import ConceptTree from "./component/ConceptTree/ConceptTree";

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="title"/>
        <ConceptTree/>
      </div>
    );
  }
}

export default App;
