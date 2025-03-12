import { RATES, FLAG_URLS } from "./constants.js";

class Convertor {
    selectors = {
        root: '[data-js-convertor]',
        form: '[data-js-convertor-form]',
        currencySelect: '[data-js-convertor-currency-select]',
        currencyIcon: '[data-js-convertor-currency-icon]',
        amountInput: '[data-js-convertor-amount-input]',
        outcomeList: '[data-js-convertor-outcome-list]',
        outcomeItem: '[data-js-convertor-outcome-item]',
    }

    stateClasses = {
        isHidden: 'visually-hidden'
    }

    dataAttributes = {
        currencyName: 'data-js-convertor-outcome-item',
        labelName: 'data-code-name'
    }

    constructor() {
        this.rootElement = document.querySelector(this.selectors.root)
        this.formElement = this.rootElement.querySelector(this.selectors.form)
        this.currencySelectorElement = this.rootElement.querySelector(this.selectors.currencySelect)
        this.currencyOptionElements = this.currencySelectorElement.querySelectorAll('option')
        this.currencyIconElement = this.rootElement.querySelector(this.selectors.currencyIcon)
        this.amountInputElement = this.rootElement.querySelector(this.selectors.amountInput)
        this.outcomeListElement = this.rootElement.querySelector(this.selectors.outcomeList)
        this.outcomeItemElements = this.rootElement.querySelectorAll(this.selectors.outcomeItem)
        this.currentCurrency = this.currencySelectorElement.value;

        this.bindEvents();
    }

    bindEvents() {
        this.currencySelectorElement.addEventListener('change', this.changeCurrentCurrency)
        this.amountInputElement.addEventListener('input', this.countOutcomes)
        this.formElement.addEventListener('submit', (e) => e.preventDefault())
    }

    changeCurrentCurrency = () => {
        this.currentCurrency = this.currencySelectorElement.value;
        this.hideCurrencyOutcome();
        this.countOutcomes();
        this.handleSelect();
        
    }

    handleSelect() {
        this.currencyOptionElements.forEach(e => {
            e.label = e.innerHTML;
            if (e.selected) {
                e.label = e.getAttribute(this.dataAttributes.labelName)
            }
            e.classList.toggle('active-tab', e.selected);
        })
        this.currencyIconElement.src = FLAG_URLS[this.currentCurrency]
    }

    hideCurrencyOutcome() {
        [...this.outcomeItemElements].forEach(element => {
            const currency = element.getAttribute(this.dataAttributes.currencyName);
            const isCurrent = currency === this.currentCurrency;
            element.classList.toggle(this.stateClasses.isHidden, isCurrent)
        })
    }

    countOutcomes = () => {
        const amount = Number(this.amountInputElement.value);
        const rates = RATES[this.currentCurrency];
        [...this.outcomeItemElements].forEach(element => {
            const currency = element.getAttribute(this.dataAttributes.currencyName);
            const outcome = Math.floor(amount * rates[currency] * 10000) / 10000;
            element.lastElementChild.innerHTML = outcome;
        })
    }

}

export default Convertor;