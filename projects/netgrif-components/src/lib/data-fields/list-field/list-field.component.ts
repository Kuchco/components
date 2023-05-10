import {Component, Inject, OnInit, Optional} from '@angular/core';
import {AbstractListFieldComponent, DateField} from "netgrif-components-core";
import {NAE_INFORM_ABOUT_INVALID_DATA} from "@netgrif/components-core";

@Component({
    selector: 'nc-list-field',
    templateUrl: './list-field.component.html',
    styleUrls: ['./list-field.component.scss']
})
export class ListFieldComponent extends AbstractListFieldComponent {


    constructor(@Optional() @Inject(NAE_INFORM_ABOUT_INVALID_DATA) informAboutInvalidData: boolean | null) {
        super(informAboutInvalidData);
    }

    public upload() {
        this.uploadValue();
    }

    parseDataFieldToDateField(): DateField[] {
        return super.parseDataFieldToDateField()
    }
}
