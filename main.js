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
persistOnLoad();
injectIntro(); 

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
  var qualityText = qualitiesArray[ideaObj.quality]
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
              <p class="article__quality" id="idea-quality">${qualityText}</span></p>
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
  removeIntro()
  displayIdea(newIdea);
};

function persistOnLoad() {
    ideasArray.forEach(function(idea) {
     displayIdea(idea);
   });
 };

function navEventHandler(e) {
  if( e.target.closest('#js-switch')){
    var nodesIndexList = [];
    var pCNodes = e.target.parentNode.childNodes;
    for (var i = 0 ; i < pCNodes.length; i++){
      if (pCNodes[i].id === 'js-switch'){
        nodesIndexList.push(i)
      };
    };
    nodesIndexList.forEach(function(index){
      pCNodes[index].classList.add('swill-quality');
      pCNodes[index].classList.remove('swill-quality-active');
    });
    e.target.closest('#js-switch').classList.add('swill-quality-active');
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
    injectIntro();
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

function compareArray(array1, array2) {
  // console.log('hi');
  clearIdeaBoard();
  var searchArray = [];
  array1.forEach(function(ideaObj) {
    if (array2.includes(ideaObj)) {
      searchArray.push(ideaObj);
      displayIdea(ideaObj);
    }
  })
  // console.log(searchArray)
  return searchArray
}

function filterBySearch(array) { 
  return array.filter(function(idObj) {
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

var navListener = document.querySelector("nav");
navListener.addEventListener('click', filterStar)

function filterStar(e) {
  var favIdeas = [];
  if (e.target.id === 'show-star-btn'){
    if (e.target.classList.contains('nav__button') && e.target.classList.contains('active')) {
      e.target.classList.remove('active')
      e.target.innerHTML = 'Show Stared Ideas';
      clearIdeaBoard();
      persistOnLoad();
      } else {
      e.target.innerHTML = 'View All Ideas';
      e.target.classList.add('active');  
      ideasArray.filter(function(ideaObj) {
        if (ideaObj.star === true) {
          favIdeas.push(ideaObj);
        }
      })
      compareArray(favIdeas, ideasArray);
      return favIdeas
    } 
  }
}

function injectIntro(){
  if (ideaBoard.innerHTML === '' || ideaBoard.innerHTML === ' '){
   clearIdeaBoard()
   ideaBoard.insertAdjacentHTML("afterbegin", 
    ` <card id="js-card">
        <p>Add your wonderful ideas.  Fill out the form and click "Save"</p>
      </card>`)
  } 
}

function removeIntro(){
  var element = document.getElementById('js-card');
  if (element){
  element.parentNode.removeChild(element);
  }  
}
navListener.addEventListener('click', showMoreLess)

function showMoreLess (e) { 
  if (e.target.id === 'more-less-btn'){
    if (e.target.classList.contains('nav__button') && e.target.classList.contains('active')) {
      console.log('active');
      e.target.classList.remove('active')
      e.target.innerHTML = 'Show Less';
      clearIdeaBoard();
      persistOnLoad();
    } else {
      console.log('else')
      e.target.innerHTML = 'Show More';
      e.target.classList.add('active');
      var lessIdeas = [];
      for (var i = 0; i < 10; i++){
        lessIdeas.push(ideasArray[i])
      }; 
      clearIdeaBoard()
      lessIdeas.forEach(function(idea) {
      displayIdea(idea);
      })
    } 
  }
}

