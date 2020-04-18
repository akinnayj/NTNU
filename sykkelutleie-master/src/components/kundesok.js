import * as React from 'react';
import { Component } from 'react-simplified';
import { kundeService } from '../services/KundeService.js';
import { cartService } from '../services/CartService.js';
import { history } from '../index.js';
import { Button, Row, Column } from '../widgets';
import Card from 'react-bootstrap/Card';
import ReactLoading from 'react-loading';
import confirmBox from '../services/confirmBox';
import varsel from '../services/notifications.js';

class Kundesøk extends Component {
  kunder = null;

  state = { sok: '', kategori: 'navn' };

  onInputChange = (event, data) => this.setState({ sok: event.target.value.toLowerCase() });
  onSelectChange = event => this.setState({ kategori: event.target.value });

  render() {
    if (!this.kunder)
      return (
        <ReactLoading className="spinner fade-in" type="spinningBubbles" color="lightgrey" height="20%" width="20%" />
      );
    const kunder = this.kunder.filter(kunde =>
      kunde[this.state.kategori]
        .toString()
        .toLowerCase()
        .includes(this.state.sok)
    );
    return (
      <div>
        {/* Søk etter registrerte kunder */}
        <br />
        <div className="col-md-12">
          <h4>Søk etter kunde</h4>
        </div>

        <div className="col-md-12">
          <br />
          <input
            type="text"
            className="shadow brRight kundeinput"
            name="sok"
            id="sok"
            placeholder="Søk i kundedatabasen"
            onChange={this.onInputChange}
          />
          <select id="kategori" className="shadow kundeinput" onChange={this.onSelectChange}>
            <option value="navn">Navn</option>
            <option value="mail">Epost</option>
            <option value="tlf">Telefon</option>
            <option value="adresse">Adresse</option>
            <option value="fodt">Fødselsdato</option>
          </select>
        </div>

        <div id="kunderesultat" style={{ padding: '12px', margin: '5px' }}>
          <div>
            {kunder.map(kunde => (
              <Card className="brBottom shadow" key={kunde.person_id}>
                <ul style={{ paddingTop: '15px' }}>
                  <li>Navn: {kunde.fornavn + ' ' + kunde.etternavn}</li>
                  <li>Mail: {kunde.mail}</li>
                  <li>Telefon: {kunde.tlf}</li>
                  <li>Adresse: {kunde.adresse + ' ' + kunde.post_nr + ' ' + kunde.sted}</li>
                  <li>Født: {this.formatDate(kunde.fodt)}</li>
                  <li>Kommentar: {kunde.kommentar}</li>
                </ul>
                <div>
                  <Row>
                    <Column right>
                      <Button.Success
                        onClick={() => {
                          this.velg(kunde);
                        }}
                      >
                        Velg Kunde
                      </Button.Success>
                    </Column>

                    <Column left>
                      <Button.Danger
                        onClick={() => {
                          this.slettKunde(kunde);
                        }}
                      >
                        Slett kunde
                      </Button.Danger>
                    </Column>
                  </Row>
                </div>
                <br />
              </Card>
            ))}
          </div>
        </div>

        <div className="col-md-12 brBottom">
          <Button.Light name="tilbake" onClick={this.tilbake}>
            Tilbake
          </Button.Light>
        </div>
      </div>
    );
  }
  mounted() {
    kundeService.getKunder(kunder => {
      this.kunder = kunder.map(kunde => ({
        ...kunde,
        navn: `${kunde.fornavn} ${kunde.etternavn}` // Slår sammen fornavn og etternavn for søkbarhet
      }));
    });
  }

  slettKunde(kunde) {
    confirmBox('Varsel', 'Ønsker du å slette ' + kunde.fornavn + ' ' + kunde.etternavn + '?', res1 => {
      if (res1 == 1) {
        kundeService.harKundeAktiveBestillinger(kunde.person_id, res2 => {
          if (!res2) {
            kundeService.erKundeAnsatt(kunde.person_id, res3 => {
              if (res3) {
                confirmBox(
                  'Varsel',
                  kunde.fornavn + ' ' + kunde.etternavn + ' er en ansatt, ønsker du å fortsette?',
                  res4 => {
                    if (res4 == 1) {
                      kundeService.removeKunde(kunde.person_id);
                      history.push('/kunde');
                    }
                  }
                );
              } else {
                kundeService.removeKunde(kunde.person_id);
                history.push('/kunde');
              }
            });
          } else {
            varsel('Feil!', 'Kan ikke slette kunde med aktive bestillinger', 'vrsl-danger');
          }
        });
      }
    });
  }

  velg(kunde) {
    cartService.setKunde(kunde);
    history.push('/sykkel');
  }

  tilbake() {
    history.push('/kunde');
  }
  formatDate(date) {
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
}

export { Kundesøk };
