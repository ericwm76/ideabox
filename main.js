var ideasArray = JSON.parse(localStorage.getItem('array')) || [];
var navBar = document.querySelector('nav');
var ideaInputs = document.querySelector('section');
var ideaBoard = document.querySelector('main');
var titleInput = document.querySelector('#title-input');
var bodyInput = document.querySelector('#idea-body');
var saveBtn = document.querySelector('#save-btn');

ideaInputs.addEventListener('keyup', disableSave);
ideaInputs.addEventListener('click', runAll);

function runAll(e) {
  e.preventDefault();
  if (e.target.closest('#save-btn')) {
  createObj();
  clearInputs();
  }
}

function disableSave() {
  if (titleInput.value === '' || bodyInput.value === '') {
    saveBtn.disabled = true;
  } else {
    saveBtn.disabled = false;
  }
}

function displayIdea() {
  ideaBoard.insertAdjacentHTML(
    'afterbegin',`<article class="article">
          <header class="article__header">
            <img src="images/star.svg" id="star-img" alt="picture of a star white">
            <img src="images/delete.svg" id="delete-x" alt="white x">
          </header>
          <p class="article__title">${titleInput.value}</p>
          <p class="article__body">${bodyInput.value}</p>
          <footer class="article__footer">
            <img src="images/upvote.svg" id="up-arrow" alt="arrow pointing up white">
            <p class="article__quality"><span id="idea-quality">Quality: Swill</span></p>
            <img src="images/downvote.svg" id="down-arrow" alt="arrow pointing down white">
          </footer>
      </article>`
  );
}

function clearInputs() {
  titleInput.value = '';
  bodyInput.value = '';
}

function createObj() {
  var newIdea = new Idea(titleInput.value, bodyInput.value, false, 0, Date.now());
  ideasArray.push(newIdea);
  newIdea.saveToStorage(ideasArray);
  console.log(ideasArray)
  displayIdea();
}

function persisting() {
   //get the array of ideas
   //run through populator
   //run populator on page load.
}