var ideasArray = [];
var qualitiesArray = [[], [], []];
var navBar = document.querySelector('nav');
var ideaInputs = document.querySelector('section');
var ideaBoard = document.querySelector('main');
var titleInput = document.querySelector('#title-input');
var bodyInput = document.querySelector('#idea-body');
var saveBtn = document.querySelector('#save-btn');
var showStarBtn = document.querySelector('#show-star-btn');

ideaBoard.addEventListener('click', updateArticle);
ideaBoard.addEventListener('focusout', saveCard);
ideaBoard.addEventListener('keydown', saveOnEnter);
ideaInputs.addEventListener('keyup', disableSave);
ideaInputs.addEventListener('click', runAll);
document.querySelector('nav').addEventListener('click', navEventHandler);
document.querySelector('#search-input').addEventListener('keyup', repopulateMain);

startOnLoad();
persistOnLoad();
showTenOnLoad();
injectIntro(); 

function navEventHandler(e) {
  if (e.target.id === 'more-less-btn') {
    showMoreLess(e);
  };

  if (e.target.closest('#show-star-btn')) {
    toggleStarBtn(e);
  };

  if (e.target.closest('.js-switch')) {
    toggleQualities(e);
  };

  if (e.target.closest('#menu-button')) {
    toggleBurger(e);
  };  
};

function updateArticle(e) {
  e.preventDefault();
  if (e.target.closest('#delete-x')) {
    findIdeaToRemove(e);
  };
  
  if (e.target.closest("#star-img")) {
    saveStar(e);
  };

  if (e.target.id === 'up-arrow' && ideasArray[getIndex(e)].quality < qualitiesArray.length - 1) {
    increaseQuality(e);
  };

  if (e.target.id === 'down-arrow' && ideasArray[getIndex(e)].quality > 0) {
    decreaseQuality(e);
  };
};

function showTenOnLoad() {
  if (ideasArray.length > 10) {
    var recentTenIdeas = [];
    for (var i = 0; i < 10; i++) {
      recentTenIdeas.unshift(ideasArray[ideasArray.length - 1 -i])
    }; 

    clearIdeaBoard();
    recentTenIdeas.forEach(function(idea) {
      displayIdea(idea);
    });
  };
};

function startOnLoad() {
  if (JSON.parse(localStorage.getItem('array')) === null) {
    ideasArray = [];
  } else {
    ideasArray = JSON.parse(localStorage.getItem('array')).map(element => new Idea(element));
    sortIdeas();
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

function clearInputs() {
  titleInput.value = '';
  bodyInput.value = '';
};

function createObj() {
  var newIdea = new Idea({title: titleInput.value, body: bodyInput.value, star: false, quality: 0, id: Date.now()});

  ideasArray.push(newIdea);
  newIdea.saveToStorage(ideasArray);
  sortIdeas();
  removeIntro();
  displayIdea(newIdea);
};

function persistOnLoad() {
    ideasArray.forEach(function(idea) {
     displayIdea(idea);
   });
 };

function toggleQualities(e) {
  var nodesIndexList = document.querySelectorAll('.js-switch');

  nodesIndexList.forEach(function(index) {
    index.classList.add('swill-quality');
    index.classList.remove('swill-quality-active');
  });

  e.target.closest('.js-switch').classList.add('swill-quality-active'); 
  clearIdeaBoard();

  qualitiesArray[parseInt(e.target.dataset.quality)].forEach(function(ideaObj) {
    displayIdea(ideaObj);
  });
};

function toggleBurger(e) {
  if (e.target.src.includes('images/menu.svg')) {
    document.querySelector('#menu-active').classList.remove('menu');
    document.querySelector('main').classList.add('darken');
    e.target.src = 'images/menu-close.svg';
  } else {
    document.querySelector('#menu-active').classList.add('menu');
    document.querySelector('main').classList.remove('darken');
    e.target.src = 'images/menu.svg';
  };
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
    sortIdeas();
  };

  if (e.target.closest('.article__body')) {
    var articleBody = e.target.closest('.article__body').innerText;
    ideasArray[getIndex(e)].body = articleBody;
    ideasArray[getIndex(e)].saveToStorage(ideasArray);
    sortIdeas();
  };
};

function increaseQuality(e) {
  ideasArray[getIndex(e)].quality++;
  ideasArray[getIndex(e)].saveToStorage(ideasArray);  
  sortIdeas();
  changeQualityText(e);
};

function decreaseQuality(e) {
  ideasArray[getIndex(e)].quality--;
  ideasArray[getIndex(e)].saveToStorage(ideasArray);
  sortIdeas();
  changeQualityText(e);
};

function changeQualityText(e) {
  var qualityText = [
    'Quality: Swill',
    'Quality: Plausible',
    'Quality: Genius'
  ];

  e.target.parentNode.childNodes[3].innerText = qualityText[ideasArray[getIndex(e)].quality];
};

function getIdentifier(e) {
  return e.target.closest("article").dataset.identifier;
};

function getIndex(e) {
  return ideasArray.findIndex(function(id) {
    return parseInt(getIdentifier(e)) === id.id;
  });
};

function findIdeaToRemove(e) {
  e.target.closest('article').remove();
  ideasArray[getIndex(e)].deleteFromStorage(getIdentifier(e));
  injectIntro();
};

function favoriteIdea(e) {
  var activeStar = 'images/star-active.svg';
  var inactiveStar = 'images/star.svg';

  if (ideasArray[getIndex(e)].star === true) {
    e.target.src = activeStar;
  } else {
    e.target.src = inactiveStar;
  };
};

function saveStar(e) {
  ideasArray[getIndex(e)].star = !ideasArray[getIndex(e)].star;
  ideasArray[getIndex(e)].saveToStorage(ideasArray);
  sortIdeas();
  favoriteIdea(e);
};

function filterBySearch() { 
  var totalArray = qualitiesArray.concat([ideasArray]);
  var searchedArray = [];

  searchedArray = totalArray[getActiveFilter()].filter(function(idObj) {
    return idObj.body.toLowerCase().includes(document.querySelector('#search-input').value.toLowerCase()) 
     || idObj.title.toLowerCase().includes(document.querySelector('#search-input').value.toLowerCase());
  });

  if (showStarBtn.classList.contains('active')) {
    searchedArray = compareArray(searchedArray, displayStarredIdeas());
  };

  return searchedArray;
};

function compareArray(array1, array2) {
  var searchArray = [];

  array1.forEach(function(ideaObj) {
    if (array2.includes(ideaObj)) {
      searchArray.push(ideaObj);
    };
  });

  return searchArray;
};

function getActiveFilter() {
  var activeFilter = 3;

  document.querySelectorAll('.js-switch').forEach(function(btn) {
    if (btn.classList.contains('swill-quality-active')) {
      activeFilter = parseInt(btn.dataset.quality);
    };
  });

  return activeFilter;
};

function clearIdeaBoard() {
  ideaBoard.innerHTML = '';
};

function repopulateMain() {
  clearIdeaBoard();
  filterBySearch().forEach(element => displayIdea(element));

  if (document.querySelector('#search-input').value === '') {
    clearIdeaBoard();
    var totalArray = qualitiesArray.concat([ideasArray]); 
    totalArray[getActiveFilter()].forEach(function(idea) {
     displayIdea(idea)
   });
  };
};

function displayStarredIdeas() {
  var favIdeas = [];

  ideasArray.filter(function(ideaObj) {
    if (ideaObj.star === true) {
      favIdeas.push(ideaObj)
    };
  });

  if (favIdeas.length === 0) {
    insertFavPrompt();
    showStarBtn.classList.remove('active');
    showStarBtn.innerText = 'Show Starred Ideas';
    return favIdeas;
  };

  clearIdeaBoard();
  favIdeas.forEach(function(ideaObj) {
    displayIdea(ideaObj);
  });

  return favIdeas;
};

function toggleStarBtn() {
  if (showStarBtn.classList.contains('active')) {
    showStarBtn.classList.remove('active');
    showStarBtn.innerText = 'Show Starred Ideas';
    clearIdeaBoard();
    persistOnLoad();
  } else {
    showStarBtn.classList.add('active');
    showStarBtn.innerText = 'View All Ideas';
    displayStarredIdeas();
  };
};

function sortIdeas() {
  qualitiesArray = [[], [], []];

  ideasArray.forEach(function(ideaObj) {
    qualitiesArray[ideaObj.quality].push(ideaObj)
  });
};

function removeIntro() {
  var element = document.getElementById('js-card');

  if (element) {
    element.parentNode.removeChild(element);
  };  
};

function showMoreLess(e) { 
  var lessIdeas = [];

  if (e.target.classList.contains('nav__button') && e.target.classList.contains('active')) {
    e.target.classList.remove('active');
    for (var i = 0; i < 10; i++) {
      lessIdeas.unshift(ideasArray[ideasArray.length - 1 -i]);
    }; 

    clearIdeaBoard();
    lessIdeas.forEach(function(ideaObj) {
      displayIdea(ideaObj);
    });

    e.target.innerHTML = 'Show More';
  } else {
    e.target.classList.add('active');
    e.target.innerHTML = 'Show Less';
    clearIdeaBoard();
    persistOnLoad();
  };
};

function displayIdea(ideaObj) {
  var star = 'images/star.svg';
  var qualityText = [
    "Quality: Swill",
    "Quality: Plausible",
    "Quality: Genius"
  ];

  if (ideaObj.star === true) {
    star = 'images/star-active.svg';
  } else {
    star = 'images/star.svg';
  };

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
              <img src="images/upvote.svg" onmouseover="this.src='images/upvote-active.svg'" onmouseout="this.src='images/upvote.svg'" id="up-arrow" alt="arrow pointing up white">
              <p class="article__quality" id="idea-quality">${qualityText[ideaObj.quality]}</span></p>
              <img src="images/downvote.svg" onmouseover="this.src='images/downvote-active.svg'" onmouseout="this.src='images/downvote.svg'"id="down-arrow" alt="arrow pointing down white">
          </div>
          </footer>
      </article>`
  );
};

function injectIntro() {
  if (ideaBoard.innerHTML === '' || ideaBoard.innerHTML === ' ') {
   clearIdeaBoard();
   ideaBoard.insertAdjacentHTML("afterbegin", 
    `<card id="js-card">
      <p>Add your wonderful ideas.  Fill out the form and click "Save"</p>
    </card>`)
  }; 
};

function insertFavPrompt() {
  ideaBoard.insertAdjacentHTML("afterbegin",
    `<card id="js-no-fave-msg">
      <p>You have no starred ideas! Click the star on the card to favorite your ideas!</p>
    </card>`
  );
};