import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { HashRouter, Route } from 'react-router-dom';
import { AktiveBestillinger } from './components/aktiveBestillinger.js';
import { SykkelID } from './components/SykkelID.js';
import { Leieperiode } from './components/leieperiode.js';
import { BestillingDetails } from './components/bestillingDetails.js';
import { BestillingEdit } from './components/editBestilling.js';
import { Ekstrautstyr } from './components/ekstrautstyr.js';
import { Handlekurv } from './components/handlekurv.js';
import { Kunde } from './components/kunde.js';
import { Kundesøk } from './components/kundesok.js';
import { ProduktSykkel } from './components/produktSykkel.js';
import { ProduktUtstyr } from './components/produktUtstyr.js';
import { RegistrerKunde } from './components/registrerKunde.js';
import { Sykkel } from './components/sykkel.js';
import { Pakketilbud } from './components/pakker.js';
import { Pakkevisning } from './components/pakkevisning.js';
import Login from './components/login';
import Home from './components/home';
import Menu from './components/menu';
import Sidenav from './components/sidenav';

import { createHashHistory } from 'history';
export const history = createHashHistory();

ReactDOM.render(
  <HashRouter>
    <div
      className="container-fluid"
      style={{ overflow: 'hidden', position: 'fixed', bottom: '0', left: '0', height: '100%' }}
    >
      <div className="row">
        <div className="col-12" style={{ width: '100%', paddingLeft: '0px', paddingRight: '0px' }}>
          <Menu />
        </div>
      </div>

      <div className="row" style={{ height: '100%', paddingBottom: '96px' }}>
        <Sidenav />
        <div className="col-md-10" style={{ overflowX: 'hidden', overflowY: 'scroll', borderTop: '1px solid #c9dbdb' }}>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/aktivebestillinger" component={AktiveBestillinger} />
          <Route exact path="/aktivebestillinger/:bestilling_id" component={BestillingDetails} />
          <Route exact path="/aktivebestillinger/:bestilling_id/edit" component={BestillingEdit} />
          <Route exact path="/SykkelID" component={SykkelID} />
          <Route exact path="/leieperiode" component={Leieperiode} />
          <Route exact path="/kunde" component={Kunde} />
          <Route exact path="/kundesøk" component={Kundesøk} />
          <Route exact path="/registrerKunde" component={RegistrerKunde} />
          <Route exact path="/sykkel" component={Sykkel} />
          <Route exact path="/sykkel/:id" component={ProduktSykkel} />
          <Route exact path="/ekstrautstyr" component={Ekstrautstyr} />
          <Route exact path="/ekstrautstyr/:id" component={ProduktUtstyr} />
          <Route exact path="/handlekurv" component={Handlekurv} />
          <Route exact path="/pakker" component={Pakketilbud} />
          <Route exact path="/pakker/:pakke_id" component={Pakkevisning} />
        </div>
      </div>
    </div>
  </HashRouter>,
  document.getElementById('root')
);
