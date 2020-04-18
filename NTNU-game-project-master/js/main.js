
//-------------Globale variabler--------------
let storyline = "c";//styrer historiens gang
let mTextProg = 0;//holder styr på progresjonen i hovedteksten
//-------------------------------------------

setupMain();
proceedStory();
function setupMain() {
  document.getElementById("opt1").onclick = () => proceedStory(1);
  document.getElementById("opt2").onclick = () => proceedStory(2);
}

function proceedStory(dir) {//dir er 1/2 og bestemmer historiens retning
  if(dir !== undefined){
    dir = dir.toString();
    storyline+= dir;
  }
  //Definerer kilden til JSON-filen.
  var jsonURL = "textfiles/storytext.json";
  //XMLHttpRequest for å hente ut innhold fra JSON-filen.
  var jsonhttp = new XMLHttpRequest();
  //Funksjonen kjøres dersom readyState er 4 ('DONE') og status er 200 ('OK').
  jsonhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
            var jsonData = JSON.parse(this.responseText);
            getThisStoryOut(jsonData);
      }
  };
  jsonhttp.open("GET", jsonURL, true);
  jsonhttp.send();
}

//etter en xmlhttprequest
function getThisStoryOut(object) {
    let main = object[storyline]["main"];
    let opt1 = object[storyline]["opt1"];
    let opt2 = object[storyline]["opt2"];
    let img = object[storyline]["img"];
    let game = object[storyline]["spill"];

    if(img == undefined){//passer på at det alltid er et bakgrunnsbilde
      img = "img/udef1.jpg";
    }else{
      img = "img/" + img;
    }
    document.getElementById("gamecontainer").style.backgroundImage = "url("+img+")";
    //hovedteksten behandles før den vises til brukeren
    mTextProg = 0;
    document.getElementById("storyBox").onclick = () => {pageviewMain(main);};
    pageviewMain(main);

    //behandling av valgmulighetene til brukeren
    let opt1D = document.getElementById("opt1");
    let opt2D = document.getElementById("opt2");

      opt1D.innerText = opt1;
      opt2D.innerText = opt2;
    if(game != undefined){
      opt1D.onclick = () => proceedToGame(game);
      opt2D.onclick = () => proceedToGame(game);
    }else if(opt1 == "Game over"){
      storyline = "";
      opt1D.onclick = () => proceedToGame("mainstory","c");
      opt2D.onclick = () => proceedToGame("mainstory","c");
    }
}

//viser deler av/hele hovedteksten til brukeren avhengig av lengden til teksten
function pageviewMain(main) {
  let txtLim = 400;//begrensningen på lengden
  if(main.length > mTextProg){//sjekker om det er mer igjen å vise av teksten
    let cutEnd = (mTextProg+txtLim) >= main.length ? main.length : main.indexOf(" ", mTextProg+txtLim);
    let nPart = main.slice(mTextProg, cutEnd);
    mTextProg = cutEnd;
    let more = main.length > mTextProg ? "... <br>-<b>Klikk for mer</b>-" : "";
    document.getElementById("mainText").innerHTML = nPart + more;
  }
}

function proceedToGame(game, dir) {
  game = game.toLowerCase();
  let link = "textfiles/" + game + ".txt";

  //XMLHttpRequest for å hente ut innhold fra JSON-filen.
  let xhttp = new XMLHttpRequest();
  //Funksjonen kjøres dersom readyState er 4 ('DONE') og status er 200 ('OK').
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
            let data = this.responseText;
            document.getElementById("gamecontainer").innerHTML = data;
            switch (game) {//velger hvilen del av spillet som skal kjøres
              case "yatzy":
                setupYat();
                break;
              case "tictactoe":
                setupTic();
                break;
              case "hangman":
                document.getElementById("gamecontainer").style.backgroundImage = "url(img/hangmanBack.jpg)";
                setupHang();
                break;
              case "mainstory":
                setupMain();
                proceedStory(dir);

            }
      }
  };
  xhttp.open("GET", link, true);
  xhttp.send();
}
