import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="modal"
export default class extends Controller {
  static targets = ["modal"];

  openModal() {
    this.modalTarget.style.display = "block";
  };

  closeModal() {
    this.modalTarget.style.display = "none";
  };

  closeWithKeyboard(e) {
    if (e.code == "Escape") {
      this.closeModal();
    };
  };
}
