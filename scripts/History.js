import CurrencySelector from "./CurrencySelector.js";
import { ERRORS, RATES } from "./constants.js";

class History {
    historyOffsets = { 
        usd: [], 
        byn: [], 
        rub: [], 
        eur: [], 
        cny: []
    }

    selectors = {
        currencySelect: '[data-js-history-currency-select]',
        dateInput: '[data-js-history-date-input]',
        outcomeItem: '[data-js-history-outcome-item]',
        outcomeValue: '[data-js-history-outcome-value]',
        rateItem: '[data-js-history-rate-item]',
        rateValue: '[data-js-history-rate-value]',
        message: '[data-js-history-message]'
    }

    stateClasses = {
        isHidden: 'visually-hidden'
    }

    dataAttributes = {
        outcomeName: 'data-js-history-outcome-item',
        currencyName: 'data-currency-name',
    }

    constructor() {
        this.currencySelect = new CurrencySelector(this.selectors.currencySelect);
        this.dateInputElement = document.querySelector(this.selectors.dateInput);
        this.outcomeItemElements = document.querySelectorAll(this.selectors.outcomeItem);
        this.rateItemElements = document.querySelectorAll(this.selectors.rateItem);
        this.outcomeValueElements = document.querySelectorAll(this.selectors.outcomeValue);
        this.rateValueElements = document.querySelectorAll(this.selectors.rateValue);
        this.messageElement = document.querySelector(this.selectors.message);
        this.initHistory();
        this.bindEvents();
    }

    getTodayDateString() {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); 
        let yyyy = today.getFullYear();
        return yyyy + '-' + mm + '-' + dd
    }

    initHistory() {
        this.dateInputElement.value = this.getTodayDateString();
        this.generateOffsets();
        this.fillRateValues();
        this.fillOutcomeValues();
    }

    bindEvents() {
        this.dateInputElement.addEventListener('change', this.changeDate)
        this.currencySelect.bindOnChangeFunction(this.changeCurrency);
    }

    changeCurrency = () => {
        this.hideCurrencyOutcome();
        this.fillRateValues();
        this.fillOutcomeValues();
    }

    changeDate = () => {
        if (this.dateInputElement.value > this.getTodayDateString()) {
            this.messageElement.innerHTML = ERRORS.futureDate;
            this.dateInputElement.value = this.getTodayDateString();
        } else {
            this.messageElement.innerHTML = '';
        }
        this.fillOutcomeValues();
    }

    fillRateValues() {
        let rates = RATES[this.currencySelect.currentCurrency];
        [...this.rateValueElements].forEach(element => {
            let currency = element.getAttribute(this.dataAttributes.currencyName);
            element.innerHTML = rates[currency];
        })
    }

    fillOutcomeValues() {
        let dateOffsetIndex = this.getDateDifference(this.dateInputElement.valueAsDate, new Date());  
        if (dateOffsetIndex > 13) {
            dateOffsetIndex = 13;
        }
        let rates = RATES[this.currencySelect.currentCurrency];
        [...this.outcomeValueElements].forEach(element => {
            let currency = element.getAttribute(this.dataAttributes.currencyName)
            let outcome = Math.floor((rates[currency] + (rates[currency] * this.historyOffsets[currency][dateOffsetIndex])) * 10000) / 10000
            element.innerHTML = outcome;
        })
    }

    getDateDifference(date1, date2) {
        if (!date1 || !date2) return 0
        let differenceInTime = date2.getTime() - date1.getTime();
        return Math.round(differenceInTime / (1000 * 3600 * 24))
    }

    hideCurrencyOutcome() {
        [...this.outcomeItemElements].forEach(element => {
            let currency = element.getAttribute(this.dataAttributes.outcomeName);
            let isCurrent = currency === this.currencySelect.currentCurrency;
            element.classList.toggle(this.stateClasses.isHidden, isCurrent)
        })
    }

    generateOffsets() {
        for (let i=0; i<14; i++) {
            for (let element in this.historyOffsets) {
                let offset = Math.floor(Math.random() / 10 * 1000) / 1000;
                this.historyOffsets[element].push(offset)
            } 
        }
        console.log(this.historyOffsets)
    }
}

export default History;