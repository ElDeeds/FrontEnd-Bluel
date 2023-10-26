const allWorks = new Set();
const allCats = new Set();

const galleryDivs = document.querySelectorAll('.gallery');
const buttonsContainer = document.querySelector('.buttons');
const penIcon = document.querySelector('.fa-pen-to-square');
const modifyLink = document.querySelector('.modify');
const editionBar = document.querySelector('.edition-bar');


// Fonction d'initialisation de page 

async function init() {
  isAdmin();
  const works = await getDatabaseInfo("works");
  for (const work of works) {
    allWorks.add(work);
    allCats.add(work.category.name);
  }
  displayWorks();
  createFilter();
}
init();

// Si un utilisateur est connecté

function isAdmin() {
  const token = sessionStorage.getItem("token");

  if (token !== null) {
    penIcon.classList.remove('hidden');
    modifyLink.classList.remove('hidden');

    const iconBanner = document.createElement("i");
    iconBanner.classList.add("fa-regular", "fa-pen-to-square", "iconBanner");

    const banner = document.createElement("div");
    banner.classList.add("admin-text");
    banner.textContent = "Mode édition";

    const publishButton = document.createElement("button");
    publishButton.classList.add("publish-button");
    publishButton.textContent = "publier les changements";


    editionBar.appendChild(banner);
    editionBar.appendChild(publishButton);
    banner.appendChild(iconBanner);

    const loginLink = document.querySelector(".li-link");
    loginLink.textContent = "Logout";
    loginLink.href = "./index.html";
    loginLink.addEventListener("click", logout);

    modifyLink.addEventListener("click", openModal);
  } else {
    penIcon.classList.add('hidden');
    modifyLink.classList.add('hidden');
    editionBar.classList.add('hidden');
  }
}

// Fonction lorsque l'utilisateur se Logout

function logout() {
  sessionStorage.removeItem("token");
  window.location.href = "index.html";
}

// Fonction pour l'affichage de la galerie
async function displayWorks(filtre = null) {
  for (const galleryDiv of galleryDivs) {
    galleryDiv.innerHTML = '';

    const fragment = document.createDocumentFragment();

    let filteredWorks = allWorks;

    if (filtre) {
      filteredWorks = Array.from(allWorks).filter(
        (work) => work.category.name === filtre
      );
    }

    for (const work of filteredWorks) {
      const figure = document.createElement('figure');
      const img = document.createElement('img');
      const figcaption = document.createElement('figcaption');

      // Charge l'image et l'Alt de l'API
      img.src = work.imageUrl;
      img.alt = work.title;

      // Vérifie la classe de la galerie
      if (galleryDiv.classList.contains('modalGallery')) {
        // Si Gallery modal
        const editSpan = document.createElement('span');
        editSpan.textContent = 'éditer';
        figcaption.appendChild(editSpan);

        // Ajouter l'icône de suppression
        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fa-solid', 'fa-trash-can');
        figure.appendChild(deleteIcon);

        deleteIcon.addEventListener('click', () => deleteWork(work.id));
      } else {
        // Si gallery de l'index
        figcaption.textContent = work.title;
      }

      figure.appendChild(img);
      figure.appendChild(figcaption);
      fragment.appendChild(figure);
    }

    galleryDiv.appendChild(fragment);
  }
}


// Fonction de suppression des éléments
async function deleteWork(id) {
  try {
    const response = await fetch(`http://localhost:5678/api/works/${id}`,
      {
        method: 'DELETE'
      });

  } catch (error) {
    console.error(error);
  }
}


// Création des filtre à partir des ID
function createFilter() {
  const categories = Array.from(allCats);
  categories.unshift('Tous');

  categories.forEach(category => {
    const button = createButton(category, category === 'Tous');
    buttonsContainer.appendChild(button);
  });
}

// Création des boutons à partir des ID
function createButton(text, isSelected) {
  const button = document.createElement('div');
  button.classList.add('buttonStyle');
  button.textContent = text;
  if (isSelected) {
    button.classList.add('buttonSelected');
  }
  button.addEventListener('click', () => {
    const selectedButton = document.querySelector('.buttonSelected');
    selectedButton.classList.remove('buttonSelected');
    button.classList.add('buttonSelected');
    filterItems(button.textContent);
  });
  return button;
}

function filterItems(category) {
  if (category === 'Tous') {
    displayWorks();
  } else {
    displayWorks(category);
  }
}

async function getDatabaseInfo(type) {
  const response = await fetch('http://localhost:5678/api/' + type);
  if (response.ok) {
    return response.json();
  } else {
    console.log(response);
  }
}

// Fonction pour ouvrir la modale
function openModal() {
  createOverlay();
  const modal = document.getElementById('modal');
  modal.style.display = 'block';

  const closeButton = document.querySelector('.close');
  closeButton.addEventListener('click', closeModal);

  const closeOverlay = document.querySelector('.overlay');
  closeOverlay.addEventListener('click', closeModal);

  const overlayElement = document.querySelector('.overlay');

  overlayElement.addEventListener('click', closeModal);
}

const addPhotoButton = document.getElementById('addPhotoButton');
addPhotoButton.addEventListener('click', replaceModal);

const modalModif = document.querySelector('.modalModif');
const modalAjout = document.querySelector('.modalAjout');

// Fonction pour fermer la modale
function closeModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
  modalAjout.style.display = 'none';


  const overlay = document.querySelector('.overlay');
  overlay.remove();
}

// Fonction pour créer l'overlay

function createOverlay() {
  const overlay = document.createElement('div');
  overlay.classList.add('overlay');
  document.body.appendChild(overlay);
}

function replaceModal() {


  modalModif.style.display = 'none';
  modalAjout.style.display = 'block';
}