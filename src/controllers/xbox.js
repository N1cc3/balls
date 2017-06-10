
const XBOX_CONTROLLER_ID = 'Xbox 360 Controller (XInput STANDARD GAMEPAD)';

const buttons = {
  'a': 0,
  'b': 1,
  'x': 2,
  'y': 3,
  'lb': 4,
  'rb': 5,
  'lt': 6,
  'rt': 7,
  'back': 8,
  'start': 9,
  'ls': 10,
  'rs': 11,
  'up': 12,
  'down': 13,
  'left': 14,
  'right': 15,
};

// The first axis is x, and the second is y.
// Negative x is left, negative y is up.
const axes = {
  'axis_left': [0, 1],
  'axis_right': [2, 3],
};

const events = {
  'button': [],
  'axis': [],
};

const callbacks = new Map();

class XboxController {

  constructor() {
    this.gamepadIdx = null;
    window.addEventListener('gamepadconnected', (event) => this.connectGamepad(event), false);
    window.addEventListener('gamepaddisconnected', (event) => this.disconnectGamePad(event), false);
  }

  connectGamepad(event) {
    const gamepad = event.gamepad;
    console.log('gamepadconnected');
    if (gamepad.id === XBOX_CONTROLLER_ID) {
      this.gamepadIdx = gamepad.index;
    }
  }

  disconnectGamePad(event) {
    const gamepad = event.gamepad;
    console.log('gamepaddisconnected');
    if (gamepad.id === XBOX_CONTROLLER_ID && gamepad.index === this.gamepad.index) {
      this.gamepad = null;
    }
  }

  updateEvents() {
    if (this.gamepadIdx === null) return;
    const gamepad = navigator.getGamepads()[this.gamepadIdx];

    Object.entries(buttons).forEach(([button, index]) => {
      if (gamepad.buttons[index].pressed) {
        events.button.push(createEvent(button, 1));
      }
    });

    Object.entries(axes).forEach(([axis, indices]) => {
      const axis0 = gamepad.axes[indices[0]];
      const axis1 = gamepad.axes[indices[1]];
      if (Math.abs(axis0) > 0.5 || Math.abs(axis1) > 0.5) {
        events.axis.push(createEvent(axis, [axis0, axis1]));
      }
    });
  }

  onButton(button, callback) {
    callbacks.set(button, callback);
  }

  handleEvents() {
    Object.values(events).forEach((eventArr) => {
      eventArr.forEach((event) => {
        if (callbacks.has(event.button)) {
          const callback = callbacks.get(event.button);
          callback({
            'value': event.value,
          });
        }
      });
    });
    events.button = [];
    events.axis = [];
  }

  handleInput() {
    this.updateEvents();
    this.handleEvents();
  }

}

// TODO: Add support for press, hold, and release?
function createEvent(button, value) {
  return {'button': button, 'value': value,};
}

export default XboxController;
