import {Behavior} from '../../data-fields/models/behavior';
import {Layout} from '../../data-fields/models/layout';
import {Validation} from '../../data-fields/models/validation';
import {FieldTypeResource} from './field-type-resource';
import {FormatFilter} from '../../data-fields/models/format-filter';
import {Component} from '../../data-fields/models/component';
import {FilterMetadata} from '../../search/models/persistance/filter-metadata';

export interface DataFieldResource {
    stringId: string;
    type: FieldTypeResource;
    collectionType: FieldTypeResource;
    name: string;
    description?: string;
    placeholder?: string;
    behavior: Behavior;
    layout?: Layout;
    order: number;
    value?: string | number | Array<string> | boolean | Array<number> | any;
    defaultValue?: string | number | Array<string> | boolean;
    choices?: Array<string>;
    minValue?: number;
    minDate?: string;
    validations?: Array<Validation>;
    component?: Component;
    subType?: string;
    /*@deprecated*/
    formatting?: string;
    formatFilter?: FormatFilter;
    roles?: Array<any>;
    options?: {
        [k: string]: any
    };
    allowedNets?: Array<string>;
    filterMetadata?: FilterMetadata;
    parentTaskId?: string;
}
