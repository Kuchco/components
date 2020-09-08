import {DataFieldType} from './data-field-type';

export type TaskContentElementType = DataFieldType | TaskElementType;

/**
 * Contains types of elements that are used to construct task content, but are not data fields themselves.
 */
export enum TaskElementType {
    /**
     * Marks an empty tile in the task content grid
     */
    BLANK = 'blank',
    /**
     * Marks the space occupied by a data group title
     */
    DATA_GROUP_TITLE = 'title'
}
