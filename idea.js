class Idea {
  constructor(title, body, star, quality, id) {
    this.title = title;
    this.body = body;
    this.star = false;
    this.quality = 0;
    this.id = id || Date.now();
  }
  
  saveToStorage() {
    localStorage.setItem('array', JSON.stringify(ideasArray));
  }

  deleteFromStorage() {}

  updateIdea() {}

  updateQuality() {}
}