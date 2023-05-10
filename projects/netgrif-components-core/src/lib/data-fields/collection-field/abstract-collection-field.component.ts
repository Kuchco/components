import {Component, Inject, Input, Optional} from "@angular/core";
import {AbstractDataFieldComponent} from "../models/abstract-data-field-component";
import {NAE_INFORM_ABOUT_INVALID_DATA} from "../models/invalid-data-policy-token";
import {FormControl} from "@angular/forms";
import {CollectionField} from "./models/collection-field";

@Component({
    selector: 'ncc-abstract-enumeration-field',
    template: ''
})
export abstract class AbstractCollectionFieldComponent extends AbstractDataFieldComponent {
    /**
     * Task mongo string id is binding property from parent component.
     */
    @Input() public taskId: string;
    @Input() public dataField: CollectionField;
    protected constructor(@Optional() @Inject(NAE_INFORM_ABOUT_INVALID_DATA) informAboutInvalidData: boolean | null) {
        super(informAboutInvalidData);
        this._formControl = new FormControl('');
    }
}
