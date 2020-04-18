import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';
import { Button } from '../widgets';
import { history } from '../index.js';
import { cartService } from '../services/CartService';
import { loginService } from '../services/LoginService';

class Login extends Component {
  constructor(props) {
    super(props);
    this.name = '';
    this.psw = '';

    this.login = this.login.bind(this);
  }
  login() {
    loginService.login(this.name, this.psw, res => {
      if (res) {
        document.querySelector('div#loginCover').classList.add('js-hidden');
        history.push('/');
      }
    });
  }

  render() {
    return (
      <div className="confirmBox loginBox">
        <h2 className="brBottom">Innlogging</h2>
        <div>
          <p>Brukernavn: </p>
          <input
            type="text"
            placeholder="Brukernavn"
            onChange={() => {
              this.name = event.target.value.toString();
            }}
          />
        </div>
        <div className="brBottom">
          <p>Passord: </p>
          <input
            type="password"
            placeholder="Passord"
            onChange={() => {
              this.psw = event.target.value.toString();
            }}
          />
        </div>
        <div className="brBottom">
          <Button.Info onClick={this.login}>Logg inn</Button.Info>
        </div>
      </div>
    );
  }
}

export default Login;
