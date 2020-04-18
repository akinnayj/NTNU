// Funksjon for å kommunisere til brukeren via varsler
export default function varsel(tittel, melding, type) { // type må enten være "vrsl-success" eller "vrsl-danger"!
  var closed = 'false';
  const body = document.getElementsByTagName('body')[0];
  const sjekk = document.querySelector('.vrsl-container');
  var container = null;
  if (sjekk != null) { // Sjekker om det allerede er laget en varsel-container.
    container = sjekk;
  } else {
    container = document.createElement('div');
    container.className = 'vrsl-container';
    body.appendChild(container);
  }

  const vrsl = document.createElement('div');
  vrsl.className = 'vrsl ' + type;
  container.appendChild(vrsl);

  const ttl = document.createElement('div');
  ttl.className = 'vrsl-tittel';
  ttl.innerText = tittel;
  vrsl.appendChild(ttl);
  const mld = document.createElement('div');
  mld.className = 'vrsl-melding';
  mld.innerText = melding;
  vrsl.appendChild(mld);

  // Fjerner varselet etter en bestemt tid, dersom den ikke er klikket bort allerede
  setTimeout(() => {
    if (closed == 'false') {
      container.removeChild(vrsl);
    }
  	}, 5000);

  container.onclick = function(){
    container.removeChild(vrsl);
    closed = 'true';
  };
}
