//--------------GLOBALE VARIABLER----------------------------------//
let soulutionHang;//løsningsordet
let usedLettersHang = [];//oversikt over brukte bokstaver
let theWordHang = [];//hintet som kommer opp på canvas
let lifeCountHang = 10;
let guessedRightHang = false;
let positionOfWordsHang = {//nyttes i utskriften av ordet til canvas
  x: 10,
  y: 410
};
let ctx;
//--------------------------------------------------------------//

function setupHang() {
  //gjett bokstav ved å trykke ENTER eller klikke på knappen
  document.getElementById("guessbtn").onclick = userMoveHang;
  document.addEventListener("keydown", keyDownHang);
  //velger et ord fra arrayen words
  let words = [
    "middelalder","mjød","økseskaft","drage","norrøn",
    "viking","seilskip","sverd","skjold","tokt"
  ];
  soulutionHang = words[Math.floor(Math.random() * words.length)];

  //skriver ut " _ " på canvaset som et hint til løsningen
  for(let i = 0; i < soulutionHang.length; i++){
    theWordHang[i] = " _ ";
  }
  let canvas = document.getElementById("canvasHang");
  ctx = canvas.getContext("2d");
  ctx.font = "30px Comic Sans MS";
    ctx.fillText(
      theWordHang.join(""),
      positionOfWordsHang.x,
      positionOfWordsHang.y
    );
  }

function keyDownHang(event) {//gjett bokstav ved å trykke på ENTER
  if (event.keyCode === 13) {
    userMoveHang();
  }
}

function userMoveHang() {//behandler input fra bruker
  let alphabet = [
    "a","b","c","d","e","f","g","h","i","j","k","l",
    "m","n","o","p","q","r","s","t","u","v","w","x",
    "y","z","æ","ø","å"
  ];

  let guess = document.getElementById("userInput").value.toLowerCase();
  if (guess.length == 0 || guess.length > 1 ||//input er for langt/kort
      alphabet.indexOf(guess) == -1 ||//ikke tillat tegn
      usedLettersHang.indexOf(guess) != -1//bokstaven er allerede gjettet
  ) {
      let notAvailable = document.getElementById("notAvailable");
      notAvailable.innerText = "Vennligst skriv ny bokstav!";
      setTimeout(function() {notAvailable.innerHTML = "&nbsp";}, 5000);
  } else {
      usedHang();
      guessedRightHang = false;
      let i = 0;
      while (true) {//søker gjennom ordet med brukerinput
        let pos = soulutionHang.indexOf(guess, i);
        if (pos !== -1) {//nåværende posisjon stemmer med brukerinput
          i = pos + guess.length;
          guessedRightHang = true;
          theWordHang[pos] = " " + guess + " ";
        } else if (guessedRightHang) {
          //bokstaven var del av ordet
          break;
        } else {
          //bokstaven er ikke til stede i ordet
          lifeCountHang--;
          break;
        }
      }
  }
  updateUIHang();
}

function usedHang() {//lagrer brukt bokstav og skriver det ut til brukeren
  let letter = document.getElementById("userInput").value.toLowerCase();
  usedLettersHang.push(letter);
  document.getElementById("userInput").value = "";
  document.getElementById("usedLetters").innerText = usedLettersHang.join(" ");
}

//oppdaterer UI, canvas og lifecount
function updateUIHang() {
  if (guessedRightHang) {//viser gjettet bokstav på canvas
    ctx.clearRect(0, 380, 600, 100);
    ctx.font = "30px Comic Sans MS";
    ctx.fillText(
      theWordHang.join(""),
      positionOfWordsHang.x,
      positionOfWordsHang.y
    );
    if (theWordHang.indexOf(" _ ") === -1) {
      clearEventsHang();
      setTimeout(winHang, 2000);
    }
  } else {
    document.getElementById("lifeCountHang").innerText = lifeCountHang;
    drawManHang();
  }
  document.getElementById("userInput").value = "";
}

//Dersom en vinner, viser bilde og sender deg videre
function winHang() {
  ctx.clearRect(0, 0, 800, 600);
  let img = new Image();
  img.src = "img/winHang.png";
  img.onload = function() {
  ctx.drawImage(img, 50, -25);
  };
  setTimeout(function(){proceedToGame("mainstory", 2);},2000);
}

  //Dersom en taper, viser bilde og sender deg videre
  function looseHang() {
    ctx.clearRect(0, 0, 800, 600);
    let img = new Image();
    img.src = "img/looseHang.png";
    img.onload = function() {
      ctx.drawImage(img, 50,-25);
    };
    setTimeout(function(){proceedToGame("mainstory", 1);}, 2000);
  }

  //tenging på canvaset
  function drawManHang() {
      ctx.beginPath();
      switch (lifeCountHang) {
        case 9: //bunnen
          ctx.arc(420, 520, 200, 1.25 * Math.PI, 1.75 * Math.PI);
          break;
        case 8: //midten
          ctx.rect(340, 70, 10, 300);
          break;
        case 7: //toppen + støttebjelke
          ctx.rect(340,70,160,10);
          ctx.save();
            ctx.translate(340,120);
            ctx.rotate(-45*Math.PI/180);
            ctx.rect(0,0,70,7.5);
          ctx.restore();
          break;
        case 6: //henger
          ctx.moveTo(500, 70);
          ctx.lineTo(500, 120);
          break;
        case 5: //hodet
          ctx.arc(500, 140, 25, 0, 2 * Math.PI);
          break;
        case 4: //kroppen
          ctx.moveTo(500, 165);
          ctx.lineTo(500, 250);
          break;
        case 3: //høyre arm
          ctx.moveTo(500, 175);
          ctx.lineTo(525, 225);
          break;
        case 2: //venstre arm
          ctx.moveTo(500, 175);
          ctx.lineTo(475, 225);
          break;
        case 1: //venstre bein
          ctx.moveTo(500, 250);
          ctx.lineTo(480, 305);
          break;
        case 0: //Høyre bein + avslutt spill
          ctx.moveTo(500, 250);
          ctx.lineTo(520, 305);
          clearEventsHang();
          setTimeout(looseHang, 2000);
      }
    ctx.fill();
    ctx.stroke();
  }

function clearEventsHang() {//hindrer brukeren i å gjøre noe etter spillets slutt
  document.getElementById("userInput").disabled = true;
  document.getElementById("guessbtn").disabled = true;
  document.removeEventListener("keydown", keyDownHang);
  //tilbakestiller globale variabler
  usedLettersHang = [];
  theWordHang = [];
  lifeCountHang = 10;
}
