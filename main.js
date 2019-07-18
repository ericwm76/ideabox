var ideasArray = [];
var navBar = document.querySelector('nav');
var ideaInputs = document.querySelector('section');
var ideaBoard = document.querySelector('main');
var titleInput = document.querySelector('#title-input');
var bodyInput = document.querySelector('#idea-body');
var saveBtn = document.querySelector('#save-btn');

document.querySelector('nav').addEventListener('click', navEventHandler);
document.querySelector('main').addEventListener('click', updateArticle);
document.querySelector('main').addEventListener('focusout', saveCard);
document.querySelector('main').addEventListener('keydown', saveOnEnter);

ideaInputs.addEventListener('keyup', disableSave);
ideaInputs.addEventListener("click", runAll);

startOnLoad();
persisting(ideaInputs);

function startOnLoad(){
  if (JSON.parse(localStorage.getItem('array')) === null){
    ideasArray = [];
  } else {
    ideasArray = JSON.parse(localStorage.getItem('array')).map(element => new Idea(element));
  };
};

function runAll(e) {
  e.preventDefault();
  if (e.target.closest('#save-btn')) {
  createObj();
  clearInputs();
  disableSave()
  };
};

function disableSave() {
  if (titleInput.value === '' || bodyInput.value === '') {
    saveBtn.disabled = true;
  } else {
    saveBtn.disabled = false;
  };
};

function displayIdea(obj) {
  var star;
    if (obj.star === true) {
      star = 'images/star-active.svg';
    } else {
      star = 'images/star.svg'
    }
  ideaBoard.insertAdjacentHTML(
    "afterbegin",`<article class="article" data-identifier="${obj.id}">
          <header class="article__header">
            <img type="button" src="${star}" id="star-img" alt="picture of a star white">
            <img type="button" src="images/delete.svg" id="delete-x" alt="white x">
          </header>
          <div>
            <p contenteditable= "true" class="article__title">${obj.title}</p>
            <p contenteditable= "true" class="article__body">${obj.body}</p>
            <footer class="article__footer">
              <img type="button" src="images/upvote.svg" id="up-arrow" alt="arrow pointing up white">
              <p class="article__quality"><span id="idea-quality">Quality: Swill</span></p>
              <img type="button" src="images/downvote.svg" id="down-arrow" alt="arrow pointing down white">
          </div>
          </footer>
      </article>`
  );
};

function clearInputs() {
  titleInput.value = '';
  bodyInput.value = '';
};

function createObj() {
  var newIdea = new Idea({title: titleInput.value, body: bodyInput.value, star: false, quality: 0, id: Date.now()});
  ideasArray.push(newIdea);
  newIdea.saveToStorage(ideasArray);
  displayIdea(newIdea);
};

function persisting() {
     ideasArray.forEach(function (element) {
     displayIdea(element)
   });
 };

function navEventHandler (e) {
  if (e.target.closest('.swill-quality')) {
    e.target.closest('.swill-quality').classList.add('swill-quality-active');
    e.target.closest('.swill-quality').classList.remove('swill-quality');
  } else if (e.target.closest('.swill-quality-active')) {
        e.target.closest('.swill-quality-active').classList.add('swill-quality');
    e.target.closest('.swill-quality-active').classList.remove('swill-quality-active');
  };
};

function updateArticle(e) {
  e.preventDefault();
  findIdeaToRemove(e);
  saveStar(e);
};

function saveOnEnter(e){
  if(e.keyCode === 13){
    saveCard(e)
  };
};

function saveCard(e){
  if (e.target.closest('.article__title')){
    var articleTitle = e.target.closest('.article__title').innerText;
    ideasArray[findIndex(e)].title = articleTitle;
    ideasArray[findIndex(e)].saveToStorage(ideasArray);
  };
  if (e.target.closest('.article__body')){
    var articleBody = e.target.closest('.article__body').innerText;
    ideasArray[findIndex(e)].body = articleBody;
    ideasArray[findIndex(e)].saveToStorage(ideasArray);
  };
};

function getIdentifier(e) {
  return e.target.closest("article").dataset.identifier;
};

function findIndex(e) {
  return ideasArray.findIndex(id => parseInt(getIdentifier(e)) === id.id);
};

function findIdeaToRemove(e) {
  if (e.target.closest('#delete-x')) {
    e.target.closest('article').remove();
    ideasArray[findIndex(e)].deleteFromStorage(getIdentifier(e));
  };
};

function favoriteIdea(e) {
  var index = findIndex(e);
  var activeStar = 'images/star-active.svg'
  var inactiveStar = 'images/star.svg'
  if (ideasArray[index].star === true){
    e.target.src = activeStar;
  } else {
    e.target.src = inactiveStar;
  };
};

function saveStar(e) {
  if (e.target.closest("#star-img")) {
    console.log('hi')
    var index = findIndex(e);
    ideasArray[index].star = !ideasArray[index].star;
    ideasArray[index].saveToStorage(ideasArray);
    favoriteIdea(e);
  };
};