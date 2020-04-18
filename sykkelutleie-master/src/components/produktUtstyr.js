import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, Row, Column, Button } from '../widgets';
import { history } from '../index.js';
import { utstyrService } from '../services/UtstyrService.js';
import ReactLoading from 'react-loading';
import { cartService } from '../services/CartService.js';
import varsel from '../services/notifications.js';

class ProduktUtstyr extends Component {
  utstyr = null;
  avdeling = null;
  antall = 1;

  render() {
    if (!this.utstyr || !this.avdeling)
      return (
        <ReactLoading className="spinner fade-in" type="spinningBubbles" color="lightgrey" height="20%" width="20%" />
      );

    return (
      <div>
        {/* Visning av et enkelt produkt (ekstrautstyr)*/}
        <br />
        <Card>
          <div className="container-fluid">
            <div className="row">
              <div className="col-3 brBottom">
                <img
                  style={{ width: '250px', height: '250px', marginTop: '30px', marginLeft: '15px', opacity: '1.0' }}
                  src={'images/utstyr/' + this.utstyr.navn + '.jpg'}
                />
              </div>
              <div className="col-9">
                {' '}
                <h4 style={{ marginLeft: '35px' }}>{this.utstyr.navn}</h4>
                <div className="ramme">
                  <ul className="brBottom" style={{ listStyleType: 'none' }}>
                    <h5>Produktinformasjon: </h5>
                    <li className="PrisText">Pris: {this.utstyr.pris} kr,-</li>
                    <li>
                      <b>Lagerstatus: {this.utstyr.antall}</b>
                    </li>
                    <li>
                      <div className="input_div">
                        <input
                          type="number"
                          className="kundeinput"
                          size="25"
                          value={this.antall}
                          id="count"
                          style={{ marginRight: '20px' }}
                          onFocus={event => {
                            event.target.value = null;
                          }}
                          onBlur={event => {
                            if (event.target.value.length == 0) {
                              this.endreAntall('', this.antall);
                            }
                          }}
                          onChange={() => {
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
                    <li>{this.avdeling.navn}</li>
                  </ul>
                </div>
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
      </div>
    );
  }

  mounted() {
    utstyrService.getUtstyrNavn(this.props.match.params.id, utstyr => {
      this.utstyr = utstyr;
      if (this.utstyr.antall == 0) {
        this.antall = 0;
      }
    });

    utstyrService.getAvdelingNavn(this.props.match.params.id, avdeling => {
      this.avdeling = avdeling;
    });

    if (cartService.getStartdato() == null) {
      varsel('OBS!', 'Leieperiode er ikke valgt', 'vrsl-danger');
    }
    if (cartService.getAvdeling() == -1) {
      varsel('OBS!', 'Avdeling er ikke valgt', 'vrsl-danger');
    }
  }

  endreAntall(dir, inp) {
    let max = this.utstyr.antall;
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
    history.push('/ekstrautstyr');
  }

  add() {
    if (cartService.getStartdato() != null && cartService.getAvdeling() != null && this.antall != 0) {
      let produkt = {
        kategori: 'utstyr',
        id: this.utstyr.utstyr_id,
        navn: this.utstyr.navn,
        antall: this.antall,
        pris: this.utstyr.pris * this.antall
      };
      cartService.addItem(produkt);
      varsel('Suksess!', 'Produktet ble lagt til i handlekurven.', 'vrsl-success');
      history.push('/ekstrautstyr');
    } else {
      if (cartService.getStartdato() == null) {
        varsel('Feil!', 'Leieperiode er ikke valgt', 'vrsl-danger');
      }
      if (cartService.getAvdeling() == -1) {
        varsel('Feil!', 'Avdeling er ikke valgt', 'vrsl-danger');
      }
      if (this.antall == 0) {
        varsel('Feil!', 'Du kan ikke legge til 0 varer', 'vrsl-danger');
      }
    }
  }
}

export { ProduktUtstyr };
