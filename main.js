var ideasArray = JSON.parse(localStorage.getItem('array')) || [];
var navBar = document.querySelector('nav');
var ideaInputs = document.querySelector('section');
var ideaBoard = document.querySelector('main');
var titleInput = document.querySelector('#title-input');
var bodyInput = document.querySelector('#idea-body');
var saveBtn = document.querySelector('#save-btn');

ideaInputs.addEventListener('keyup', disableSave);
ideaInputs.addEventListener('click', runAll);

persisting(ideaInputs);

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

function displayIdea(obj) {
  ideaBoard.insertAdjacentHTML(
    "afterbegin",`<article class="article" data-identifier="${obj.id}">
          <header class="article__header">
            <img src="images/star.svg" id="star-img" alt="picture of a star white">
            <img src="images/delete.svg" id="delete-x" alt="white x">
          </header>
          <p class="article__title">${obj.title}</p>
          <p class="article__body">${obj.body}</p>
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
  displayIdea(newIdea);
}

function persisting() {
     ideasArray.forEach(function (element) {
     displayIdea(element)
   })
 }

document.querySelector('nav').addEventListener('click', navEventHandler);

function navEventHandler (e) {
  if (e.target.closest('.swill-quality')) {
    e.target.closest('.swill-quality').classList.add('swill-quality-active');
    e.target.closest('.swill-quality').classList.remove('swill-quality');
  } else if (e.target.closest('.swill-quality-active')) {
        e.target.closest('.swill-quality-active').classList.add('swill-quality');
    e.target.closest('.swill-quality-active').classList.remove('swill-quality-active');
  }
}

document.querySelector('main').addEventListener('click', findIdeaToRemove)

function findIdeaToRemove(e) {
  if (e.target.closest('#delete-x')) {
    e.target.closest('article').remove();
    var identifier = e.target.closest('article').dataset.identifier;
    var index = ideasArray.findIndex(id => {return parseInt(identifier) === id.id});
    ideasArray[index].deleteFromStorage(identifier);
  }
}