import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { Card, List, Row, Column, Form } from '../widgets';
import Button from 'react-bootstrap/Button';
import { history } from '../index.js';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { bestillingService } from '../services/BestillingService.js';
import formatDate from '../services/formatDate.js';
import varsel from '../services/notifications.js';

class BestillingEdit extends Component {
  /* Skjema for redigering av en bestilling */
  constructor() {
    super();
    this.state = {
      sykkel: null,
      utstyr: null,
      pakke: null
    };
    this.bestill = null;
    this.status = null;
  }

  render() {
    if (!this.bestill || !this.state.sykkel || !this.state.utstyr || !this.state.pakke || !this.status) return null;

    return (
      <div className="main">
        <Card>
          <div className="col-md-4">
            <h4>Rediger bestilling: </h4>
          </div>
          <div className="container-fluid brBottom">
            <div className="row">
              <div className="col-8">
                <Form.Label>Startdato: {formatDate(this.bestill.leie_start)}</Form.Label>
                <br />
                <Form.Label>Sluttdato: {formatDate(this.bestill.leie_slutt)}</Form.Label>
                <br />
                <Form.Label>Fornavn:</Form.Label>
                <Form.Input
                  type="text"
                  value={this.bestill.fornavn}
                  onChange={e => (this.bestill.fornavn = e.target.value)}
                />
                <Form.Label>Etternavn:</Form.Label>
                <Form.Input
                  type="text"
                  value={this.bestill.etternavn}
                  onChange={e => (this.bestill.etternavn = e.target.value)}
                />
                <Form.Label>Samlet pris:</Form.Label>
                <Form.Input
                  type="number"
                  value={this.bestill.sum}
                  onChange={e => (this.bestill.sum = e.target.value)}
                />
                <br />
                <Form.Label>Status:</Form.Label>
                <br />
                <select value={this.bestill.status_id} onChange={e => (this.bestill.status_id = e.target.value)}>
                  {this.status.map(status => (
                    <option key={status.status_id} value={status.status_id}>
                      {status.tilstand}
                    </option>
                  ))}
                </select>
                <br />
                <br />
                <Form.Label>Beskrivelse:</Form.Label>
                <Form.Input
                  type="text"
                  value={this.bestill.beskrivelse}
                  onChange={e => (this.bestill.beskrivelse = e.target.value)}
                />

                <br />
                <Form.Label>Bestilte varer:</Form.Label>
                <br />
                <Form.Label>Sykler:</Form.Label>
                <br />

                <Row>
                  {/* Slette en sykkel fra bestillingen */}
                  <Column left>
                    {this.state.sykkel.map(sykkel => (
                      <Card key={sykkel.innholdsykkel_id}>
                        {sykkel.typenavn}
                        <br />
                        Pris: {sykkel.pris}
                        <br />
                        <Button variant="danger" onClick={e => this.deletesyk(sykkel.innholdsykkel_id, sykkel.pris)}>
                          Slett
                        </Button>
                      </Card>
                    ))}
                  </Column>
                </Row>
                <br />
                <Row>
                  <Column left>
                    <div>Utstyr:</div>
                  </Column>
                </Row>
                <Row>
                  {/* Slette utstyr fra bestillingen */}
                  <Column left>
                    {this.state.utstyr.map(utstyr => (
                      <Card key={utstyr.utstyr_id}>
                        {utstyr.navn} ({utstyr.ant_utstyr})
                        <br />
                        Pr stk: {utstyr.pris} kr, Total: ({utstyr.pris * utstyr.ant_utstyr})
                        <br />
                        <Button variant="danger" onClick={e => this.deleteuts(utstyr.innholdutstyr_id, utstyr.pris)}>
                          Slett
                        </Button>
                      </Card>
                    ))}
                  </Column>
                </Row>
                <Row>
                  <Column left>
                    <div>Pakke:</div>
                  </Column>
                </Row>
                <Row>
                  {/* Slette utstyr fra bestillingen */}
                  <Column left>
                    {this.state.pakke.map(pakke => (
                      <Card key={pakke.pakke_id}>
                        {pakke.pakkenavn}
                        <br />
                        <div>(Kan ikke slette pakke)</div>
                      </Card>
                    ))}
                  </Column>
                </Row>
              </div>
            </div>
          </div>
        </Card>
        <br />
        <div>
          <Row>
            <Column>
              <Button variant="success" onClick={this.save}>
                Lagre
              </Button>
            </Column>
            <Column right>
              <Button variant="light" onClick={this.tilbake}>
                Tilbake
              </Button>
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
    bestillingService.tilstander(status => {
      this.status = status;
    });

    this.updatePakke();
    this.updateSykkel();
    this.updateUtstyr();
  }

  updatePakke() {
    bestillingService.getOrderContentsPakke(this.props.match.params.bestilling_id, pakke => {
      this.setState({ pakke: pakke });
    });
  }

  updateSykkel() {
    bestillingService.getOrderContentsSykler(this.props.match.params.bestilling_id, sykkel => {
      this.setState({ sykkel: sykkel });
    });
  }

  updateUtstyr() {
    bestillingService.getOrderContentsUtstyr(this.props.match.params.bestilling_id, utstyr => {
      this.setState({ utstyr: utstyr });
    });
  }

  save() {
    if (this.bestill.sum != '' && this.bestill.fornavn.length > 0 && this.bestill.etternavn.length > 0) {
      bestillingService.updateOrder(this.bestill, this.sykkel, this.utstyr, this.pakke);
      history.push('/aktivebestillinger/');
    } else {
      if (this.bestill.sum == '') {
        varsel('Feil!', 'Kan ikke registrere tom sum', 'vrsl-danger');
      }
      if (this.bestill.fornavn.length <= 0) {
        varsel('Feil!', 'Mangler fornavn', 'vrsl-danger');
      }
      if (this.bestill.etternavn.length <= 0) {
        varsel('Feil!', 'Mangler etternavn', 'vrsl-danger');
      }
    }
  }

  tilbake() {
    history.push('/aktivebestillinger');
  }
  deletesyk(id, pris) {
    bestillingService.deleteSykkel(id);
    this.bestill.sum -= pris;
    this.updateSykkel();
  }
  deleteuts(id, pris) {
    bestillingService.deleteUtstyr(id);
    this.bestill.sum -= pris;
    this.updateUtstyr();
  }
}

export { BestillingEdit };

/*
<Row>
  <Column left>
    <div>Pakke:</div>
  </Column>
</Row>
<Row>
  Slette Pakke fra bestillingen
  <Column left>
    {this.state.pakke.map(pakke => (
      <Card key={pakke.innholdpakke_id}>
        {pakke.pakkenavn} ({pakke.pris})
        <br />
        <Button variant="light">Pakke kan ikke slettes</Button>
      </Card>
    ))}
  </Column>
</Row>
*/
