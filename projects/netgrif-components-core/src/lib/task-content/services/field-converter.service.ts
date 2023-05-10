import {Injectable} from '@angular/core';
import {DataFieldResource} from '../model/resource-interface';
import {DataField} from '../../data-fields/models/abstract-data-field';
import {BooleanField} from '../../data-fields/boolean-field/models/boolean-field';
import {TextField} from '../../data-fields/text-field/models/text-field';
import {NumberField} from '../../data-fields/number-field/models/number-field';
import {EnumerationField, EnumerationFieldValue} from '../../data-fields/enumeration-field/models/enumeration-field';
import {MultichoiceField, MultichoiceFieldValue} from '../../data-fields/multichoice-field/models/multichoice-field';
import {DateField} from '../../data-fields/date-field/models/date-field';
import {DateTimeField} from '../../data-fields/date-time-field/models/date-time-field';
import {UserField} from '../../data-fields/user-field/models/user-field';
import {ButtonField} from '../../data-fields/button-field/models/button-field';
import {FileField} from '../../data-fields/file-field/models/file-field';
import moment from 'moment';
import {UserValue} from '../../data-fields/user-field/models/user-value';
import {FieldTypeResource} from '../model/field-type-resource';
import {FileListField} from '../../data-fields/file-list-field/models/file-list-field';
import {TextAreaField} from '../../data-fields/text-field/models/text-area-field';
import {Component} from '../../data-fields/models/component';
import {TaskRefField} from '../../data-fields/task-ref-field/model/task-ref-field';
import {DynamicEnumerationField} from '../../data-fields/enumeration-field/models/dynamic-enumeration-field';
import {FilterField} from '../../data-fields/filter-field/models/filter-field';
import {I18nField} from '../../data-fields/i18n-field/models/i18n-field';
import {UserListField} from '../../data-fields/user-list-field/models/user-list-field';
import {ListField} from "../../data-fields/list-field/models/list-field";
import {CollectionField} from "../../data-fields/collection-field/models/collection-field";

@Injectable({
    providedIn: 'root'
})
export class FieldConverterService {
    private textFieldNames = ['textarea', 'richtextarea', 'htmltextarea', 'editor', 'htmlEditor', 'area']

    constructor() {
    }

    public toClass(item: DataFieldResource): DataField<any> {
        switch (item.type) {
            case FieldTypeResource.LIST:
                return this.resolveListField(item);
            case FieldTypeResource.BOOLEAN:
                return new BooleanField(item.stringId, item.name, item.value as boolean, item.behavior,
                    item.placeholder, item.description, item.layout, item.validations, item.component, item.parentTaskId);
            case FieldTypeResource.TEXT:
                if (this.textFieldNames.includes(item.component?.name)) {
                    return new TextAreaField(item.stringId, item.name, this.resolveTextValue(item, item.value), item.behavior,
                        item.placeholder, item.description, item.layout, item.validations, item.component, item.parentTaskId);
                }
                return new TextField(item.stringId, item.name, this.resolveTextValue(item, item.value), item.behavior, item.placeholder,
                    item.description, item.layout, item.validations, item.component, item.parentTaskId);
            case FieldTypeResource.NUMBER:
                return new NumberField(item.stringId, item.name, item.value as number, item.behavior, item.validations, item.placeholder,
                    item.description, item.layout, item.formatFilter, this.resolveNumberComponent(item), item.parentTaskId);
            case FieldTypeResource.ENUMERATION:
            case FieldTypeResource.ENUMERATION_MAP:
                return this.resolveEnumField(item);
            case FieldTypeResource.MULTICHOICE:
            case FieldTypeResource.MULTICHOICE_MAP:
                return this.resolveMultichoiceField(item);
            case FieldTypeResource.DATE:
                let date;
                if (item.value) {
                    date = moment(new Date(item.value[0], item.value[1] - 1, item.value[2]));
                }
                return new DateField(item.stringId, item.name, date, item.behavior, item.placeholder,
                    item.description, item.layout, item.validations, item.component, item.parentTaskId);
            case FieldTypeResource.DATE_TIME:
                let dateTime;
                if (item.value) {
                    dateTime = moment(new Date(item.value[0], item.value[1] - 1, item.value[2], item.value[3], item.value[4]));
                }
                return new DateTimeField(item.stringId, item.name, dateTime, item.behavior,
                    item.placeholder, item.description, item.layout, item.validations, item.component, item.parentTaskId);
            case FieldTypeResource.USER:
                let user;
                if (item.value) {
                    user = new UserValue(item.value.id, item.value.name, item.value.surname, item.value.email);
                }
                return new UserField(item.stringId, item.name, item.behavior, user,
                    item.roles, item.placeholder, item.description, item.layout, item.validations, item.component, item.parentTaskId);
            case FieldTypeResource.BUTTON:
                return new ButtonField(item.stringId, item.name, item.behavior, item.value as number,
                    item.placeholder, item.description, item.layout, item.validations, item.component, item.parentTaskId);
            case FieldTypeResource.FILE:
                return new FileField(item.stringId, item.name, item.behavior, item.value ? item.value : {},
                    item.placeholder, item.description, item.layout, null, null, item.validations, item.component,
                    item.parentTaskId);
            case FieldTypeResource.TASK_REF:
                return new TaskRefField(item.stringId, item.name, item.value ? item.value : [], item.behavior,
                    item.placeholder, item.description, item.layout, item.validations, item.component, item.parentTaskId);
            case FieldTypeResource.FILTER:
                return new FilterField(item.stringId, item.name, item.value ?? '', item.filterMetadata, item.allowedNets,
                    item.behavior, item.placeholder, item.description, item.layout, item.validations, item.component, item.parentTaskId);
            case FieldTypeResource.I18N:
                return new I18nField(item.stringId, item.name, item.value ?? {defaultValue: ''}, item.behavior, item.placeholder,
                    item.description, item.layout, item.validations, item.component);
        }
    }

    public resolveType(item: DataField<any>): FieldTypeResource {
        if (item instanceof BooleanField) {
            return FieldTypeResource.BOOLEAN;
        } else if (item instanceof ButtonField) {
            return FieldTypeResource.BUTTON;
        } else if (item instanceof TextField) {
            return FieldTypeResource.TEXT;
        } else if (item instanceof NumberField) {
            return FieldTypeResource.NUMBER;
        } else if (item instanceof DateField) {
            return FieldTypeResource.DATE;
        } else if (item instanceof DateTimeField) {
            return FieldTypeResource.DATE_TIME;
        } else if (item instanceof FileField) {
            return FieldTypeResource.FILE;
        } else if (item instanceof UserField) {
            return FieldTypeResource.USER;
        } else if (item instanceof TaskRefField) {
            return FieldTypeResource.TASK_REF;
        } else if (item instanceof EnumerationField || item instanceof MultichoiceField) {
            return item.fieldType;
        } else if (item instanceof FilterField) {
            return FieldTypeResource.FILTER;
        } else if (item instanceof I18nField) {
            return FieldTypeResource.I18N;
        } else if (item instanceof ListField || item instanceof FileListField || item instanceof UserListField) {
            return FieldTypeResource.LIST;
        }
    }

    public formatValueForBackend(field: DataField<any>, value: any): any {
        if (this.resolveType(field) === FieldTypeResource.TEXT && value === null) {
            return null;
        }
        if (this.resolveType(field) === FieldTypeResource.TEXT && field.component && field.component.name === 'password') {
            return btoa(value);
        }
        if (value === undefined || value === null) {
            return;
        }
        if (this.resolveType(field) === FieldTypeResource.DATE) {
            if (moment.isMoment(value)) {
                return value.format('YYYY-MM-DD');
            }
        }
        if (this.resolveType(field) === FieldTypeResource.USER) {
            return value.id;
        }
        if (this.resolveType(field) === FieldTypeResource.USER_LIST) {
            return value.userValues.map(u => u.id);
        }
        if (this.resolveType(field) === FieldTypeResource.DATE_TIME) {
            if (moment.isMoment(value)) {
                return value.format('DD.MM.YYYY HH:mm:ss');
            }
        }
        if (this.resolveType(field) === FieldTypeResource.ENUMERATION) {
            return this.formatCollectionValueForBackEnd(value, (field as EnumerationField).collectionType);
        }
        if (this.resolveType(field) === FieldTypeResource.MULTICHOICE) {
            return value.map((element) => this.formatCollectionValueForBackEnd(element, (field as MultichoiceField).collectionType));
        }
        if (this.resolveType(field) === FieldTypeResource.LIST) {
            return value.map((element) => this.formatCollectionValueForBackEnd(element, (field as ListField).collectionType));
        }
        return value;
    }

    protected resolveNumberComponent(numberField: DataFieldResource): Component {
        let numberComponent = {name: 'default', properties: undefined};
        if (numberField.component !== undefined) {
            numberComponent = {
                name: numberField.component.name,
                properties: numberField.component.properties
            };
        }
        return numberComponent;
    }

    /**
     * Resolves `enumeration` and `eunumeration_map` fields into their appropriate class instances
     * @param enumField enumeration field resource
     */
    protected resolveEnumField(enumField: DataFieldResource): EnumerationField {
        const options = enumField.type === FieldTypeResource.ENUMERATION
            ? this.resolveEnumChoices(enumField)
            : this.resolveEnumOptions(enumField);
        let enumValue;
        if (enumField.value) {
            enumValue = this.formatCollectionValueFromBackend(enumField.value, enumField.collectionType);
        }
        if (enumField.component && enumField.component.name === 'autocomplete_dynamic') {
            return new DynamicEnumerationField(enumField.stringId, enumField.name, enumValue, options,
                enumField.collectionType,
                enumField.behavior, enumField.placeholder, enumField.description, enumField.layout,
                enumField.type, enumField.validations, enumField.component, enumField.parentTaskId);
        } else {
            return new EnumerationField(enumField.stringId, enumField.name, enumValue, options,
                enumField.collectionType,
                enumField.behavior, enumField.placeholder, enumField.description, enumField.layout,
                enumField.type, enumField.validations, enumField.component, enumField.parentTaskId);
        }
    }

    /**
     * This function is used to parse enumeration options from the `choices` attribute
     * @param enumField enumeration field resource object who's choices we want to resolve
     * @returns the options for the enumeration field
     */
    protected resolveEnumChoices(enumField: DataFieldResource): Array<EnumerationFieldValue> {
        const enumChoices = [];
        if (enumField.choices instanceof Array) {
            enumField.choices.forEach(it => {
                enumChoices.push({
                    key: it.toString(),
                    value: this.formatCollectionValueFromBackend(it, enumField.collectionType)
                } as EnumerationFieldValue);
            });
        } else {
            Object.keys(enumField.choices).forEach(key => {
                enumChoices.push({key, value: enumField.choices[key]} as EnumerationFieldValue);
            });
        }
        return enumChoices;
    }

    /**
     * This function is used to parse enumeration options from the `options` attribute
     * @param enumField enumeration field resource object who's options we want to resolve
     * @returns the options for the enumeration field
     */
    protected resolveEnumOptions(enumField: DataFieldResource): Array<EnumerationFieldValue> {
        return Object.entries(enumField.options).map(entry => ({
                key: entry[0],
                value: this.formatCollectionValueFromBackend(entry[1], enumField.collectionType)
            }));
    }

    protected resolveMultichoiceField(multichoiceField: DataFieldResource): MultichoiceField {
        const options = multichoiceField.type === FieldTypeResource.MULTICHOICE
            ? this.resolveMultichoiceChoices(multichoiceField)
            : this.resolveMultichoiceOptions(multichoiceField);
        let multiValue;
        if (multichoiceField.value) {
            multiValue = multichoiceField.value.map((val) => this.formatCollectionValueFromBackend(val, multichoiceField.collectionType));
        }
        return new MultichoiceField(multichoiceField.stringId, multichoiceField.name, multiValue, options,
            multichoiceField.collectionType,
            multichoiceField.behavior, multichoiceField.placeholder, multichoiceField.description,
            multichoiceField.layout, multichoiceField.type, multichoiceField.validations,
            multichoiceField.component, multichoiceField.parentTaskId);
    }

    /**
     * This function is used to parse multichoice options from the `choices` attribute
     * @param multiField multichoice field resource object who's options we want to resolve
     * @returns the options for the multichoice field
     */
    protected resolveMultichoiceChoices(multiField: DataFieldResource): Array<MultichoiceFieldValue> {
        const choicesMulti: Array<MultichoiceFieldValue> = [];
        if (multiField.choices instanceof Array) {
            multiField.choices.forEach(it => {
                choicesMulti.push({
                    key: it.toString(),
                    value: this.formatCollectionValueFromBackend(it, multiField.collectionType)
                } as MultichoiceFieldValue);
            });
        } else {
            Object.keys(multiField.choices).forEach(key => {
                choicesMulti.push({key, value: multiField.choices[key]} as MultichoiceFieldValue);
            });
        }
        return choicesMulti;
    }

    /**
     * This function is used to parse enumeration options from the `options` attribute
     * @param multiField multichoice field resource object who's options we want to resolve
     * @returns the options for the multichoice field
     */
    protected resolveMultichoiceOptions(multiField: DataFieldResource): Array<MultichoiceFieldValue> {
        return Object.entries(multiField.options).map(entry => ({
            key: entry[0],
            value: this.formatCollectionValueFromBackend(entry[1], multiField.collectionType)
        }));
    }

    protected resolveListField(listField: DataFieldResource): CollectionField {
        switch (listField.collectionType) {
            case FieldTypeResource.USER:
                let userListValue: UserValue[] = [];
                if (listField.value) {
                    listField.value.forEach(u => userListValue
                        .push(this.formatCollectionValueFromBackend(u, listField.collectionType)));
                }
                return new UserListField(listField.stringId, listField.name, listField.behavior, userListValue,
                    listField.collectionType,
                    listField.placeholder, listField.description, listField.layout, listField.validations,
                    listField.component, listField.parentTaskId);
            case FieldTypeResource.FILE:
                let fileListValue = listField.value.map((val) => this.formatCollectionValueFromBackend(val, listField.collectionType));
                return new FileListField(listField.stringId, listField.name, listField.behavior,
                    listField.collectionType, fileListValue, listField.placeholder,
                    listField.description, listField.layout, listField.validations, null, null, listField.component,
                    listField.parentTaskId);
            default:
                let listValue = listField.value.map((val) => this.formatCollectionValueFromBackend(val, listField.collectionType));
                return new ListField(listField.stringId, listField.name, listValue, listField.behavior,
                    listField.placeholder, listField.description, listField.layout, listField.validations, listField.component, listField.parentTaskId,
                    listField.collectionType)
        }
    }

    public formatCollectionValueForBackEnd(value: any, collectionValue: string): any {
        switch (collectionValue as FieldTypeResource) {
            case FieldTypeResource.TEXT:
                return value as string;
            case FieldTypeResource.NUMBER:
                return value as number;
            case FieldTypeResource.DATE:
                if (moment.isMoment(value)) {
                    return value.format('YYYY-MM-DD');
                }
                break;
            case FieldTypeResource.DATE_TIME:
                if (moment.isMoment(value)) {
                    return value.format('DD.MM.YYYY HH:mm:ss');
                }
                break;
            case FieldTypeResource.USER:
                return value.id;
            case FieldTypeResource.FILE:
                return value;
            case FieldTypeResource.I18N:
                return value as string;
                break;
            default:
                console.log('Unknown field type');
                break;
        }
    }

    public formatCollectionValueFromBackend(value: any, type: string): any {
        if (value == null) {
            return null;
        }
        switch (type as FieldTypeResource) {
            case FieldTypeResource.TEXT:
                return value as string;
            case FieldTypeResource.NUMBER:
                return value as number;
            case FieldTypeResource.USER:
                if (value) {
                    return new UserValue(value.id, value.name, value.surname, value.email);
                }
                return null;
            case FieldTypeResource.FILE:
                return value ? value : {};
            case FieldTypeResource.DATE_TIME:
            case FieldTypeResource.DATE:
                return moment(value);
            case FieldTypeResource.I18N:
                return value;
        }
    }

    //TODO fix probably
    public formatValueFromBackend(field: DataField<any>, value: any): any {
        if (value === null) {
            return null;
        }
        if (value === undefined) {
            return;
        }
        if (this.resolveType(field) === FieldTypeResource.TEXT && value === null) {
            return null;
        }
        if (this.resolveType(field) === FieldTypeResource.TEXT && field.component && field.component.name === 'password') {
            return atob(value);
        }
        if (this.resolveType(field) === FieldTypeResource.DATE) {
            return moment(new Date(value[0], value[1] - 1, value[2]));
        }
        if (this.resolveType(field) === FieldTypeResource.USER) {
            return new UserValue(value.id, value.name, value.surname, value.email);
        }
        if (this.resolveType(field) === FieldTypeResource.DATE_TIME) {
            return moment(new Date(value[0], value[1] - 1, value[2], value[3], value[4]));
        }
        if (this.resolveType(field) === FieldTypeResource.MULTICHOICE) {
            const array = [];
            value.forEach(v => {
                if (v.defaultValue) {
                    array.push(v.defaultValue);
                } else {
                    array.push(v);
                }
            });
            return array;
        }
        return value;
    }

    protected resolveTextValue(field: DataFieldResource, value: string): string {
        if (field.component !== undefined && field.component.name === 'password' && value !== '' && value !== undefined) {
            return atob(value);
        }
        return value;
    }
}
