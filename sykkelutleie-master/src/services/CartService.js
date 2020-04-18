//import { connection } from '../mysql_connection';
import varsel from '../services/notifications.js';

class CartService{
  constructor(){
    this.handlekurv = [];
    this.startdato = null;//startdato for leieforholdet
    this.sluttdato = null;//sluttdato for leieforholdet
    this.kunde = null;//ansvarlig kunde,
    this.gruppe = {gruppe_id:null};//tilknyttet gruppe // FIXME: gjør det mulig å velge gruppe, eller fjern med antagelse om annen løsning
    this.beskrivelse = "KOMMENTAR FRA SERCIVE";//beskrivelse/kommentar til bestillingen // FIXME: gjør det mulig å legge til en kommentar/beskrivelse
    this.status = {status_id: 1, tilstand: 'OK'};// FIXME: gjør det mulig å velge status
    this.antDager = null;
    this.avdeling = -1;// FIXME: endre til null
    this.isLoggedInn = false;
  }

  getIsLoggedInn(){
    return this.isLoggedInn;
  }

  getHandlekurv(){
    return this.handlekurv;
  }

  getStartdato(){
    return this.startdato;
  }

  getSluttdato(){
    return this.sluttdato;
  }

  getKunde(){
    return this.kunde;
  }

  getGruppe(){
    return this.gruppe;
  }

  getBeskrivelse(){
    return this.beskrivelse;
  }

  getStatus(){
    return this.status;
  }

  getAntDager(){
    return this.antDager;
  }

  getAvdeling(){
    return this.avdeling;
  }

  setIsLoggedInn(bool){
    this.isLoggedInn = bool;
  }

  setStartdato(dato){
    this.startdato = dato;
  }

  setSluttdato(dato){
    this.sluttdato = dato;
  }

  setKunde(kunde){
    this.kunde = kunde;
    varsel("Suksess!", "Kunden er valgt", "vrsl-success");
  }

  setGruppe(gruppe){
    this.gruppe = gruppe;
  }

  setStatus(status){
    this.status = status;
  }

  setBeskrivelse(text){
    this.beskrivelse = text;
  }

  setAntDager(antDager){
    this.antDager = antDager;
  }

  setAvdeling(avd){
    this.avdeling = avd;
  }

  dropOrder(){//sletter all bestillingsdata
    this.handlekurv = [];
    this.handlekurv = [];
    this.startdato = null;
    this.sluttdato = null;
    this.antDager = null;
    this.kunde = null;
  }

  alterCart(){//index i arrayen,// FIXME: fjern?

  }

  dropItem(index){//fjern en vare fra handlekurven
    this.handlekurv.splice(index, 1);
  }

  addItem(item){//legg til et produkt i handlekurven
    this.handlekurv.push(item);
  }
}

export let cartService = new CartService();
