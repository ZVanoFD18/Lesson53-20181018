'use strict';

/**
 * SV - Super Validator
 */
class Sv {
    constructor(options) {
        this.validators = {};
    }

    isRegistered(vName) {
        return vName in this.validators;
    }

    reg(validator) {
        if (!(validator instanceof SvBaseValidator)) {
            throw new Error('Invalid validator type');
        }
        this.regByAlias(validator.vName, validator);
    }

    regByAlias(vName, validator) {
        if (!(validator instanceof SvBaseValidator)) {
            throw new Error('Invalid validator type');
        }
        this.validators[vName] = validator;
    }

    unreg(vName) {
        delete this.validators[vName];
    }

    getValidator(vName, silently) {
        silently = silently || false;
        let validator = this.validators[vName];
        if (!(validator instanceof SvBaseValidator) && !silently) {
            throw new Error('Validator not registered.');
        }
        return validator;
    }

    /**
     *
     * @param vName
     * @param value
     * @returns {SvBaseResult}
     */
    validate(vName, value) {
        let result = this.getValidator(vName).validate(value)
        return result;
    }

    bindForm(formEl) {
        let inputs = formEl.querySelectorAll('input');
        [].forEach.call(inputs, function (inputEl) {
            this.bindInput(inputEl);
        }, this);
        let selects = formEl.querySelectorAll('select');
        [].forEach.call(selects, function (inputEl) {
            this.bindInput(inputEl);
        }, this);
    }

    bindInput(inputEl) {
        let vName = inputEl.dataset.vName;
        if (!this.isRegistered(vName)) {
            console.log('@DEBUG: Unregistered vName(Validator Name) - ' + vName);
            return;
        }
        inputEl.addEventListener('keyup', (function (event) {
            this.validateEl(inputEl);
        }).bind(this));
        inputEl.addEventListener('blur', (function (event) {
            this.validateEl(inputEl);
        }).bind(this));
        inputEl.addEventListener('change', (function (event) {
            this.validateEl(inputEl);
        }).bind(this));
        // inputEl.addEventListener('focus', (function (event) {
        //     this.validateEl(inputEl);
        // }).bind(this));
    }
    validateEl (inputEl){
        console.log('validate', inputEl)
        let vName = inputEl.dataset.vName;
        if (!this.isRegistered(vName)) {
            console.log('@DEBUG: Unregistered vName(Validator Name) - ' + vName);
            return;
        }
        let vResult = SV.validate(vName, inputEl.value),
            errEl = inputEl.closest('label').querySelector('.sv-error');
        if (vResult.isValid) {
            inputEl.classList.remove('invalid');
            inputEl.classList.add('valid');
            if(errEl !== null){
                inputEl.closest('label').removeChild(errEl);
            }
        } else {
            if (errEl === null){
                errEl = document.createElement('div');
                errEl.classList.add('sv-error');
                inputEl.closest('label').appendChild(errEl )
            }
            errEl.innerHTML = vResult.errMessage;
            inputEl.classList.remove('valid');
            inputEl.classList.add('invalid');
        }
    }
};

const SV = new Sv();