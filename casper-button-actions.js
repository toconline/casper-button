import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { IronFitBehavior } from '@polymer/iron-fit-behavior/iron-fit-behavior.js';
import { IronOverlayBehavior } from '@polymer/iron-overlay-behavior/iron-overlay-behavior.js';

class CasperButtonActions extends mixinBehaviors([IronOverlayBehavior, IronFitBehavior], PolymerElement) {

  static get template() {
    return html`
      <style>
        .actions-container {
          margin: 0;
          padding: 0;
          display: flex;
          border-radius: 4px;
          list-style-type: none;
          flex-direction: column;
          background-color: white;
          box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2),
                      0 4px 5px 0 rgba(0, 0, 0, 0.14),
                      0 1px 10px 0 rgba(0, 0, 0, 0.12);
        }

        .actions-container .action {
          padding: 15px;
          font-size: 14px;
          line-height: 14px;
          color: rgba(0, 0, 0, 0.87);
        }

        .actions-container .action:hover {
          cursor: pointer;
          background-color: rgba(0, 0, 0, 0.04);
        }
      </style>
      <ul class="actions-container">
        <template is="dom-repeat" items="[[actions]]">
          <li class="action" on-click="_onActionClick">
            [[item.text]]
          </li>
        </template>
      </ul>
    `;
  }

  static get is () {
    return 'casper-button-actions';
  }

  static get properties () {
    return {
      actions: {
        type: Array
      }
    };
  }

  _onActionClick (event) {
    // Prevent the event from bubbling up.
    event.stopImmediatePropagation();

    // Find the index of the clicked action to call its function.
    const actionClicked = event.target;
    const actionClickedIndex = [...actionClicked.parentNode.children].indexOf(actionClicked);

    this.actions[actionClickedIndex].onClick(event);
    this.close();
  }
}

window.customElements.define(CasperButtonActions.is, CasperButtonActions);
