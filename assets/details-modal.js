class DetailsModal extends HTMLElement {
  constructor() {
    super();
    this.detailsContainer = this.querySelector('details');
    this.summaryToggle = this.querySelector('summary');

    this.detailsContainer.addEventListener(
      'keyup',
      (event) => event.code.toUpperCase() === 'ESCAPE' && this.close()
    );
    this.summaryToggle.addEventListener(
      'click',
      this.onSummaryClick.bind(this)
    );
    const button = this.querySelector('button[type="button"]')
    if (button){
    button.addEventListener(
          'click',
          this.close.bind(this)
        );
    }
    this.summaryToggle.setAttribute('role', 'button');
  }

  isOpen() {
    return this.detailsContainer.hasAttribute('open');
  }

  onSummaryClick(event) {
    event.preventDefault();
    event.target.closest('details').hasAttribute('open')
      ? this.close()
      : this.open(event);
  }

  onBodyClick(event) {
    if (!this.contains(event.target) || event.target.classList.contains('modal-overlay')) this.close(false);
  }

  open(event) {
    this.onBodyClickEvent =
      this.onBodyClickEvent || this.onBodyClick.bind(this);
    event.target.closest('details').setAttribute('open', true);
    document.body.addEventListener('click', this.onBodyClickEvent);
    document.body.classList.add('overflow-hidden');
    setTimeout(function(){
      $('#Search-In-Modal').focus();
    },100)
    trapFocus(
      document.querySelector('.modal__container')
    );
  }

  close(focusToggle = true) {
    removeTrapFocus(focusToggle ? this.summaryToggle : null);
    this.detailsContainer.removeAttribute('open');
    document.body.removeEventListener('click', this.onBodyClickEvent);
    document.body.classList.remove('overflow-hidden');
  }
}

customElements.define('details-modal', DetailsModal);
