import { Behavior } from '../../models/behavior';
import { Layout } from '../../models/layout';
import { Validation } from '../../models/validation';
import { Component } from '../../models/component';
import {AbstractControl, FormControl, ValidatorFn} from "@angular/forms";
import {ListField} from "../../list-field/models/list-field";
import {UserValue} from "../../user-field/models/user-value";

export class UserListField extends ListField {

    constructor(stringId: string, title: string, behavior: Behavior, value: Array<UserValue>, protected _collectionType: string,
                placeholder?: string, description?: string, layout?: Layout, validations?: Array<Validation>, component?: Component,
                parentTaskId?: string) {
        super(stringId, title, value, behavior, placeholder, description, layout, validations, component, parentTaskId, _collectionType);
    }

    protected valueEquality(a: any[], b: any[]): boolean {
        return (!a && !b) ||
            (!!a && !!b && a.length === b.length);
    }

    protected calculateValidity(forValidRequired: boolean, formControl: FormControl): boolean {
        const isDisabled = formControl.disabled;
        if (forValidRequired) {
            formControl.enable();
        }
        formControl.clearValidators();
        if (forValidRequired) {
            formControl.setValidators(this.behavior.required ? [this.requiredTrue] : []);
        } else {
            formControl.setValidators(this.resolveFormControlValidators());
        }
        formControl.updateValueAndValidity();
        const validity = this._determineFormControlValidity(formControl);
        isDisabled ? formControl.disable() : formControl.enable();
        return validity;
    }


    protected resolveFormControlValidators(): Array<ValidatorFn> {
        const result = [];

        if (this.behavior.required) {
            result.push(this.requiredTrue);
        }

        if (this.validations) {
            if (this._validators) {
                result.push(...this._validators);
            } else {
                this._validators = this.resolveValidations();
                result.push(...this._validators);
            }
        }

        return result;
    }

    private requiredTrue(control: AbstractControl): { [k: string]: boolean } {
        return !!control.value && !!control.value._userValues && control.value._userValues.length > 0 ? null : {requiredUserList: true};
    }

    public removeUserValue(value: UserValue): void {
        const index = this.value.findIndex(user => user.id === value.id);
        if (index > -1) {
            this.value.splice(index, 1);
        }
    }
}
