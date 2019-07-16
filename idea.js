class Idea {
  constructor(title, body, star, quality, id) {
    this.title = title;
    this.body = body;
    this.star = star;
    this.quality = quality;
    this.id = id || Date.now();
  }
  saveToStorage() {}
  deleteFromStorage() {}
  updateIdea() {}
  updateQuality() {}
}