import React, { Component } from 'react';
import { Route, BrowserRouter , Routes } from 'react-router-dom';
import HomePage from "./Components/HomePage"
import NavBar from './Components/NavBar'
import UserNLP from './Components/UserNLP'
import About from './Components/About'

export default class App extends Component {
    state = {}
    render() {
        return (
            <BrowserRouter> 
                <div>
                    <NavBar/>
                    <Routes>
                        <Route exact path='' element={<HomePage/>}/>
                        <Route exact path='/about' element= {<About/>} />
                        <Route exact path='/userNLP' element= {<UserNLP/>} />
                    </Routes>
                </div>
            </BrowserRouter> 
        );
  }
}
