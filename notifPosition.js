
(function() {
  'use strict';
  const ligne = "16";
  const titles = [
    "home", "account", "newcaptcha", "visatype", "appointmentcaptcha",
    "newappointment", "slotselection", "appselection", "applicantselection", "other"
  ];

  let part = window.location.href.split('/')[4];

  if (part && part.toLowerCase() === "appointment") {
    const nextPart = window.location.href.split('/')[5] || "";
    part = nextPart.split('?')[0];
  } else if (part) {
    part = part.split('?')[0];
  }

  if (!titles.includes(part.toLowerCase())) {
    const fallback = window.location.href.split('/')[5] || "other";
    part = fallback.split('?')[0];
    if (!titles.includes(part.toLowerCase())) {
      part = "other";
    }
  }

  const index = titles.indexOf(part.toLowerCase());
  const colonne = String.fromCharCode(66 + index);
  const cellule = colonne + ligne;

  console.log("Page :", part);
  console.log("Cellule :", cellule);

  function write(cel, val) {
    const url = `https://script.google.com/macros/s/AKfycbwanne3dMvFx8x8cIFt7b2kRMLTWFNPwjaRWDHKBxP4S1YoFce3UCHOJOZrQa58I3QwUQ/exec?cellule=${encodeURIComponent(cel)}&valeur=${encodeURIComponent(val)}`;
    fetch(url)
      .then(response => response.text())
      .then(result => console.log("✅ Écriture réussie :", result))
      .catch(error => console.error("❌ Erreur d'écriture :", error));
  }

  function resetOtherCells(activeCol) {
    const startChar = 'B'.charCodeAt(0);
    const endChar = 'K'.charCodeAt(0);
    for (let c = startChar; c <= endChar; c++) {
      const col = String.fromCharCode(c);
      if (col !== activeCol) {
        const cell = col + ligne;
        write(cell, "-");
      }
    }
  }

  let valeur = "IN";
  const text = document.body.innerText;

  if (text.indexOf('Currently, no slots are available for the') > -1) {
    valeur = "NoSlot";
  } else if (text.indexOf('The appointment request is expired') > -1) {
    valeur = "Expired";
  } else if (text.indexOf('The selected date and slot') > -1) {
    valeur = "DateSlotError";
  } else if (text.indexOf('Invalid request parameter') > -1) {
    valeur = "InvalidParam";
  } else if (text.indexOf('Invalid appointment request flow') > -1) {
    valeur = "InvalidFlow";
  } else if (text.indexOf('An appointment is already in progress') > -1) {
    valeur = "AlreadyInProgress";
  } else if (text.indexOf('You have reached maximum number of requests ') > -1) {
    valeur = "MaxRequests";
  } else if (text.indexOf('ppointment slots are not') > -1) {
    valeur = "NoSlot";
  } else if (text.indexOf('something went wrong') > -1) {
    valeur = "ErrorUnknown";
  } else if (text.indexOf('success":false,"error":') !== -1) {
    valeur = "ErrorResponse";
  } else if (text.indexOf('Too Many Requests') > -1) {
    valeur = "TooMany";
  }

  write(cellule, valeur);
  resetOtherCells(colonne);
})();
