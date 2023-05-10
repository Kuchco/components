import {DataField} from '../../models/abstract-data-field';
import {Behavior} from '../../models/behavior';
import {Layout} from '../../models/layout';
import {FieldTypeResource} from '../../../task-content/model/field-type-resource';
import {Component} from '../../models/component';
import {Validation} from '../../models/validation';
import {Moment} from "moment";
import {UserValue} from "../../user-field/models/user-value";
import {FileFieldValue} from "../../file-field/models/file-field-value";
import {I18nFieldValue} from "../../i18n-field/models/i18n-field-value";
import {CollectionField} from "../../collection-field/models/collection-field";

export interface MultichoiceFieldValue {
    key: string;
    value: Moment | number | UserValue | FileFieldValue | I18nFieldValue | string;
}

export class MultichoiceField  extends DataField<Array<any>> implements CollectionField {

    constructor(stringId: string, title: string, values: Array<any>, private _choices: Array<MultichoiceFieldValue>,
                protected _collectionType: string,
                behavior: Behavior, placeholder?: string, description?: string, layout?: Layout,
                private readonly _fieldType = FieldTypeResource.MULTICHOICE, validations?: Array<Validation>,
                component?: Component, parentTaskId?: string) {
        super(stringId, title, values, behavior, placeholder, description, layout, validations, component, parentTaskId);
    }

    set choices(choices: Array<MultichoiceFieldValue>) {
        this._choices = choices;
    }

    get choices(): Array<MultichoiceFieldValue> {
        return this._choices;
    }

    get fieldType(): FieldTypeResource {
        return this._fieldType;
    }

    protected valueEquality(a: Array<string>, b: Array<string>): boolean {
        // we assume that multichoice options are always given in the same order
        return (!a && !b) || (
            !!a
            && !!b
            && a.length === b.length
            && a.every( (element, index) => element === b[index])
        );
    }

    set collectionType(value: string) {
        this._collectionType = value;
    }

    get collectionType(): string {
        return this._collectionType.toString();
    }
}
