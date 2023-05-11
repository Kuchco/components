import { DataField } from "../../models/abstract-data-field";
import {Behavior} from "../../models/behavior";
import {Layout} from "../../models/layout";
import {Validation} from "../../models/validation";
import {Component} from "../../models/component";

export abstract class CollectionField<T> extends DataField<T> {
    protected constructor(stringId: string, title: string, value: T, behavior: Behavior, placeholder: string,
                          description: string, layout: Layout, validations: Array<Validation>, component: Component,
                          parentTaskId: string, protected _collectionType: string) {
        super(stringId, title, value, behavior, placeholder, description, layout, validations, component, parentTaskId);
    }

    set collectionType(value: string) {
        this._collectionType = value;
    }

    get collectionType(): string {
        return this._collectionType.toString();
    }
}
