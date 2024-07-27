import React, { Component } from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes, Switch} from 'react-router-dom';
import Login from './Login';
import SeeUsers from "./SeeUsers";
import EditUsers from "./EditUsers";
import SeeAllPatients from "./SeeAllPatients";
import EditPacienti from "./EditPacienti";
import SeeAllRadiologii from "./SeeAllRadiologii";
import EditRadiologie from "./EditRadiologie";
import SeeRadiolog from "./SeeRadiolog";
import SeeAllRadiologiiRadiolog from "./SeeAllRadiologiiRadiolog";
import EditRadiolog from "./EditRadiolog";


class App extends Component {
  render() {
    return (
        <Router>
          <Routes>
              <Route path='/' element={<Login />} />
              <Route path='/admin' element={<SeeUsers />} />
              <Route path='/users/:id' element={<EditUsers />} />
              <Route path='/pacienti/:id' element={<EditPacienti />} />
              <Route path='/radiologie/:id' element={<EditRadiologie />} />
              <Route path='/doctor' element={<SeeAllPatients />} />
              <Route path='/radiologii' element={<SeeAllRadiologii />} />
              <Route path='/radiolog' element={<SeeRadiolog />} />
              <Route path='/radiologiiRadiolog' element={<SeeAllRadiologiiRadiolog />} />
              <Route path='/radiolog/:id' element={<EditRadiolog />} />


          </Routes>
        </Router>
    );
  }
}

export default App;
