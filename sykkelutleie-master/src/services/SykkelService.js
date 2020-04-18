import { connection } from '../mysql_connection';
import varsel from './notifications.js';

class SykkelService {
  getAvdelinger(success) {
    connection.query('select * from AVDELING', (error, results) => {
      if (error) {
        varsel('Oops!', 'Det oppsto problemer med å hente data.', 'vrsl-danger');
        return console.error(error);
      }
      success(results);
    });
  }

  getSykkeltyper(success) {
    connection.query(
      'SELECT s.*, kl.klassenavn FROM SYKKELTYPE s, KLASSE kl  WHERE s.klasse_id = kl.klasse_id',
      (error, results) => {
        if (error) return console.error(error);
        success(results);
      }
    );
  }

  getSykkel(metode, navn, type, success) {
    switch (metode) {
      case 'navn':
        connection.query('select * from SYKKEL where navn like ?', [navn], (error, results) => {
          if (error) return console.error(error);

          success(results);
        });
        break;
      case 'type':
        connection.query('select * from SYKKEL where type like ?', [type], (error, results) => {
          if (error) return console.error(error);

          success(results);
        });
    }
  }

  getSykkelklasser(success) {
    connection.query('select * from KLASSE', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  getAltOmSykkel(type_id, success) {
    connection.query(
      'select typenavn, hjul_storrelse, ramme_storrelse, girsystem, klasse_id, pris FROM SYKKELTYPE WHERE type_id=?',
      [type_id],
      (error, results) => {
        if (error) return console.error(error);
        success(results[0]);
      }
    );
  }

  getKlasser(type_id, success) {
    connection.query(
      'SELECT klassenavn, info FROM KLASSE k, SYKKELTYPE s WHERE s.klasse_id = k.klasse_id AND type_id=?',
      [type_id],
      (error, results) => {
        if (error) return console.error(error);
        success(results[0]);
      }
    );
  }

  getLedigeSykler(type_id, start, slutt, avdeling_id, success) {
    //gir ledige sykkelid-er basert på sykkeltype
    let opptatt = [];
    let mulige = [];
    connection.query(
      'SELECT  SYKKEL.sykkel_id, typenavn, leie_start, leie_slutt FROM SYKKELTYPE, SYKKEL, BESTILLING, INNHOLDSYKKEL WHERE SYKKEL.type_id = SYKKELTYPE.type_id AND BESTILLING.bestilling_id=INNHOLDSYKKEL.bestilling_id AND SYKKEL.sykkel_id=INNHOLDSYKKEL.sykkel_id AND SYKKEL.type_id = ? AND SYKKEL.status_id = 1 AND SYKKEL.avdeling_id = ? AND (leie_start BETWEEN ? AND ? OR  leie_slutt BETWEEN ? AND ?)',
      [type_id, avdeling_id, start, slutt, start, slutt],
      (error, res1) => {
        if (error) return console.error(error);
        this.opptatt = res1;

        connection.query(
          'SELECT sykkel_id FROM SYKKEL WHERE type_id = ? AND status_id = 1 AND avdeling_id = ? AND naa_avdeling_id = ?',
          [type_id, avdeling_id, avdeling_id],
          (error, res2) => {
            if (error) return console.error(error);
            this.mulige = res2;
            if (this.opptatt.length > 0) {
              for (let i = this.mulige.length - 1; i >= 0; i--) {
                //filtrer mulige sykler mot opptate sykler
                for (let k = this.opptatt.length - 1; k >= 0; k--) {
                  if (this.mulige[i].sykkel_id == this.opptatt[k].sykkel_id) {
                    this.mulige.splice(i, 1);
                  }
                }
              }
            }
            success(this.mulige); //retunere mulige sykkel_ider
          }
        );
      }
    );
  }

  getSykkelByID(sykkelid, success) {
    connection.query(
      'SELECT s.*, avd1.navn AS naa_navn, avd2.navn AS org_navn from SYKKEL s, AVDELING avd1, AVDELING avd2 where avd1.navn IN(SELECT avd1.navn where avd1.avdeling_id = s.naa_avdeling_id) AND s.sykkel_id = ? AND avd2.navn IN(SELECT avd2.navn where avd2.avdeling_id = s.avdeling_id)',
      [sykkelid],
      (error, results) => {
        if (error) {
          varsel('Oops!', 'Det oppsto problemer med å hente data.', 'vrsl-danger');
          return console.error(error);
        }
        if (results[0].info === null) {
          results[0].info = '';
        }
        success(results[0]);
      }
    );
  }

  updateSykkelByID(status, avdeling, sykkelid, info) {
    connection.query(
      'UPDATE SYKKEL SET status_id=?, naa_avdeling_id=?, info=? WHERE sykkel_id=?',
      [status, avdeling, info, sykkelid],
      (error, results) => {
        if (error) {
          varsel('Oops!', 'Det oppsto problemer med å hente data.', 'vrsl-danger');
          return console.error(error);
        }
        varsel('Suksess!', 'Sykkelen er oppdatert', 'vrsl-success');
      }
    );
  }

  getSykkelSorteringer() {
    let options = [];
    options[0] = ['Alfabetisk A-Z', 'alfAZ'];
    options[1] = ['Alfabetisk Z-A', 'alfZA'];
    options[2] = ['Pris, lav-høy', 'prisLH'];
    options[3] = ['Pris, høy-lav', 'prisHL'];
    return options;
  }

  sortSykkelsok(metode, arr, success) {
    //retuner en sortert array
    if (metode == 'Sorter etter') {
      //sender arr tilbake dersom ingen metode er valgt
      success(arr);
      return;
    }
    let index, r1, r2;
    let mulighet = this.getSykkelSorteringer();
    let nyArr = [];
    switch (metode) {
      case mulighet[0][0]: //alfabetisk A-Z
        index = 'typenavn';
        r1 = -1;
        r2 = 1;
        nyArr = arr.sort(sorteringfunk);
        break;
      case mulighet[1][0]: //alfabetisk Z-A
        index = 'typenavn';
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

  visKlasse(klasse_id, arrInn, success) {
    klasse_id = parseInt(klasse_id);
    if (klasse_id == -1) {
      success(arrInn);
      return;
    }
    let arr = arrInn.slice(); //lager en klone av arrayen for ikke å endre den originale
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i].klasse_id != klasse_id) {
        arr.splice(i, 1);
      }
    }
    success(arr);
  }

  visAvdeling(avdeling_id, arrInn, success) {
    avdeling_id = parseInt(avdeling_id);
    if (avdeling_id == -1) {
      success(arrInn);
      return;
    }
    let arr = arrInn.slice();

    connection.query(
      'select * from SYKKELTYPE where type_id IN (select type_id from SYKKEL where avdeling_id = ?)',
      [avdeling_id],
      (error, results) => {
        if (error) return console.error(error);

        for (let i = arr.length - 1; i >= 0; i--) {
          let found = false;
          let k = results.length - 1;

          while (k >= 0 && !found) {
            if (arr[i].type_id == results[k].type_id) {
              found = true;
            }
            k--;
          }

          if (!found) {
            arr.splice(i, 1);
          }
        }
        success(arr);
      }
    );
  }
}

export let sykkelService = new SykkelService();
