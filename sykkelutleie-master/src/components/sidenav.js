import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, List, Row, Column, NavBar, Button, Form } from '../widgets';
import { history } from '../index.js';
import { loginService } from '../services/LoginService';
import { cartService } from '../services/CartService';
import confirmBox from '../services/confirmBox';
import varsel from '../services/notifications.js';

//activeStyle funk ikkje
class Sidenav extends Component {
  render() {
    return (
      <div className="col-md-2">
        <NavBar.Link className="link" to="/leieperiode">
          <Button.Success onClick={this.bestill}>Ny bestilling</Button.Success>
        </NavBar.Link>
        <NavBar.Link to="/leieperiode">Leieperiode</NavBar.Link>
        <NavBar.Link to="/kunde">Kunde</NavBar.Link>
        <NavBar.Link to="/sykkel">Sykkel</NavBar.Link>
        <NavBar.Link to="/ekstrautstyr">Ekstrautstyr</NavBar.Link>
        <NavBar.Link to="/pakker">Pakketilbud</NavBar.Link>
        <NavBar.Link to="/handlekurv">Handlekurv</NavBar.Link>
      </div>
    );
  }
  bestill() {
    if (cartService.kunde == null && cartService.startdato == null && cartService.handlekurv.length == 0) {
      history.push('/leieperiode');
    } else {
      confirmBox('Varsel', 'Ønsker du å starte en ny bestilling?', res => {
        if (res == 1) {
          cartService.dropOrder();
          varsel('Suksess!', 'Du startet en ny bestilling', 'vrsl-success');
        }
      });
    }
  }
}

export default Sidenav;
