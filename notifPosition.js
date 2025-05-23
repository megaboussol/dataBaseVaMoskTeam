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

  if (text.includes('Currently, no slots are available for the')) {
    valeur = "NoSlot";
  } else if (text.includes('The appointment request is expired')) {
    valeur = "Expired";
  } else if (text.includes('The selected date and slot')) {
    valeur = "DateSlotError";
  } else if (text.includes('Invalid request parameter')) {
    valeur = "InvalidParam";
  } else if (text.includes('Invalid appointment request flow')) {
    valeur = "InvalidFlow";
  } else if (text.includes('An appointment is already in progress')) {
    valeur = "AlreadyInProgress";
  } else if (text.includes('You have reached maximum number of requests')) {
    valeur = "MaxRequests";
  } else if (text.includes('ppointment slots are not')) {
    valeur = "NoSlot";
  } else if (text.includes('something went wrong')) {
    valeur = "ErrorUnknown";
  } else if (text.includes('success":false,"error":')) {
    valeur = "ErrorResponse";
  } else if (text.includes('Too Many Requests')) {
    valeur = "TooMany";
  }

  write(cellule, valeur);
  resetOtherCells(colonne);
})();
