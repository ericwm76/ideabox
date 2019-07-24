class Idea {
  constructor(ideaObj) {
    this.title = ideaObj.title;
    this.body = ideaObj.body;
    this.star = ideaObj.star || false;
    this.quality = ideaObj.quality || 0;
    this.id = ideaObj.id || Date.now();
  };
  
  saveToStorage(gblArray) {
    localStorage.setItem("array", JSON.stringify(gblArray));
  };

  deleteFromStorage(delID) {
    ideasArray = ideasArray.filter(id => {return parseInt(delID) !== id.id});
    this.saveToStorage(ideasArray);
  };

  updateIdea() {
    localStorage.setItem("array", JSON.stringify(gblArray));
  };

  updateQuality() {
    localStorage.setItem("array", JSON.stringify(gblArray));
  };
};