import {Moment} from "moment";
import {UserValue} from "../user-field/models/user-value";
import {FileFieldValue} from "../file-field/models/file-field-value";
import {I18nFieldValue} from "../i18n-field/models/i18n-field-value";

export interface ChoiceFieldValue {
    key: string;
    value: Moment | number | UserValue | FileFieldValue | I18nFieldValue | string;
}
