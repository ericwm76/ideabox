var ideasArray = [];
var qualitiesArray = ['Quality: Swill', 'Quality: Plausible', 'Quality: Genius']
var navBar = document.querySelector('nav');
var ideaInputs = document.querySelector('section');
var ideaBoard = document.querySelector('main');
var titleInput = document.querySelector('#title-input');
var bodyInput = document.querySelector('#idea-body');
var saveBtn = document.querySelector('#save-btn');

document.querySelector('nav').addEventListener('click', navEventHandler);
ideaBoard.addEventListener('click', updateArticle);
ideaBoard.addEventListener('focusout', saveCard);
ideaBoard.addEventListener('keydown', saveOnEnter);
document.querySelector('#search-input').addEventListener('keyup', repopulateMain);
ideaInputs.addEventListener('keyup', disableSave);
ideaInputs.addEventListener("click", runAll);

startOnLoad();
persistOnLoad(ideaInputs);

function startOnLoad() {
  if (JSON.parse(localStorage.getItem('array')) === null) {
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
    disableSave();
  };
};

function disableSave() {
  if (titleInput.value === '' || bodyInput.value === '') {
    saveBtn.disabled = true;
  } else {
    saveBtn.disabled = false;
  };
};

function displayIdea(ideaObj) {
  var star;

  if (ideaObj.star === true) {
    star = 'images/star-active.svg';
  } else {
    star = 'images/star.svg';
  }

  ideaBoard.insertAdjacentHTML(
    "afterbegin",`<article class="article" data-identifier="${ideaObj.id}">
          <header class="article__header">
            <img src="${star}" id="star-img" alt="picture of a star white">
            <img src="images/delete.svg" id="delete-x" alt="white x">
          </header>
          <div>
            <p contenteditable= "true" class="article__title">${ideaObj.title}</p>
            <p contenteditable= "true" class="article__body">${ideaObj.body}</p>
            <footer class="article__footer">
              <img src="images/upvote.svg" id="up-arrow" alt="arrow pointing up white">
              <p class="article__quality" id="idea-quality">Quality: Swill</span></p>
              <img src="images/downvote.svg" id="down-arrow" alt="arrow pointing down white">
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

function persistOnLoad() {
    ideasArray.forEach(function(idea) {
     displayIdea(idea);
   });
 };

function navEventHandler(e) {
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
  changeQuality(e);
};

function saveOnEnter(e) {
  if(e.key === 'Enter') {
    e.target.blur();
    saveCard(e);
  };
};

function saveCard(e) {
  if (e.target.closest('.article__title')) {
    var articleTitle = e.target.closest('.article__title').innerText;
    ideasArray[getIndex(e)].title = articleTitle;
    ideasArray[getIndex(e)].saveToStorage(ideasArray);
  };

  if (e.target.closest('.article__body')) {
    var articleBody = e.target.closest('.article__body').innerText;
    ideasArray[getIndex(e)].body = articleBody;
    ideasArray[getIndex(e)].saveToStorage(ideasArray);
  };
};

function changeQuality(e){
  if (e.target.id === 'up-arrow' && ideasArray[getIndex(e)].quality < qualitiesArray.length - 1) {
    ideasArray[getIndex(e)].quality++;
    ideasArray[getIndex(e)].saveToStorage(ideasArray);  
    changeQualityText(e);
  }
  if (e.target.id === 'down-arrow' && ideasArray[getIndex(e)].quality > 0){
    ideasArray[getIndex(e)].quality--
    ideasArray[getIndex(e)].saveToStorage(ideasArray);
    changeQualityText(e);  
  }
}

function changeQualityText(e){
  console.log(e.target.parentNode.childNodes)
  e.target.parentNode.childNodes[3].innerText = qualitiesArray[ideasArray[getIndex(e)].quality];
}















function getIdentifier(e) {
  return e.target.closest("article").dataset.identifier;
};

function getIndex(e) {
  return ideasArray.findIndex(function(id) {
    return parseInt(getIdentifier(e)) === id.id
  });
};

function findIdeaToRemove(e) {
  if (e.target.closest('#delete-x')) {
    e.target.closest('article').remove();
    ideasArray[getIndex(e)].deleteFromStorage(getIdentifier(e));
  };
};

function favoriteIdea(e) {
  var index = getIndex(e);
  var activeStar = 'images/star-active.svg';
  var inactiveStar = 'images/star.svg';
  if (ideasArray[index].star === true) {
    e.target.src = activeStar;
  } else {
    e.target.src = inactiveStar;
  };
};

function saveStar(e) {
  if (e.target.closest("#star-img")) {
    var index = getIndex(e);
    ideasArray[index].star = !ideasArray[index].star;
    ideasArray[index].saveToStorage(ideasArray);
    favoriteIdea(e);
  };
};

function filterBySearch() { 
  return ideasArray.filter(function(idObj) {
    return idObj.body.toLowerCase().includes(document.querySelector('#search-input').value.toLowerCase()) 
     || idObj.title.toLowerCase().includes(document.querySelector('#search-input').value.toLowerCase());
  });
};

function clearIdeaBoard() {
  ideaBoard.innerHTML = '';
};

function repopulateMain() {
  clearIdeaBoard();
  filterBySearch().forEach(element => displayIdea(element));
  if (document.querySelector('#search-input').value === '') {
    clearIdeaBoard();
    persistOnLoad();
  };
};