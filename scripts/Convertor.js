import CurrencySelector from "./CurrencySelector.js";
import { RATES } from "./constants.js";

class Convertor {
    selectors = {
        root: '[data-js-convertor]',
        form: '[data-js-convertor-form]',
        currencySelect: '[data-js-convertor-currency-select]',
        amountInput: '[data-js-convertor-amount-input]',
        outcomeList: '[data-js-convertor-outcome-list]',
        outcomeItem: '[data-js-convertor-outcome-item]',
    }

    stateClasses = {
        isHidden: 'visually-hidden'
    }

    dataAttributes = {
        currencyName: 'data-js-convertor-outcome-item',
    }

    constructor() {
        this.rootElement = document.querySelector(this.selectors.root)
        this.formElement = this.rootElement.querySelector(this.selectors.form)
        this.amountInputElement = this.rootElement.querySelector(this.selectors.amountInput)
        this.outcomeListElement = this.rootElement.querySelector(this.selectors.outcomeList)
        this.outcomeItemElements = this.rootElement.querySelectorAll(this.selectors.outcomeItem)
        this.currencySelect = new CurrencySelector(this.selectors.currencySelect)
        this.bindEvents();
    }

    bindEvents() {
        this.currencySelect.bindOnChangeFunction(this.changeCurrency)
        this.amountInputElement.addEventListener('input', this.countOutcomes)
        this.formElement.addEventListener('submit', (e) => e.preventDefault())
    }

    changeCurrency = () => {
        this.hideCurrencyOutcome();
        this.countOutcomes();       
    }

    hideCurrencyOutcome() {
        [...this.outcomeItemElements].forEach(element => {
            let currency = element.getAttribute(this.dataAttributes.currencyName);
            let isCurrent = currency === this.currencySelect.currentCurrency;
            element.classList.toggle(this.stateClasses.isHidden, isCurrent)
        })
    }

    countOutcomes = () => {
        let amount = Number(this.amountInputElement.value);
        let rates = RATES[this.currencySelect.currentCurrency];
        [...this.outcomeItemElements].forEach(element => {
            let currency = element.getAttribute(this.dataAttributes.currencyName);
            let outcome = Math.floor(amount * rates[currency] * 10000) / 10000;
            element.lastElementChild.innerHTML = outcome;
        })
    }

}

export default Convertor;