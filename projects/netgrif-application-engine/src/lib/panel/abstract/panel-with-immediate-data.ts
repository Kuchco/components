import {PanelWithHeaderBinding} from './panel-with-header-binding';
import {NaeDate, toMoment} from '../../resources/types/nae-date-type';
import {DATE_FORMAT_STRING, DATE_TIME_FORMAT_STRING} from '../../moment/time-formats';
import {TranslateService} from '@ngx-translate/core';
import {OnDestroy} from '@angular/core';

export abstract class PanelWithImmediateData extends PanelWithHeaderBinding implements OnDestroy {
    protected constructor(protected _translate: TranslateService) {
        super();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    protected parseImmediateValue(immediate) {
        if (immediate && immediate.value !== undefined || immediate && immediate.type === 'button') {
            switch (immediate.type) {
                case 'date':
                    return {value: toMoment(immediate.value as NaeDate).format(DATE_FORMAT_STRING), icon: 'event', type: immediate.type};
                case 'dateTime':
                    return {value: toMoment(immediate.value as NaeDate).format(DATE_TIME_FORMAT_STRING),
                        icon: 'event', type: immediate.type};
                case 'enumeration':
                    return {value: immediate.value.defaultValue, icon: undefined, type: immediate.type};
                case 'multichoice':
                    return {value: immediate.value.map(it => it.defaultValue).join(', '), icon: undefined, type: immediate.type};
                case 'file':
                    return {value: immediate.value?.name, icon: 'insert_drive_file', type: immediate.type};
                case 'fileList':
                    return {value: immediate.value?.namesPaths.map(obj => obj.name).join(',\n'),
                        icon: 'insert_drive_file', type: immediate.type};
                case 'user':
                    return {value: immediate.value.fullName, icon: 'account_circle', type: immediate.type};
                case 'boolean':
                    return {value: this._translate.instant('dataField.values.boolean.' + immediate.value),
                        icon: undefined, type: immediate.type};
                case 'button':
                    return {value: immediate.placeholder && immediate.placeholder.defaultValue !== undefined
                            ? immediate.placeholder.defaultValue : (immediate.name && immediate.name.defaultValue !== undefined
                                ? immediate.name.defaultValue : this._translate.instant('dialog.submit')),
                        icon: undefined, type: immediate.type};
                default:
                    return {value: immediate.value, icon: undefined, type: immediate.type};
            }
        } else {
            return {value: '', icon: '', type: ''};
        }
    }
}
