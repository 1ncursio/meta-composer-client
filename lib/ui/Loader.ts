// @ts-nocheck

import { DomHelper } from './DomHelper';

class Loader {
  startLoad() {
    let loadingDiv = this.getLoadingDiv();
    // loadingDiv.style.opacity = "1"
    DomHelper.showDiv(loadingDiv);
    this.getLoadingText().innerHTML = 'Loading';
    this.loading = true;
    // this.loadAnimation()
  }

  stopLoad() {
    DomHelper.hideDiv(this.getLoadingDiv(), true);
    this.loading = false;
  }
  // loadAnimation() {
  // 	let currentText = this.getLoadingText().innerHTML
  // 	currentText = currentText.replace("...", " ..")
  // 	currentText = currentText.replace(" ..", ". .")
  // 	currentText = currentText.replace(". .", ".. ")
  // 	currentText = currentText.replace(".. ", "...")
  // 	this.getLoadingText().innerHTML = currentText
  // 	if (this.loading) {
  // 		window.requestAnimationFrame(this.loadAnimation.bind(this))
  // 	}
  // }
  setLoadMessage(msg: string) {
    this.getLoadingText().innerHTML = msg + '...';
  }
  getLoadingText() {
    if (!this.loadingText) {
      this.loadingText = DomHelper.createElement('p');
      this.getLoadingDiv().appendChild(this.loadingText);
    }
    return this.loadingText;
  }
  getLoadingDiv() {
    if (!this.loadingDiv) {
      this.loadingDiv = DomHelper.createDivWithIdAndClass('loadingDiv', 'fullscreen');

      let spinner = DomHelper.createSpinner();
      this.loadingDiv.appendChild(spinner);
      document.body.appendChild(this.loadingDiv);
    }
    return this.loadingDiv;
  }
}

export const getLoader = () => loaderSingleton;
const loaderSingleton = new Loader();
