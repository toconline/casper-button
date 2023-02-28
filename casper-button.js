import './casper-button-actions.js';
import '@polymer/paper-button/paper-button.js';
import '@cloudware-casper/casper-icons/casper-icon.js';
import '@polymer/paper-spinner/paper-spinner-lite.js';
import '@vaadin/vaadin-progress-bar/vaadin-progress-bar.js';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';

const customStyle = document.createElement('template');
customStyle.innerHTML = `
  <custom-style>
    <style>
      html {
        --smooth-action: {
          -webkit-transition: all 0.2s;
          -o-transition: all 0.2s;
          transition: all 0.2s;
        }

        --smooth-action-hover: {
          -webkit-transition: all 0.5s;
          -o-transition: all 0.5s;
          transition: all 0.5s;
        }

        --mixin-button: {
          margin: 12px;
          font-weight: 900;
          text-align: center;
          -webkit-font-smoothing: antialiased;
          color: var(--on-primary-color, white);
          border-radius: var(--radius-buttons, 3px);
          font-size: var(--default-button-size, 14px);
          background-color: var(--primary-color, red);
          border-width: var(--mixin-button_-_border-width, 0);
          border-style: var(--mixin-button_-_border-style, solid);
          border-color: var(--mixin-button_-_border-color, none);
          @apply --smooth-action;
        }

        --mixin-button-hover: {
          background-color: var(--light-primary-color, var(--self-primary-variant-color));
          color: var(--primary-color);
          @apply --smooth-action-hover;
        }
      }
    </style>
  </custom-style>
`;

document.head.appendChild(customStyle.content);

class CasperButton extends PolymerElement {

  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          margin: 0 10px 4px 0;
          --lumo-border-radius: 0;
          --lumo-primary-color: var(--primary-color);
        }

        paper-button {
          margin: 0 !important;
          padding: 0;
          width: 100%;
          overflow: hidden;
          position: relative;
          background-color: var(--self-primary-color, var(--primary-color, green));
          @apply --mixin-button;
        }

        paper-button:hover {
          @apply --mixin-button-hover;
        }

        :host([disabled]) {
          pointer-events: none;
        }

        paper-button[disabled] {
          cursor: auto;
          color: #A8A8A8;
          background: #EAEAEA;
          pointer-events: none;
          transition: background-color 0.5s;
        }

        vaadin-progress-bar {
          top: 0;
          left: 0;
          margin: 0;
          height: 36px;
          display: none;
          position: absolute;
        }

        paper-button paper-spinner-lite {
          left: 0;
          right: 0;
          width: 22px;
          height: 22px;
          margin-left: auto;
          margin-right: auto;
          position: absolute;
          --paper-spinner-color: white;
          --paper-spinner-stroke-width: 4px;
        }

        paper-button#mainButton {
          flex-grow: 1;
          padding: 0 15px;
        }

        paper-button#actionsButton {
          width: auto;
          padding: 0 10px;
          font-size: 13px;
          min-width: unset;
          border-radius: var(--mixin-button_-_border-radius, 3px);
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          border-left: 1px solid rgba(255,255,255,0.5);
        }

        paper-button #buttonText {
          display: flex;
          align-items: center;
        }

        paper-button {
          height: var(--mixin-button_-_height, 36px);
        }

        paper-button.small {
          height: 24px;
        }


        paper-button.decline-button {
          background: #BDBDBD;
        }

        paper-button.decline-button:hover {
          background-color: #8E8E8E;
        }

        ::slotted(a) {
          color: white;
          text-decoration: none;
        }

      </style>
      <paper-button id="mainButton" class$="[[sizeClass]]" on-click="_mainButtonClicked" part="main-button">
        <span id="buttonText" class$="text [[sizeClass]]">
          <slot>Concordo e aceito</slot>
        </span>
        <vaadin-progress-bar value="0" id="progressBar"></vaadin-progress-bar>
        <paper-spinner-lite id="spin"></paper-spinner-lite>
      </paper-button>
      <template is="dom-if" if="[[actions]]">
        <paper-button id="actionsButton" class$="[[sizeClass]]" on-click="_actionsButtonClicked">
          <casper-icon icon="fa-regular:angle-down"></casper-icon>
        </paper-button>
        <casper-button-actions no-overlap="" vertical-align="top" actions="[[actions]]" horizontal-align="right">
        </casper-button-actions>
      </template>
    `;
  }

  static get is () {
    return 'casper-button';
  }

  static get properties() {
    return {
      size: {
        type: String,
        value: 'm'
      },
      progress: {
        type: String,
        value: 0,
        observer: '_progressChanged'
      },
      disabled: {
        type: Boolean,
        observer: '_disabledChanged'
      },
      cssClass: {
        type: String
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();

    afterNextRender(this, () => {
      this._actionsButtonOverlay = this.shadowRoot.querySelector('casper-button-actions');
      this._actionsButton = this._actionsButton || this.shadowRoot.querySelector('#actionsButton');

      if (!this._actionsButton || !this._actionsButtonOverlay) return;

      this._actionsButtonOverlay.positionTarget = this._actionsButton;
      this._actionsButtonOverlay.addEventListener('iron-overlay-canceled', event => {
        if (event.detail.composedPath().includes(this._actionsButton)) {
          event.preventDefault();
        }
      });
    });
  }

  ready() {
    super.ready();
    if (this.cssClass) {
      this.shadowRoot.querySelector('paper-button').classList.add(this.cssClass);
    }

    this.sizeClass = this.size == 's' ? 'small' : '';
    this.spinnerTimer = undefined;

    if ( this.actions ) {
      this.shadowRoot.querySelector("#mainButton").style.borderTopRightRadius = 0;
      this.shadowRoot.querySelector("#mainButton").style.borderBottomRightRadius = 0;
    }

    // Remove the default margin.
    if (this.hasAttribute('no-container-margin')) this.style.margin = 0;

    // Set the width to auto instead of occupying 100% of the available space.
    if (this.hasAttribute('full-width')) this.style.width = '100%';

    // Used an attribute and not the this.actions.length > 0 to avoid afterNextRender and further blinking.
    if (this.hasAttribute('has-actions')) this.$.mainButton.style.borderRadius = '3px 0 0 3px';

    // This is used to not let disabled clicks go through the DOM tree.
    this.addEventListener('click', event => {
      if (this.disabled) event.stopImmediatePropagation();
    });
  }

  _disabledChanged (newValue) {
    afterNextRender(this, () => {
      this.$.mainButton.disabled = newValue;

      if (this.actions) {
        this._actionsButton = this._actionsButton || this.shadowRoot.querySelector('#actionsButton');
        this._actionsButton.disabled = newValue;
      }
    });
  }

  _progressChanged (newValue) {
    if (newValue == 0) {
      this.submitting(false);
      this.$.progressBar.style.display = 'none';
    } else {
      this.$.progressBar.style.display = 'block';
    }

    this.$.progressBar.value = newValue / 100;
  }

  submitting (status) {
    this.disableButton(status);

    if (status == true) {
      this.spinnerTimer = setTimeout(() => this.spinButton(status), 200);
      this.$.buttonText.style.opacity = 0;
    } else {
      this.progress = 0;
      if (this.spinnerTimer) {
        clearTimeout(this.spinnerTimer);
      }

      this.spinButton(status);
      this.$.buttonText.style.opacity = 1;
    }

    window.dispatchEvent(new CustomEvent('casper-button-status', { detail: { target: this, submitting: status } }));
  }

  disableButton (status) {
    this.$.mainButton.disabled = status;
  }

  spinButton (status) {
    this.$.spin.active = status;
  }

  operationComplete (text) {
    this.progress = 0;
    this.disabled = true;
    clearTimeout(this.spinnerTimer);
    this.spinnerTimer = undefined;
    this.$.spin.active = false;
    this.$.buttonText.innerText = text || '';
    this.$.buttonText.style.opacity = 1;
  }

  _mainButtonClicked (event) {
    if (this.disabled) {
      // Prevent the event from bubbling up.
      event.stopImmediatePropagation();
      return;
    }

    const anchorElement = this.querySelector('a');
    if (anchorElement && anchorElement.link && anchorElement.link.getAttribute('href')) {
      this.submitting(true);
    }
  }

  _actionsButtonClicked (event) {
    // Prevent the event from bubbling up.
    event.stopImmediatePropagation();

    if (this.disabled) return;

    this._actionsButtonOverlay.toggle();
  }
}

window.customElements.define(CasperButton.is, CasperButton);
