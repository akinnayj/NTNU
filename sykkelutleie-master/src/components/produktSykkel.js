import * as React from 'react';
import { Component } from 'react-simplified';
import { sykkelService } from '../services/SykkelService.js';
import { Card, Row, Column, Button } from '../widgets';
import { history } from '../index.js';
import ReactLoading from 'react-loading';
import { cartService } from '../services/CartService.js';
import varsel from '../services/notifications.js';

class ProduktSykkel extends Component {
  type = null;
  klasse = null;
  antall = 1;
  startdato = null;
  sluttdato = null;
  avdeling = null;
  ledigeSykler = [];

  render() {
    if (!this.type || !this.klasse)
      return (
        <ReactLoading className="spinner fade-in" type="spinningBubbles" color="lightgrey" height="20%" width="20%" />
      );

    return (
      <div>
        {/* Visning av et enkelt produkt (sykler)*/}
        <br />
        <Card>
          <div className="container-fluid">
            <div className="row">
              <div className="col-3">
                <img
                  style={{ width: '250px', height: '250px', marginTop: '30px', marginLeft: '15px', opacity: '1.0' }}
                  src={'images/sykler/' + this.klasse.klassenavn + '.jpg'}
                />
              </div>
              <div className="col-9">
                {' '}
                <h4 style={{ marginLeft: '35px' }}>{this.type.typenavn}</h4>
                <div className="ramme">
                  <ul style={{ listStyleType: 'none' }}>
                    <h5>Produktinformasjon: </h5>
                    <li>{this.klasse.klassenavn}</li>
                    <li className="PrisText">Pris: {this.type.pris} kr,-</li>
                    <br />
                    <div className="borderShadow">
                      <li>{this.klasse.info}</li>
                    </div>
                    <br />
                    <h5>Detaljer: </h5>
                    <li>Girsystem: {this.type.girsystem}</li>
                    <li>Rammestørrelse: {this.type.ramme_storrelse} </li>
                    <li>Hjulstørrelse: {this.type.hjul_storrelse}</li>
                    <br />
                    <li />
                    <b>Lagerstatus: {this.ledigeSykler.length}</b>

                    <li>
                      <div className="input_div">
                        <input
                          type="number"
                          className="kundeinput"
                          size="25"
                          id="count"
                          value={this.antall}
                          style={{ marginRight: '20px' }}
                          onFocus={event => {
                            event.target.value = null;
                          }}
                          onBlur={event => {
                            if (event.target.value.length == 0) {
                              this.endreAntall('', this.antall);
                            }
                          }}
                          onChange={event => {
                            this.endreAntall('', event.target.value);
                          }}
                        />
                        <Button.Info
                          onClick={() => {
                            this.endreAntall('minus');
                          }}
                        >
                          -
                        </Button.Info>
                        <Button.Info
                          onClick={() => {
                            this.endreAntall('pluss');
                          }}
                        >
                          +
                        </Button.Info>
                      </div>
                    </li>
                  </ul>
                </div>
                <br />
              </div>
            </div>
          </div>
        </Card>
        <br />

        <div className="col-8">
          <Row>
            <Column left>
              <Button.Light onClick={this.back}>Tilbake</Button.Light>
            </Column>

            <Column right>
              <Button.Success onClick={this.add}>Legg til bestilling</Button.Success>
            </Column>
          </Row>
        </div>
        <br />
      </div>
    );
  }
  mounted() {
    sykkelService.getAltOmSykkel(this.props.match.params.id, type => {
      this.type = type;
    });

    sykkelService.getKlasser(this.props.match.params.id, klasse => {
      this.klasse = klasse;
    });

    this.sluttdato = cartService.getSluttdato();
    this.startdato = cartService.getStartdato();
    this.avdeling = cartService.getAvdeling();

    if (this.sluttdato != null && this.avdeling != -1) {
      sykkelService.getLedigeSykler(
        this.props.match.params.id,
        this.startdato,
        this.sluttdato,
        this.avdeling,
        ledige => {
          this.ledigeSykler = ledige;

          if (ledige.length == 0) {
            this.antall = 0;
          }
        }
      );
    } else {
      this.antall = 0;
      if (this.sluttdato == null) {
        varsel('OBS!', 'Leieperiode er ikke valgt', 'vrsl-danger');
      }
      if (this.avdeling == -1) {
        varsel('OBS!', 'Avdeling er ikke valgt', 'vrsl-danger');
      }
    }
  }

  endreAntall(dir, inp) {
    let max = this.ledigeSykler.length;
    switch (dir) {
      case 'pluss':
        if (this.antall < max) {
          this.antall++;
        }
        break;
      case 'minus':
        if (this.antall > 1) {
          this.antall--;
        }
        break;
      default:
        //dersom brukeren skriver inn tall manuelt
        if (max == 0) {
          this.antall = 0;
        } else if (inp < 1) {
          this.antall = 1;
        } else if (inp > max) {
          this.antall = max;
        } else {
          this.antall = inp;
        }
    }
  }

  back() {
    history.push('/sykkel');
  }

  add() {
    if (this.sluttdato != null && this.avdeling != null && this.antall != 0) {
      let produkt = {
        kategori: 'sykkel',
        id: this.type.type_id,
        navn: this.type.typenavn,
        antall: this.antall,
        pris: this.type.pris * this.antall,
        id: this.ledigeSykler.slice()
      };
      cartService.addItem(produkt);
      varsel('Suksess!', 'Produktet ble lagt til i handlekurven.', 'vrsl-success');
      history.push('/sykkel');
    } else {
      if (this.sluttdato == null) {
        varsel('Feil!', 'Leieperiode er ikke valgt', 'vrsl-danger');
      }
      if (this.avdeling == -1) {
        varsel('Feil!', 'Avdeling er ikke valgt', 'vrsl-danger');
      }
      if (this.antall == 0) {
        varsel('Feil!', 'Du kan ikke legge til 0 varer', 'vrsl-danger');
      }
    }
  }
}

export { ProduktSykkel };
