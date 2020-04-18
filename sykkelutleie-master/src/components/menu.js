import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, List, Row, Column, NavBar, Button, Form } from '../widgets';
import { history } from '../index.js';
import { loginService } from '../services/LoginService';
import { sykkelService } from '../services/SykkelService.js';
import { cartService } from '../services/CartService';
import confirmBox from '../services/confirmBox';

class Menu extends Component {
  avdelinger = [];
  state = {
    avdValue: 'Avdelinger'
  };

  changeAvdeling(evt) {
    let sel = document.getElementById(evt.target.id);
    let id = sel[sel.selectedIndex].id;
    let name = sel[sel.selectedIndex].value;
    confirmBox('Varsel', 'Dersom du bytter avdeling mister du nåværende bestilling! Ønsker du å fortsette?', res => {
      if (res == 1) {
        //ja
        this.setState({ avdValue: name });
        cartService.dropOrder();
        cartService.setAvdeling(id);
        history.push('/leieperiode');
      }
    });
  }

  mounted() {
     if(!cartService.getIsLoggedInn()){// FIXME: legg til for å bruke innloggingen og utlogging, IKKE FJERN
      document.getElementById("loginCover").classList.remove('js-hidden');
       history.push('/login');
     }
    sykkelService.getAvdelinger(avdelinger => {
      this.avdelinger = avdelinger;
    });
  }

  render() {
    return (
      <div
        className="col bg-light"
        style={{ boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)' }}
      >
        <div id="loginCover" className="js-cover js-hidden" />
        <NavBar
          brand=<img
            src="images/sykkelutleie.jpg"
            onClick={() => history.push('/')}
            alt="logo"
            style={{ width: '256.4px', height: '70px' }}
          />
        >
          <NavBar.Link to="/aktivebestillinger">Alle bestillinger</NavBar.Link>
          <NavBar.Link to="/sykkelID">Avvik</NavBar.Link>
          <div className="js-hidden" id="leieperiode" />
          <div className="form-group">
            <select
              id="avdeling"
              name="avdeling"
              className="form-control avd_select"
              value={this.state.avdValue}
              onChange={event => this.changeAvdeling(event)}
            >
              <option id={-1}>{this.state.avdValue}</option>
              {this.avdelinger.map(avdeling => (
                <option key={avdeling.avdeling_id} id={avdeling.avdeling_id}>
                  {avdeling.navn}
                </option>
              ))}
            </select>
          </div>
          <div
            style={{
              color: 'rgba(0, 0, 0, 0.5)',
              fontSize: '18px',
              position: 'absolute',
              right: '10px',
              padding: '8px',
              paddingBottom: '12px',
              fontWeight: 'bold'
            }}
          >
            <Button.Info onClick={loginService.logout}>Logg ut</Button.Info>
          </div>
        </NavBar>
      </div>
    );
  }
}

export default Menu;
