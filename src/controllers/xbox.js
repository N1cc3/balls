
const XBOX_CONTROLLER_ID = 'Xbox 360 Controller (XInput STANDARD GAMEPAD)';

class XboxController {

  constructor() {
    this.gamepad = null;
    window.addEventListener('gamepadconnected', (event) => {
      console.log(this);
      this.connectGamepad(event);
    }, false);
    window.addEventListener('gamepaddisconnected', (event) => this.disconnectGamePad(event), false);
  }

  connectGamepad(event) {
    const gamepad = event.gamepad;
    console.log('gamepadconnected');
    if (gamepad.id === XBOX_CONTROLLER_ID) {
      this.gamepad = gamepad;
      console.log(this.gamepad);
    }
  }

  disconnectGamePad(event) {
    const gamepad = event.gamepad;
    console.log('gamepaddisconnected');
    if (gamepad.id === XBOX_CONTROLLER_ID && gamepad.index === this.gamepad.index)
      this.gamepad = null;
  }

  printPressed() {
    // console.log(this.gamepad);
    if (this.gamepad === null) return;

    for (let i = 0; i < this.gamepad.buttons.length; i++) {
      const button = this.gamepad.buttons[i];
      if (button.pressed)
        console.log(`Button ${i} pressed`);
    }

    for (let i = 0; i < this.gamepad.axes.length; i++) {
      const axis = this.gamepad.axes[i];
      if (axis > 0.5)
        console.log(`Axis ${i} has value ${axis}`);
    }
  }

}

export default XboxController;
