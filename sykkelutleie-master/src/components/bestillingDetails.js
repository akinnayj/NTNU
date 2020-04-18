import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, List, Row, Column, Button } from '../widgets';
import { history } from '../index.js';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { bestillingService } from '../services/BestillingService.js';
import { kundeService } from '../services/KundeService.js';
import ReactLoading from 'react-loading';
import confirmBox from '../services/confirmBox';
import varsel from '../services/notifications.js';

class BestillingDetails extends Component {
  /* Viser detaljer om en enkelt bestilling */

  bestill = null;
  sykkel = null;
  utstyr = null;
  pakke = null;

  render() {
    if (!this.bestill || !this.sykkel || !this.utstyr || !this.pakke)
      return (
        <ReactLoading className="spinner fade-in" type="spinningBubbles" color="lightgrey" height="20%" width="20%" />
      );

    return (
      <div className="main">
        <Card>
          <div className="col-md-4">
            <h4>Om bestilling: </h4>
          </div>
          <div
            style={{
              borderRadius: '4px',
              boxSizing: 'border-box',
              padding: '30px 30px',
              margin: '14px'
            }}
          >
            <div className="brBottom">
              <Row>
                <Column width={3}>Startdato:</Column>
                <Column>{this.formateDate(this.bestill.leie_start)}</Column>
              </Row>
            </div>

            <div className="brBottom">
              <Row>
                <Column width={3}>Sluttdato:</Column>
                <Column>{this.formateDate(this.bestill.leie_slutt)}</Column>
              </Row>
            </div>
            <div className="brBottom">
              <Row>
                <Column width={3}>Kunde:</Column>
                <Column>
                  {this.bestill.fornavn} {this.bestill.etternavn}
                </Column>
              </Row>
            </div>
            <div className="brBottom">
              <Row>
                <Column width={3}>Samlet pris:</Column>
                <Column>{this.bestill.sum},-</Column>
              </Row>
            </div>
            <div className="brBottom">
              <Row>
                <Column width={3}>Status:</Column>
                <Column>{this.bestill.tilstand}</Column>
              </Row>
            </div>
            <div className="doubleBr">
              <Row>
                <Column width={3}>Beskrivelse:</Column>
                <Column>{this.bestill.beskrivelse}</Column>
              </Row>
            </div>
            <Row>
              <Column width={3}>Bestilte varer:</Column>
              <Column>
                <div className="brBottom">Sykkel: </div>

                {this.sykkel.map(sykkel => (
                  <Row key={sykkel.innholdsykkel_id}>
                    <ul>
                      <li>{sykkel.typenavn}</li>
                    </ul>
                  </Row>
                ))}
              </Column>
              <Column>
                <div className="brBottom">Utstyr: </div>
                {this.utstyr.map(utstyr => (
                  <Row key={utstyr.innholdutstyr_id}>
                    <ul>
                      <li>
                        {utstyr.navn} ({utstyr.ant_utstyr})
                      </li>
                    </ul>
                  </Row>
                ))}
              </Column>
              <Column>
                <div className="brBottom">Pakke: </div>
                {this.pakke.map(pakke => (
                  <Row key={pakke.innholdpakke_id}>
                    <ul>
                      <li>
                        {pakke.pakkenavn} ({pakke.pris})
                      </li>
                    </ul>
                  </Row>
                ))}
              </Column>
            </Row>
            <div>
              <br />
              <Row>
                {/* Rediger eller slette en bestilling */}
                <Column right>
                  <Button.Danger onClick={this.delete}>Slett bestilling</Button.Danger>
                </Column>
                <Column left>
                  <Button.Success onClick={this.edit}>Endre bestilling</Button.Success>
                </Column>
              </Row>
            </div>
          </div>
        </Card>
        <div>
          <br />
          <Row>
            <Column right>
              <Button.Light onClick={this.tilbake}>Tilbake</Button.Light>
            </Column>
          </Row>
        </div>
      </div>
    );
  }
  mounted() {
    bestillingService.getOrder(this.props.match.params.bestilling_id, bestill => {
      this.bestill = bestill;
    });
    bestillingService.getOrderContentsSykler(this.props.match.params.bestilling_id, sykkel => {
      this.sykkel = sykkel;
    });
    bestillingService.getOrderContentsUtstyr(this.props.match.params.bestilling_id, utstyr => {
      this.utstyr = utstyr;
    });
    bestillingService.getOrderContentsPakke(this.props.match.params.bestilling_id, pakke => {
      this.pakke = pakke;
    });
  }

  tilbake() {
    history.push('/aktivebestillinger');
  }

  formateDate(date) {
    /* Endrer datoformatet */
    let day = date.getDate();
    if (day < 10) {
      day = '0' + day.toString();
    }
    let month = date.getMonth() + 1;
    if (month < 10) {
      month = '0' + month.toString();
    }
    let year = date.getFullYear();

    return day + '/' + month + '/' + year;
  }
  delete() {
    confirmBox('Varsel', 'Ønsker du å slette bestillingen?', res => {
      if (res == 1) {
        bestillingService.deleteOrder(this.props.match.params.bestilling_id);
        varsel('Suksess!', 'Du har slettet bestillingen', 'vrsl-success');
        {
          history.push('/');
        }
      }
    });
  }
  edit() {
    history.push('/aktivebestillinger/' + this.bestill.bestilling_id + '/edit');
  }
}

export { BestillingDetails };
