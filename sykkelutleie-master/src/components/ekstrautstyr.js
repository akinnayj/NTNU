import * as React from 'react';
import { Component } from 'react-simplified';
import { sykkelService } from '../services/SykkelService.js';
import { utstyrService } from '../services/UtstyrService.js';
import { Row, Column } from '../widgets';
import { history } from '../index.js';
import ReactLoading from 'react-loading';
import { cartService } from '../services/CartService';

class Ekstrautstyr extends Component {
  state = {
    altUtstyr: [],
    utstyr: null
  };
  valgtAvdeling = cartService.getAvdeling();
  valgtKomp = '';
  valgtSortering = '';
  sorteringer = [];
  sykkelklasser = [];


  render() {
    if (!this.state.utstyr)
      return (
        <ReactLoading className="spinner fade-in" type="spinningBubbles" color="lightgrey" height="20%" width="20%" />
      );
    return (
      <div>
        {/*
    Skjema for søk og valg av ekstrautstyr
    */}

        <br />
        <div className="col-md-4">
          <h4>Velg ekstrautstyr</h4>
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
                    <option value="">Sorter etter</option>
                    {this.sorteringer.map(metode => (
                      <option key={metode[1]}>{metode[0]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-6">
                <div className="form-group">
                  <select
                    id="kompatibel"
                    name="kompatibel"
                    className="form-control"
                    onChange={event => this.changeContent(event)}
                  >
                    <option value="">Kompatibel med</option>
                    {this.sykkelklasser.map(klasse => (
                      <option key={klasse.klasse_id}>{klasse.klassenavn}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="img">
          <ul className="flex-container wrap" style={{ fontWeight: 'bold', textAlign: 'center' }}>
            {this.state.utstyr.map(utstyr => (
              <li key={utstyr.utstyr_id} className="flex-item">
                <img
                  src={'images/utstyr/' + utstyr.navn + '.jpg'}
                  onClick={() => history.push('/ekstrautstyr/' + utstyr.utstyr_id)}
                  alt={utstyr.navn}
                  width="180px"
                  height="180px"
                />
                {utstyr.navn}
                <br />
                {utstyr.pris + ' kr'}
                <br />
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  mounted() {
    utstyrService.getUtstyr(utstyr => {
      this.setState({ altUtstyr: utstyr });
    //  this.setState({ utstyr: utstyr });
      this.makeChange();
    });

    sykkelService.getSykkelklasser(result => {
      this.sykkelklasser = result;
    });

    this.sorteringer = utstyrService.getSorteringer();
  }

  changeOrder(event) {
    //endre rekkefølgen på utstyret
    this.valgtSortering = event.target.value;
    utstyrService.sortUtstyrsok(this.valgtSortering, this.state.utstyr, sortert => {
      this.setState({ utstyr: sortert });
    });
  }

  changeContent(event) {
        this.valgtKomp = event.target.value;
        this.makeChange();
  }

  makeChange(){
    utstyrService.visKompatibel(this.valgtKomp, this.state.altUtstyr, utvalg1 => {
      utstyrService.visAvdeling(this.valgtAvdeling, utvalg1, utvalg2 => {
        utstyrService.sortUtstyrsok(this.valgtSortering, utvalg2, sortert => {
          this.setState({ utstyr: sortert });
        });
      });
    });
  }
}
export { Ekstrautstyr };
