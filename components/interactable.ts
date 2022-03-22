export default AFRAME.registerComponent('gui-interactable', {
  schema: {
    clickAction: { type: 'string' },
    hoverAction: { type: 'string' },
    keyCode: { type: 'number', default: -1 },
    key: { type: 'string' },
  },
  init: function () {
    const _this = this;
    const data = this.data;
    const el = this.el;

    if (data.keyCode > 0) {
      window.addEventListener(
        'keydown',
        (event) => {
          event.preventDefault();
          const key = event.key || event.keyCode;

          // console.log('in keydown handler, event key: ' + event.key);
          if (key === data.key || key === data.keyCode) {
            el.emit('click');
          }

          //   if (event.key == data.key) {
          //     //    console.log("key press by gui-interactable, key: " + data.key);
          //     el.emit("click");
          //   } else if (event.keyCode == data.keyCode) {
          //     //    console.log("key press by gui-interactable, keyCode: " + data.keyCode);
          //     el.emit("click");
          //   }
        },
        true,
      );
    }
  },
  update() {},
  tick() {},
  remove() {},
  pause() {},
  play() {},
  setClickAction(action: string) {
    this.data.clickAction = action; //change function dynamically
  },
});
