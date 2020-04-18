import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, List, Row, Column, Button } from '../widgets';
import { history } from '../index.js';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { bestillingService } from '../services/BestillingService.js';
import { kundeService } from '../services/KundeService.js';
import ReactLoading from 'react-loading';
import formatDate from '../services/formatDate.js';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

class AktiveBestillinger extends Component {
  bestilling = null;
  fullfortbest = null;

  state = { sok: '' };

  onInputChange = (event, data) => this.setState({ sok: event.target.value.toLowerCase() });

  changeTab(){//nullstiller søket når en navigere med tabs
    document.querySelector("div>input.bestillingInput").value = "";
    this.setState({ sok: '' });
  }

  render() {
    if (!this.bestilling || !this.fullfortbest)
      return (
        <ReactLoading className="spinner fade-in" type="spinningBubbles" color="lightgrey" height="20%" width="20%" />
      );
    // Filtrerer hvilke bestillinger som blir rendret, etter søkeord (søkes etter navn her).
    const bestilling = this.bestilling.filter(bestilling =>
      bestilling['navn']
        .toString()
        .toLowerCase()
        .includes(this.state.sok)
    );
    const fullfortbest = this.fullfortbest.filter(bestilling =>
      bestilling['navn']
        .toString()
        .toLowerCase()
        .includes(this.state.sok)
    );
    return (
      <div className="main">
        <Tabs defaultActiveKey="aktiveBestillinger" id="bestillingTabs"  onSelect={this.changeTab}>
          <Tab eventKey="aktiveBestillinger" title="Aktive bestillinger" className="doubleBr">
            {/* Visning av bestillinger som ikke har status som fullført */}
            <input
              type="text"
              className=" bestillingInput"
              placeholder="Søk etter kunde"
              onChange={this.onInputChange}
            />
            <Row>
              <Column>BestillingsID</Column>
              <Column>Kunde</Column>
              <Column>Leie fra</Column>
              <Column>Leie til</Column>
            </Row>
            <List>
              {bestilling.map(bestilling => (
                <List.Item key={bestilling.bestilling_id} to={'/aktivebestillinger/' + bestilling.bestilling_id}>
                  <Row>
                    <Column>{bestilling.bestilling_id}</Column>
                    <Column>
                      {bestilling.fornavn} {bestilling.etternavn}
                    </Column>
                    <Column>{formatDate(bestilling.leie_start)}</Column>
                    <Column>{formatDate(bestilling.leie_slutt)}</Column>
                  </Row>
                </List.Item>
              ))}
            </List>
          </Tab>

          <Tab eventKey="fullforteBestillinger" title="Fullførte bestillinger">
            {/* Visning av bestillinger som har status som fullført */}
            <input
              type="text"
              className=" bestillingInput"
              placeholder="Søk etter kunde"
              onChange={this.onInputChange}
            />

            <Row>
              <Column>BestillingsID</Column>
              <Column>Kunde</Column>
              <Column>Leie fra</Column>
              <Column>Leie til</Column>
            </Row>

            <List>
              {fullfortbest.map(bestilling => (
                <List.Item key={bestilling.bestilling_id} to={'/aktivebestillinger/' + bestilling.bestilling_id}>
                  <Row>
                    <Column>{bestilling.bestilling_id}</Column>
                    <Column>
                      {bestilling.fornavn} {bestilling.etternavn}
                    </Column>
                    <Column>{formatDate(bestilling.leie_start)}</Column>
                    <Column>{formatDate(bestilling.leie_slutt)}</Column>
                  </Row>
                </List.Item>
              ))}
            </List>
          </Tab>
        </Tabs>
      </div>
    );
  }
  mounted() {
    bestillingService.getAktiveBestillinger(bestilling => {
      this.bestilling = bestilling.map(bestilling => ({
        ...bestilling,
        navn: `${bestilling.fornavn} ${bestilling.etternavn}` // legger til "navn" = fornavn OG etternavn
      }));
    });
    bestillingService.getFullforteBestillinger(fullfortbest => {
      this.fullfortbest = fullfortbest.map(bestilling => ({
        ...bestilling,
        navn: `${bestilling.fornavn} ${bestilling.etternavn}`
      }));
    });
  }
}

export { AktiveBestillinger };
