class Level {

  constructor() {
    this.objects = [];
    this.background = null;
  }

  add(object) {
    this.objects.push(object);
  }

  setBackground(background) {
    this.background = background;
  }

}

export default Level;
