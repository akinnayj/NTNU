import { connection } from '../mysql_connection';
import varsel from './notifications.js';
import {cartService} from './CartService';
import { history } from '../index.js';

class LoginService {
  login(name, psw, success){
    connection.query(
      'select p.fornavn, p.etternavn, a.avdeling_id from PERSON p, ANSATT a where p.person_id = a.person_id AND a.brukernavn LIKE ? AND a.passord LIKE ?',
      [name,psw],
      (error, results) => {
        if (error) {
          varsel("FEIL!", "Skriv inn brukernavn og passord", "vrsl-danger");
          return console.error(error);
        }
        console.log("---LoginService------");
        console.log(results[0].avdeling_id);
        if(results.length <= 0){
            varsel("FEIL!", "Feil brukernavn eller passord", "vrsl-danger");
            success(false);
            return;
        }
        varsel("Suksess!", "Du er nå logget inn", "vrsl-success");
        cartService.setIsLoggedInn(true);
        cartService.setAvdeling(results[0].avdeling_id);
        success(true);
      }
    );
  }
  logout(){
    cartService.setIsLoggedInn(false);
    document.querySelector("div#loginCover").classList.remove('js-hidden');
    history.push('/login');
  }
}

export let loginService = new LoginService();
