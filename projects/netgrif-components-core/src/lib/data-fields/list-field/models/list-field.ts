import {Behavior} from "../../models/behavior";
import {Component} from "../../models/component";
import {Validation} from "../../models/validation";
import {Layout} from "../../models/layout";
import {CollectionField} from "../../collection-field/models/collection-field";
import {UserValue} from "../../user-field/models/user-value";
import {FieldTypeResource} from "../../../task-content/model/field-type-resource";

export class ListField extends CollectionField<Array<any>> {

    constructor(stringId: string, title: string, value: Array<any>, behavior: Behavior, placeholder: string,
                description: string, layout: Layout, validations: Array<Validation>, component: Component,
                parentTaskId: string, collectionType: string) {
        super(stringId, title, value, behavior, placeholder, description, layout, validations, component, parentTaskId,
            collectionType);
    }

    public getLast(): UserValue {
        if (this.value.length == 0) {
            if (this._collectionType === FieldTypeResource.USER) {
                return new UserValue('', '', '', '');
            } else {
                return undefined;
            }
        }
        return this.value[this.value.length - 1];
    }
}
