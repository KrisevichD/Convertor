import { FLAG_URLS } from "./constants.js"

class CurrencySelector {
    iconSelector = 'img'
    labelName = 'data-code-name'

    constructor(rootSelector) {
        this.rootElement = document.querySelector(rootSelector)
        this.selectorElement = this.rootElement.querySelector('select')
        this.optionElements = this.selectorElement.querySelectorAll('option')
        this.currencyIconElement = this.rootElement.querySelector(this.iconSelector)
        this.currentCurrency = this.selectorElement.value;
        this.bindEvents();
    }

    bindEvents() {
        this.selectorElement.addEventListener('change', this.changeCurrentCurrency)
    }

    bindOnChangeFunction(func) {
        this.selectorElement.addEventListener('change', func)
    }

    changeCurrentCurrency = () => {
        this.currentCurrency = this.selectorElement.value;
        this.handleSelect();
    }

    handleSelect() {
        this.optionElements.forEach(e => {
            e.label = e.innerHTML;
            if (e.selected) {
                e.label = e.getAttribute(this.labelName)
            }
        })
        this.currencyIconElement.src = FLAG_URLS[this.currentCurrency]
    }

}

export default CurrencySelector;