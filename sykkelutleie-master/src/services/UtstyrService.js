import { connection } from '../mysql_connection';
import { sykkelService } from '../services/SykkelService.js'; //for å få tak i sykkelklassene
import varsel from './notifications.js';

class UtstyrService {
  getUtstyr(success) {
    connection.query(
      'SELECT u.*, a.navn AS "avdelingsnavn" FROM UTSTYR u, AVDELING a  WHERE u.avdeling_id = a.avdeling_id',
      (error, results) => {
        if (error) {
          varsel("Oops!", "Det oppsto problemer med å hente data.", "vrsl-danger");
          return console.error(error);
        }

        success(results);
      }
    );
  }
  getUtstyralle(success) {
    connection.query('SELECT navn FROM UTSTYR', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  getUtstyrNavn(utstyr_id, success) {
    connection.query('SELECT * FROM UTSTYR WHERE utstyr_id=?', [utstyr_id], (error, results) => {
      if (error) return console.error(error);

      success(results[0]);
    });
  }

  getKompUtstyrliste(klasse, success) {
    connection.query(
      'select opp.utstyr_id from OPPSETT opp, KLASSE kl where kl.klasse_id = opp.klasse_id and kl.klassenavn = ? ',
      [klasse],
      (error, results) => {
        if (error) return console.error(error);
        success(results);
      }
    );
  }

  getAvdelinger(success) {
    connection.query('select * from AVDELING', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  getAvdelingNavn(utstyr_id, success) {
    connection.query(
      'SELECT a.* from AVDELING a, UTSTYR u  WHERE a.avdeling_id=u.avdeling_id AND utstyr_id=?',
      [utstyr_id],
      (error, results) => {
        if (error) return console.error(error);
        success(results[0]);
      }
    );
  }
  getSorteringer() {
    let options = [];
    options[0] = ['Alfabetisk A-Z', 'alfAZ'];
    options[1] = ['Alfabetisk Z-A', 'alfZA'];
    options[2] = ['Pris, lav-høy', 'prisLH'];
    options[3] = ['Pris, høy-lav', 'prisHL'];
    return options;
  }

  sortUtstyrsok(metode, arr, success) {
    if (metode.length == 0) {
      success(arr);
      return;
    }
    let index, r1, r2;
    let mulighet = this.getSorteringer();
    let nyArr = [];
    switch (metode) {
      case mulighet[0][0]: //alfabetisk A-Z
        index = 'navn';
        r1 = -1;
        r2 = 1;
        break;
      case mulighet[1][0]: //alfabetisk Z-A
        index = 'navn';
        r1 = 1;
        r2 = -1;
        break;
      case mulighet[2][0]: //pris lav-høy
        index = 'pris';
        r1 = -1;
        r2 = 1;
        break;
      case mulighet[3][0]: //pris høy-lav
        index = 'pris';
        r1 = 1;
        r2 = -1;
    }
    nyArr = arr.sort(sorteringfunk);
    success(nyArr);

    function sorteringfunk(a, b) {
      //brukes for å sortere array med array
      if (a[index] < b[index]) {
        return r1;
      } else if (a[index] > b[index]) {
        return r2;
      }
      return 0;
    }
  }

  visAvdeling(avdeling_id, arrInn, success) {
    avdeling_id = parseInt(avdeling_id);
    if (avdeling_id == -1) {
      success(arrInn);
      return;
    }
    let arr = arrInn.slice(); //lager en klone av arrayen for ikke å endre den originale
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i].avdeling_id !== avdeling_id) {
        arr.splice(i, 1);
      }
    }
    success(arr);
  }

  visKompatibel(klasse, arrInn, success) {
    if (klasse.length == 0) {
      success(arrInn);
      return;
    }

    let arr = arrInn.slice(); //lager en klone av arrInn

    this.getKompUtstyrliste(klasse, liste => {
      //gir en liste med alt kompatibelt utstyr

      for (let i = arr.length - 1; i >= 0; i--) {
        //sjekker utstyret i arr opp mot listen
        let found = false;
        for (let k = liste.length - 1; k >= 0; k--) {
          if (arr[i].utstyr_id === liste[k].utstyr_id) {
            found = true;
          }
        }
        if (!found) {
          arr.splice(i, 1);
        }
      }
      success(arr);
    });
  }
}

export let utstyrService = new UtstyrService();
