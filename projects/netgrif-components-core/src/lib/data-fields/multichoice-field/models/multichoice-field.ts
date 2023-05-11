import {Behavior} from '../../models/behavior';
import {Layout} from '../../models/layout';
import {FieldTypeResource} from '../../../task-content/model/field-type-resource';
import {Component} from '../../models/component';
import {Validation} from '../../models/validation';
import {CollectionField} from "../../collection-field/models/collection-field";
import {ChoiceFieldValue} from "../../models/choice-field-value";

export class MultichoiceField  extends CollectionField<Array<any>> {

    constructor(stringId: string, title: string, values: Array<any>, private _choices: Array<ChoiceFieldValue>,
                collectionType: string,
                behavior: Behavior, placeholder?: string, description?: string, layout?: Layout,
                private readonly _fieldType = FieldTypeResource.MULTICHOICE, validations?: Array<Validation>,
                component?: Component, parentTaskId?: string) {
        super(stringId, title, values, behavior, placeholder, description, layout, validations, component, parentTaskId,
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

    protected valueEquality(a: Array<string>, b: Array<string>): boolean {
        // we assume that multichoice options are always given in the same order
        return (!a && !b) || (
            !!a
            && !!b
            && a.length === b.length
            && a.every( (element, index) => element === b[index])
        );
    }
}
