import {Behavior} from '../../models/behavior';
import {Layout} from '../../models/layout';
import {AbstractControl, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {FieldTypeResource} from '../../../task-content/model/field-type-resource';
import {Component} from '../../models/component';
import {Validation} from '../../models/validation';
import {Observable} from "rxjs";
import {debounceTime} from "rxjs/operators";
import {CollectionField} from "../../collection-field/models/collection-field";
import {ChoiceFieldValue} from "../../models/choice-field-value";

export enum EnumerationFieldValidation {
    WRONG_VALUE = 'wrongValue',
    REQUIRED = 'required'
}

export class EnumerationField extends CollectionField<any> {
    protected REQUEST_DEBOUNCE_TIME = 600;

    constructor(stringId: string, title: string, value: any,
                protected _choices: Array<ChoiceFieldValue>, collectionType: string, behavior: Behavior, placeholder?: string, description?: string,
                layout?: Layout, protected readonly _fieldType = FieldTypeResource.ENUMERATION,
                validations?: Array<Validation>, component?: Component, parentTaskId?: string) {
        super(stringId, title, value, behavior, placeholder, description, layout, validations, component, parentTaskId,
            collectionType);
    }

    set choices(choices: Array<ChoiceFieldValue>) {
        this._choices = choices;
    }

    get choices(): Array<ChoiceFieldValue> {
        return this._choices;
    }

    get fieldType(): FieldTypeResource {
        return this._fieldType;
    }

    public valueChanges(): Observable<string> {
        return this._value.pipe(debounceTime(this.REQUEST_DEBOUNCE_TIME));
    }

    protected resolveFormControlValidators(): Array<ValidatorFn> {
        const result = [];

        if (this.behavior.required) {
            result.push(Validators.required);
        }
        result.push((control: AbstractControl) => this.checkKey(control));

        return result;
    }

    private checkKey(control: AbstractControl): ValidationErrors | null {
        if (this._choices === undefined || this._choices.length === 0 || control.value === '' || control.value === undefined) {
            return null;
        }
        return this._choices.find(choice => choice.value === control.value || control.value === null) ? null : {wrongValue: true};
    }

    convertTimestampToDateTime(timestamp: number): Date {
        return new Date(timestamp);
    }
}
