import {Component, Inject, Optional} from '@angular/core';
import {AbstractCollectionFieldComponent, NAE_INFORM_ABOUT_INVALID_DATA} from '@netgrif/components-core';

@Component({
    selector: 'nc-collection-field',
    templateUrl: './collection-field.component.html',
    styleUrls: ['./collection-field.component.scss']
})
export class CollectionFieldComponent extends AbstractCollectionFieldComponent {
    constructor(@Optional() @Inject(NAE_INFORM_ABOUT_INVALID_DATA) informAboutInvalidData: boolean | null) {
        super(informAboutInvalidData);
    }
}
