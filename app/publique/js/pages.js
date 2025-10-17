/* ====================== pages.js ====================== */

let cachedData = null;

/* === Charger les données JSON avec cache === */
async function loadData() {
  if (cachedData) return cachedData;
  const res = await fetch("/data");
  cachedData = await res.json();
  return cachedData;
}

/* === ACCUEIL === */
function chargerAccueil() {
  fetch("/data")
    .then(r => r.json())
    .then(data => {
      const accueil = data.accueil;
      document.getElementById("titre").textContent = accueil.titre;
      document.getElementById("description").textContent = accueil.paragraphe;

      // === Invitation audio ===
      document.getElementById("invitation-titre").textContent = accueil.invitation.titre;
      document.getElementById("invitation-texte").textContent = accueil.invitation.texte;
      document.getElementById("invitation-audio").src = accueil.invitation.audio;

      // === Cartes modernes ===
      const cartesContainer = document.getElementById("cartes");
      cartesContainer.innerHTML = ""; // vide avant de remplir

      accueil.propos.cartes.forEach(c => {
        const div = document.createElement("div");
        div.className = "card-modern";
        div.innerHTML = `
          <div class="icon">${c.icone}</div>
          <h5>${c.titre}</h5>
          <p>${c.texte}</p>
        `;
        cartesContainer.appendChild(div);
      });
    })
    .catch(err => console.error("Erreur chargement data:", err));

  // === Audio de fond ===
  const bgAudio = document.getElementById("backgroundAudio");
  if (bgAudio) bgAudio.volume = 0.01;

  // === Contrôle du bouton lecture/pause ===
  const audio = document.getElementById("invitation-audio");
  const playPauseBtn = document.getElementById("playPauseBtn");

  if (playPauseBtn && audio) {
    playPauseBtn.addEventListener("click", () => {
      if (audio.paused) {
        audio.play();
        playPauseBtn.textContent = "⏸️ Pause";
      } else {
        audio.pause();
        playPauseBtn.textContent = "▶️ Écouter";
      }
    });

    audio.addEventListener("ended", () => {
      playPauseBtn.textContent = "▶️ Écouter";
    });
  }
}


/* === PROGRAMME === */

async function fillProgramme() {
  const data = await loadData();
  const tbody = document.getElementById("programmeBody");
  if (!tbody) return;

  let i = 0;
  let blocCount = 0;

  while (i < data.programme.length) {
    const animateur = data.programme[i].animateur;
    let groupe = [];

    // Rassembler toutes les activités du même animateur
    while (i < data.programme.length && data.programme[i].animateur === animateur) {
      groupe.push(data.programme[i]);
      i++;
    }

    // Définir la classe de bloc (bloc-0 ou bloc-1) pour le CSS
    const blocClass = `bloc-${blocCount % 2}`;
    blocCount++;

    // Ajouter les lignes
    groupe.forEach((p, index) => {
      const tr = document.createElement("tr");
      tr.classList.add(blocClass); // applique le style CSS du bloc

      if (index === 0) {
        tr.innerHTML = `
          <td>${p.heure}</td>
          <td>${p.activite}</td>
          <td>${p.salle}</td>
          <td rowspan="${groupe.length}" class="align-middle fw-bold text-primary">${p.animateur}</td>
          <td rowspan="${groupe.length}" class="align-middle">
            <div class="photo-container">
              <img src="../${p.photo}" alt="${p.animateur}" class="animateur-photo shadow-lg">
              <div class="bio-bulle">${p.bio}</div>
            </div>
          </td>
        `;
      } else {
        tr.innerHTML = `
          <td>${p.heure}</td>
          <td>${p.activite}</td>
          <td>${p.salle}</td>
        `;
      }

      tbody.appendChild(tr);
    });
  }
}

/* === GALERIE === */
async function fillGalerie(data) {
  const gallery = document.getElementById("galleryContainer");
  if (!gallery) return;

  gallery.innerHTML = data.galerie.map(img => `
    <div class="col-sm-6 col-md-4 mb-4">
      <div class="card shadow-sm position-relative overflow-hidden">
        <img src="../${img.url}" class="card-img-top" alt="Photo Niagara">
        <div class="caption">${img.caption}</div>
      </div>
    </div>
  `).join('');

  gallery.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.querySelector('.caption').style.opacity = '1';
      card.querySelector('img').style.transform = 'scale(1.05)';
    });
    card.addEventListener('mouseleave', () => {
      card.querySelector('.caption').style.opacity = '0';
      card.querySelector('img').style.transform = 'scale(1)';
    });
  });
}
/* === INFOS === */
async function loadInfos(data) {
  const infosContent = document.getElementById("infosContent");
  if (!infosContent) return;

  const infos = data.infos;

  infosContent.innerHTML = `
  <div class="infos-header">
    <h2>${infos.titre}</h2>
  </div>

  <section>
    <h3>📍 Adresse et plan d'accès</h3>
    <iframe class="map" src="${infos.map_embed}"></iframe>
  </section>

  <section class="faq">
    <h3>FAQ</h3>
    ${infos.faq.map(f => `
      <details>
        <summary>${f.question}</summary>
        <div class="reponse">${f.reponse}</div>
      </details>
    `).join('')}
  </section>

  <section class="contact">
    <h3>Coordonnées</h3>
    <p>Téléphone : ${infos.contact.tel}</p>
    <p>Email : <a href="mailto:${infos.contact.email}">${infos.contact.email}</a></p>
  </section>

  <section class="liens-utiles">
    <h3>Liens utiles</h3>
    <ul>
      ${infos.liens_utiles.map(l => `<li><a href="${l.url}" target="_blank">${l.titre}</a></li>`).join('')}
    </ul>
  </section>
`;
}

/* === FORMULAIRE INSCRIPTION === */
function initFormulaire() {
  const form = document.getElementById("registrationForm");
  const submitBtn = document.getElementById("submitBtn");
  if (!form || !submitBtn) return;

  const telInput = form.querySelector("#tel");
  const emailInput = form.querySelector("#email");
  const dobInput = form.querySelector("#dateNaissance");
  const conditionsInput = form.querySelector("#conditions");

  const telError = form.querySelector("#telError");
  const emailError = form.querySelector("#emailError");
  const dobError = form.querySelector("#dobError");

  const phoneRegex = /^\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const paiementRadios = form.querySelectorAll('input[name="paiement"]');
  const carteDetails = document.getElementById("carteDetails");

  paiementRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      if (radio.value === "credit") {
        carteDetails.style.display = "block";
      } else {
        carteDetails.style.display = "none";
      }
    });
  });
  submitBtn.disabled = true;

  function validatePhone() {
    const valid = phoneRegex.test(telInput.value);
    telError.style.display = valid ? "none" : "inline";
    return valid;
  }

  function validateEmail() {
    const valid = emailRegex.test(emailInput.value);
    emailError.style.display = valid ? "none" : "inline";
    return valid;
  }

  function validateDOB() {
    const dob = new Date(dobInput.value);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    const valid = age >= 18;
    dobError.style.display = valid ? "none" : "inline";
    return valid;
  }

  function checkForm() {
    submitBtn.disabled = !(validatePhone() && validateEmail() && validateDOB() && conditionsInput.checked);
  }

  [telInput, emailInput, dobInput].forEach(input => input.addEventListener("input", checkForm));
  conditionsInput.addEventListener("change", checkForm);

  form.addEventListener("submit", async e => {
    e.preventDefault();

    const activites = Array.from(form.querySelectorAll('input[name="activites"]:checked'))
      .map(el => el.value);

    const formData = {
      prenom: form.prenom.value,
      nom: form.nom.value,
      email: form.email.value,
      tel: form.tel.value,
      dateNaissance: form.dateNaissance.value,
      pays: form.pays.value,
      sexe: form.sexe.value,
      adultes: parseInt(form.adultes.value || 0),
      enfants: parseInt(form.enfants.value || 0),
      bebe: parseInt(form.bebe.value || 0),
      activites,
      paiement: form.paiement.value,
      commentaires: form.commentaires.value
    };

    try {
      const res = await fetch("/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      alert(data.message);
      form.reset();
      submitBtn.disabled = true;
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement de l'inscription.");
    }
  });
  
}

/* === INIT === */
document.addEventListener("DOMContentLoaded", async () => {
  const data = await loadData();

  if (document.getElementById("titre")) await chargerAccueil(data);
  if (document.getElementById("programmeBody")) await fillProgramme(data);
  if (document.getElementById("galleryContainer")) await fillGalerie(data);
  if (document.getElementById("infosContent")) await loadInfos(data);
  if (document.getElementById("registrationForm")) initFormulaire();
});
