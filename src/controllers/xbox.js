
const XBOX_CONTROLLER_ID = "Xbox 360 Controller (XInput STANDARD GAMEPAD)";

class XboxController {

  constructor() {
    this.gamepad = null;
    window.addEventListener("gamepadconnected", this.connectGamepad);
    window.addEventListener("gamepaddisconnected", this.disconnectGamePad);
  }

  connectGamepad(event) {
    let gamepad = event.gamepad;
    console.log("gamepadconnected");
    if (gamepad.id === XBOX_CONTROLLER_ID) {
      this.gamepad = gamepad;
    }
  }

  disconnectGamePad(event) {
    let gamepad = event.gamepad;
    console.log("gamepaddisconnected");
    if (gamepad.id === XBOX_CONTROLLER_ID && gamepad.index === this.gamepad.index) {
      this.gamepad = null;
    }
  }

  printPressed() {
    if (this.gamepad === null) return;

    for (let i = 0; i < this.gamepad.buttons.length(); i++) {
      let button = this.gamepad.buttons[i];
      if (button.pressed) {
        console.log(`Button ${i} pressed`);
      }
    }

    for (let i = 0; i < this.gamepad.axes.length(); i++) {
      let axis = this.gamepad.axes[i];
      console.log(`Axis ${i} has value ${axis}`);
    }
  }

}

export default XboxController;
