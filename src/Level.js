class Level {

  constructor() {
    this.objects = [];
    this.background = null;
    this.finish = null;
    this.playerObjects = [];
  }

  add(object) {
    this.objects.push(object);
  }

  setBackground(background) {
    this.background = background;
  }

  /**
   * When any of this.playerObjects collides with given body it is considered as reached finish.
   * @param {CANNON.Body} body
   */
  setFinish(body) {
    this.finish = body;
    console.log(this.finish);
  }

  /**
   * When added object collides with finish, the callback is called.
   * @param {Object}   object
   * @param {Function} callback Callback is given object as a parameter.
   */
  addFinishableObject(object, callback) {
    object.onCollide((e) => {
      if (e.contact.bi === this.finish || e.contact.bj === this.finish) {
        callback(object);
      }
    });
  }

}

export default Level;
