/**
 * Used by [UserListField]{@link UserListField}.
 *
 * Represents the value of the user list.
 */

export class CollectionFieldValue {

    private _collectionValues: Array<any>;

    constructor(collectionValues: Array<any>) {
        this._collectionValues = collectionValues;
    }

    get collectionValues(): Array<any> {
        return this._collectionValues;
    }

    set collectionValues(value: Array<any>) {
        this._collectionValues = value;
    }

    public addCollectionValue(value: any): void {
        this._collectionValues.push(value);
    }

    public addanys(value: any[]): void {
        this._collectionValues.push(...value);
    }

    public getLast(): any {
        if (this._collectionValues.length == 0) {
            return {};
        }
        return this._collectionValues[this._collectionValues.length - 1];
    }

    public removeCollectionValue(value: any): void {
        const index = this._collectionValues.findIndex(user => user.id === value.id);
        if (index > -1) {
            this._collectionValues.splice(index, 1);
        }
    }


}
