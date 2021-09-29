import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { createBrowserHistory } from "history";

import './App.css';
import logoName from '../src/Recursos/rayoprimoFA.svg';


import SideBar from "./components/sideBar/SideBar";
import Header from "./components/header/Header";

import Login from "./pages/login/LoginForm";
import Storehouse from "./pages/storehouse/Storehouse";
import Cashier from "./pages/cashier/Cashier";
import Dashboard from "./pages/admin_dashboard/Dashboard";


import PrivateRoute from "./PrivateRoute";
import DataProviderProducts from "./api/products";
const history = createBrowserHistory();

function App() {
  return (
    <div>
      <DataProviderProducts>
        <Router basename={process.env.PUBLIC_URL} history={history}>
          <Switch>
            <Route exact path="/">
              <Redirect to="/login" />
            </Route>
            <Route path="/login" exact component={Login}></Route>
            <div className="body">
              <Header name={history.location.pathname.substring(1, history.location.pathname.length)}/>
              <img className='watermark' alt='watermark' src={logoName} width="420" height="460" />
              <SideBar />
              <PrivateRoute path="/storehouse" exact component={Storehouse} />
              <PrivateRoute path="/dashboard" exact component={Dashboard} />
              <PrivateRoute path="/cashier" exact component={Cashier} />

            </div>
            <Route component={Login}></Route>
          </Switch>
        </Router>
      </DataProviderProducts>
    </div>
  );
}

export default App;
