// @ts-nocheck

export default AFRAME.registerComponent('handle-piano-position', {
  init() {
    this.el.addEventListener('click', this.onClick.bind(this));
  },
  onClick(e) {
    console.log('click', e);
  },
});
