import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, List, Row, Column, Button, Form } from '../widgets';
import { sykkelService } from '../services/SykkelService.js';
import { history } from '../index.js';
import ReactLoading from 'react-loading';
import { bestillingService } from '../services/BestillingService.js';
import varsel from '../services/notifications.js';

class SykkelID extends Component {
  sykkelid = [];
  info = null;
  status = [];
  avdeling = [];
  standard = (
    <div>
      <h4>Sykkel ID: </h4>
      <h5>Søk opp en sykkel etter ID for å endre status eller nåværende lokasjon</h5>
      <div className="brBottom">
        <input
          id="id"
          name="id"
          type="number"
          placeholder="ID"
          className="form-control input-md shadow"
          onChange={event => (this.sykkelid = event.target.value)}
          required
        />
      </div>
      <Row>
        <Column left>
          <Button.Light
            onClick={() => {
              this.sok(this.sykkelid);
            }}
          >
            Søk
          </Button.Light>
        </Column>
        <Column right>
          <Button.Success onClick={this.oppdater}>Lagre endringer</Button.Success>
        </Column>
      </Row>
    </div>
  );

  render() {
    if (this.info !== null) {
      return (
        <div className="main">
          <Card>
            <div className="col-md-6" style={{ margin: '30px' }}>
              {this.standard}
              <div style={{ marginTop: '50px' }}>
                <Row>
                  <Column />
                </Row>

                <Row>
                  <Column>
                    <div> Tilhører: {this.info.org_navn} </div>
                    <Form.Label>Nåværende plassering: </Form.Label>
                    <br />
                    <select
                      className="brBottom kundeinput"
                      id="avdSel"
                      value={this.info.naa_avdeling_id}
                      onChange={e => (this.info.naa_avdeling_id = e.target.value)}
                    >
                      {this.avdeling.map(avdeling => (
                        <option key={avdeling.avdeling_id} value={avdeling.avdeling_id}>
                          {avdeling.navn}
                        </option>
                      ))}
                    </select>
                    <br/>
                    <Form.Label>Status: </Form.Label>
                    <br />
                    <select
                      className="kundeinput"
                      value={this.info.status_id}
                      onChange={e => (this.info.status_id = e.target.value)}
                    >
                      {this.status.map(status => (
                        <option key={status.status_id} value={status.status_id}>
                          {status.tilstand}
                        </option>
                      ))}
                    </select>
                    <br/>
                    <Form.Label>Info:</Form.Label>
                    <br/>
                    <textarea
                      rows="4"
                      cols="50"
                      value={this.info.info}
                      onChange={e => (this.info.info = e.target.value)}
                    />

                    <br />
                  </Column>
                </Row>
              </div>
            </div>
          </Card>
        </div>
      );
    } else {
      return (
        <div className="main">
          <Card>
            <div className="col-md-6" style={{ margin: '30px' }}>
              {this.standard}
            </div>
          </Card>
        </div>
      );
    }
  }

  sok(id) {
    if (id.length == 0) {
      varsel('OBS!', 'Ikke gyldig søk', 'vrsl-danger');
      return;
    }
    sykkelService.getSykkelByID(id, success => {
      if (success === undefined) {
        this.info = null;
        varsel('OBS!', 'Ingen treff', 'vrsl-success');
      } else {
        this.info = success;
      }
    });
    bestillingService.tilstander(status => {
      this.status = status;
    });
    sykkelService.getAvdelinger(avdeling => {
      this.avdeling = avdeling;
    });
  }
  oppdater() {
    if (this.info !== null) {
      sykkelService.updateSykkelByID(this.info.status_id, this.info.naa_avdeling_id, this.sykkelid, this.info.info);
    } else {
      varsel('Feil!', 'Ingen sykkel valgt', 'vrsl-danger');
    }
  }
  updateAvdeling(e) {
    let sel = document.getElementById(e.target.id);
    this.info.naa_avdeling_id = sel[sel.selectedIndex].id;
  }
}
export { SykkelID };
