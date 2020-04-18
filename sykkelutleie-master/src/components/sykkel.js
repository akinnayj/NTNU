import * as React from 'react';
import { Component } from 'react-simplified';
import { sykkelService } from '../services/SykkelService.js';
import { Row, Column } from '../widgets';
import { history } from '../index.js';
import ReactLoading from 'react-loading';
import { cartService } from '../services/CartService';

class Sykkel extends Component {
  state = {
    alleSykkeltyper: [], //denne holder alle sykkeltypene
    sykkeltyper: null //denne holder alle sykkeltypene som skal vises
  };

  sorterMetode = [];
  valgtSortering = '';
  sykkelklasser = [];
  valgtKlassenavn = -1;
  valgtAvdeling = cartService.getAvdeling();

  render() {
    if (!this.state.sykkeltyper)
      return (
        <ReactLoading className="spinner fade-in" type="spinningBubbles" color="lightgrey" height="20%" width="20%" />
      );
    return (
      <div>
        {/*Skjema for søk og valg av sykkel*/}

        <br />
        <div className="col-md-4">
          <h4>Velg sykkel</h4>
        </div>
        <div>
          <br />

          <div className="container-fluid">
            <div className="row" style={{ marginLeft: '27px', marginRight: '50px' }}>
              <div className="col-6">
                <div className="form-group">
                  <select
                    id="sorter"
                    name="sorter"
                    className="form-control"
                    onChange={event => this.changeOrder(event)}
                  >
                    <option>Sorter etter</option>
                    {this.sorterMetode.map(metode => (
                      <option key={metode[1]}>{metode[0]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-6">
                <div className="form-group">
                  <select
                    id="klassenavn"
                    name="klassenavn"
                    className="form-control"
                    onChange={event => this.changeContent(event)}
                  >
                    <option id={-1}>Sykkelklasse</option>
                    {this.sykkelklasser.map(klasse => (
                      <option key={klasse.klasse_id} id={klasse.klasse_id}>{klasse.klassenavn}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="img">
          <ul className="flex-container wrap" style={{ fontWeight: 'bold', textAlign: 'center' }}>
            {this.state.sykkeltyper.map(sykkel => (
              <li className="flex-item" key={sykkel.type_id}>
                <img
                  src={'images/sykler/' + sykkel.klassenavn + '.jpg'}
                  onClick={() => history.push('/sykkel/' + sykkel.type_id)}
                  alt={sykkel.typenavn}
                  width="180px"
                  height="180px"
                />
                <div style={{ overflow: 'hidden', width: '100%', height: '22.5px' }}>{sykkel.typenavn}</div>

                {'Pris: ' + sykkel.pris}

              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  mounted() {
    this.sorterMetode = sykkelService.getSykkelSorteringer();

    sykkelService.getSykkeltyper(typer => {
      this.setState({ alleSykkeltyper: typer });
      this.setState({ sykkeltyper: typer });
      this.makeChange();
    });

    sykkelService.getSykkelklasser(klasser => {
      this.sykkelklasser = klasser;
    });
  }

  changeOrder(event) {
    this.valgtSortering = event.target.value;
    sykkelService.sortSykkelsok(this.valgtSortering, this.state.sykkeltyper, sortert => {
      this.setState({ sykkeltyper: sortert });
    });
  }

  changeContent(event) {
    let sel = document.getElementById(event.target.id);
    let id = sel[sel.selectedIndex].id;
    this.valgtKlassenavn = id;
    this.makeChange();
  }
  makeChange(){
    sykkelService.visKlasse(this.valgtKlassenavn, this.state.alleSykkeltyper, utvalg1 => {
      sykkelService.visAvdeling(this.valgtAvdeling, utvalg1, utvalg2 => {
        sykkelService.sortSykkelsok(this.valgtSortering, utvalg2, sortert => {
          this.setState({ sykkeltyper: sortert });
        });
      });
    });
  }
}

export { Sykkel };
