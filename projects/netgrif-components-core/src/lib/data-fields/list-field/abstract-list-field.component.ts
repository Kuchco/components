import {Component, Inject, Input, Optional} from "@angular/core";
import {FormControl} from "@angular/forms";
import {WrappedBoolean} from "../data-field-template/models/wrapped-boolean";
import {ListField} from "./models/list-field";
import {AbstractDataFieldComponent} from "../models/abstract-data-field-component";
import {NAE_INFORM_ABOUT_INVALID_DATA} from "../models/invalid-data-policy-token";
import {FieldTypeResource} from "../../task-content/model/field-type-resource";
import moment from "moment";
import {DateField} from "../date-field/models/date-field";
import ObjectId from 'bson-objectid';
import {UserListValue} from "../user-list-field/models/user-list-value";

@Component({
    selector: 'ncc-abstract-list-field',
    template: ''
})
export abstract class AbstractListFieldComponent extends AbstractDataFieldComponent {

    @Input() dataField: ListField;
    @Input() showLargeLayout: WrappedBoolean;
    /**
     * Task mongo string id is binding property from parent component.
     */
    @Input() public taskId: string;
    public fieldTypeEnum = FieldTypeResource;

    protected constructor(@Optional() @Inject(NAE_INFORM_ABOUT_INVALID_DATA) informAboutInvalidData: boolean | null) {
        super(informAboutInvalidData);
        this._formControl = new FormControl('');
    }

    public parseDataFieldToDateField() {
        let dateFieldsArray: DateField[] = [];
        for (let i = 0; i < this.dataField.value.length; i++) {
            let date;
            let item = this.dataField.value[i];
            if (item) {
                date = moment(new Date(item[0], item[1] - 1, item[2]));
            }
            let dateField = new DateField(item.stringId, item.title, date, item.behavior, item.placeholder,
                item.description, item.layout, item.validations, item.component, item.parentTaskId);
            dateFieldsArray.push(dateField);
        }
        return dateFieldsArray;
    }

    public uploadValue() {
        const existingValue: any[] = [];
        existingValue.push(...this.dataField.value);
        existingValue.push(null);
        this.dataField.value = existingValue;
    }
    public deleteValue(index: number) {
        let existingValue: any[] = [];
        existingValue.push(...this.dataField.value);
        existingValue.splice(index, 1);
        this.dataField.value = existingValue;
    }

    onValueChanged(event, index: number): void {
        let existingValue: any[] = [];
        existingValue.push(...this.dataField.value);
        existingValue[index] = event.target.value;
        this.dataField.value = existingValue;
    }

    // getErrorMessage() {
    //     return this.buildErrorMessage(this.dataField);
    // }
}
