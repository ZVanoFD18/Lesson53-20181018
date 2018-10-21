'use strict';
class SvBaseValidator {
    constructor (){
        this.vMethod = undefined;
        this.V_METHODS = {
            REGEX : 'VM_REGEX',
            CALLBACK : 'VM_CALLBACK'
        }
        this.vName = undefined;
        this.vCallback = undefined;
        this.vRegex = /.*/;
        this.vResult = new SvBaseResult();
        this.vInvalidText = 'Invalid';
    }
    validate (value){
        this.vResult.clean();
        switch (this.vMethod) {
            case this.V_METHODS.REGEX :
                return this._validateRegex(value);
                break;
            case this.V_METHODS.CALLBACK:
                return this._validateCallback(value);
                break;
            default :
                throw new Error('Invalid validation method');
        }
        return this.vResult;
    }
    _validateRegex (value){
        let isValid = this.vRegex.test(value);
        if (!isValid){
            this.vResult.addMessage( this.vInvalidText);
        }
        return this.vResult;
    }
    _validateCallback (value){
        let isValid = this.vCallback(value);
        if (!isValid){
            if (this.vResult.errMessages.length < 1){
                this.vResult.addMessage( this.vInvalidText);
            }
        }
        return this.vResult;
    }

}