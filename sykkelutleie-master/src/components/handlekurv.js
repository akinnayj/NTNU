import * as React from 'react';
import { Component } from 'react-simplified';
import { NavBar, Button } from '../widgets';
import { NavLink } from 'react-router-dom';
import { cartService } from '../services/CartService';
import { bestillingService } from '../services/BestillingService';
import ReactLoading from 'react-loading';
import varsel from '../services/notifications.js';

class Handlekurv extends Component {
  constructor(props) {
    super(props);
    this.state = {
      handlekurv: null
    };
    this.sum = 0;
    this.rabatt = false;
    this.kunde = cartService.getKunde();
    this.startdato = cartService.getStartdato();
    this.sluttdato = cartService.getSluttdato();
    this.antDager = cartService.getAntDager();
  }

  updateRabatt() {
    this.rabatt = !this.rabatt;
    this.updateSum();
  }

  updateSum() {
    let varer = cartService.getHandlekurv();
    this.sum = 0;
    for (let i = 0; i < varer.length; i++) {
      this.sum += varer[i].pris * this.antDager;
    }

    if (this.rabatt) {
      this.sum *= 0.95; // 5% i rabatt
    }
    this.sum = this.sum.toFixed(2);
  }

  delItem(index) {
    cartService.dropItem(index);
    this.setState({ handlekurv: cartService.getHandlekurv() });
    this.updateSum();
  }

  regBestilling() {
    let antVarer = this.state.handlekurv.length;
    if (this.startdato != null && this.kunde != null && antVarer > 0) {
      bestillingService.addOrder(this.sum, this.rabatt);
    } else {
      if (this.startdato == null) {
        varsel('Feil!', 'Du må velge en periode', 'vrsl-danger');
      }
      if (this.kunde == null) {
        varsel('Feil!', 'Du må velge en kunde', 'vrsl-danger');
      }
      if (antVarer <= 0) {
        varsel('Feil!', 'Du må legge til minst en vare', 'vrsl-danger');
      }
      if (cartService.getAvdeling() == -1) {
        varsel('Feil!', 'Du har ikke valgt avdeling', 'vrsl-danger');
      }
    }
  }

  render() {
    if (!this.state.handlekurv)
      return (
        <ReactLoading className="spinner fade-in" type="spinningBubbles" color="lightgrey" height="20%" width="20%" />
      );
    return (
      <div
        style={{
          margin: '24px',
          marginLeft: '0px',
          marginRight: '0px'
        }}
      >
        {/* Viser hva som er valgt til bestillingen */}
        <div className="col-md-4">
          <h4>Handlekurv</h4>
        </div>
        <br />
        <div
          className="container-fluid brBottom"
          style={{ boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)' }}
        >
          <div className="row" style={{ backgroundColor: 'lavender', fontWeight: 'bold' }}>
            <div className="col">Nr.</div>
            <div className="col">Produktnavn</div>
            <div className="col">Antall</div>
            <div className="col">Enhetspris</div>
            <div className="col">Totalpris</div>
            <div className="col" />
          </div>
          {this.state.handlekurv.map((prod, index) => (
            <div key={index} className="row" style={index % 2 != 0 ? { backgroundColor: 'lavender' } : {}}>
              <div className="col">{index + 1}</div>
              <div className="col">{prod.navn}</div>
              <div className="col">{prod.antall}</div>
              <div className="col">{prod.pris}</div>
              <div className="col">{prod.pris * this.antDager}</div>
              <div className="col">
                <Button.Info id="slett" onClick={() => this.delItem(index)}>
                  X
                </Button.Info>
              </div>
            </div>
          ))}
        </div>
        <div className="col">
          <div>
            <h6>
              <b>Leieperiode:</b>{' '}
              {(this.startdato || this.sluttdato) != null
                ? 'fra ' + this.startdato + ' til ' + this.sluttdato + ' antall dager: ' + this.antDager
                : 'NB! Det er ikke valgt en leieperiode for bestillingen enda.'}
            </h6>
          </div>
          <div>
            <h6>
              <b>Kunde:</b>{' '}
              {this.kunde != null
                ? this.kunde.fornavn + ' ' + this.kunde.etternavn
                : 'NB! Ingen kunde er tilknyttet bestillingen enda.'}
            </h6>
          </div>
          Totalt: {this.sum} kr <br /> Rabatt:
          <input className="col-1" type="checkbox" onChange={this.updateRabatt} />
        </div>
        <Button.Success onClick={this.regBestilling}>Register</Button.Success>
      </div>
    );
  }

  mounted() {
    this.setState({ handlekurv: cartService.getHandlekurv() });
    this.updateSum();
  }
}

export { Handlekurv };
