import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MultichoiceField} from '../models/multichoice-field';
import {FormControl} from '@angular/forms';
import {WrappedBoolean} from '../../data-field-template/models/wrapped-boolean';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable, of, Subscription} from 'rxjs';
import {MultichoiceAutocompleteFilterProperty} from './multichoice-autocomplete-filter-property';
import {ChoiceFieldValue} from "../../models/choice-field-value";

@Component({
    selector: 'ncc-abstract-multichoice-autocomplete-field',
    template: ''
})
export abstract class AbstractMultichoiceAutocompleteFieldComponentComponent implements OnInit, OnDestroy {

    @Input() multichoiceField: MultichoiceField;
    @Input() formControlRef: FormControl;
    @Input() showLargeLayout: WrappedBoolean;
    @ViewChild('input') input: ElementRef;

    separatorKeysCodes: number[] = [ENTER, COMMA];

    subscriptionChangeData$: Subscription;

    filteredOptions: Observable<Array<ChoiceFieldValue>>;

    ngOnInit() {
        this.subscriptionChangeData$ =this.formControlRef.valueChanges.subscribe(newVal => {
            this.filteredOptions = of(this._filter(newVal ?? '').filter((option) => !this.multichoiceField.value?.includes(option.key)));
        })
    }

    ngOnDestroy(): void {
        this.filteredOptions = undefined;
        this.subscriptionChangeData$.unsubscribe();
    }

    add(event: MatChipInputEvent): void {
        const value = event['key'] ?? '';

        if (value) {
            this.multichoiceField.value = this.multichoiceField.value === null ? [] : this.multichoiceField.value
            const choiceArray = [...this.multichoiceField.value];
            choiceArray.push(value);
            this.multichoiceField.value = choiceArray;
            this.input.nativeElement.value = '';
            this.change();
        } else {
            this.input.nativeElement.value = '';
            this.change();
        }
    }

    remove(value: string): void {
        const index = this.multichoiceField.value.indexOf(value);

        if (index >= 0) {
            const choiceArray = [...this.multichoiceField.value];
            choiceArray.splice(index, 1);
            this.multichoiceField.value = choiceArray;
            this.change();
        }
    }

    change() {
        if (this.input.nativeElement.value !== undefined) {
            this.filteredOptions = of(this._filter(this.input.nativeElement.value).filter((option) => !this.multichoiceField.value.includes(option.key)));
        }
    }

    protected checkPropertyInComponent(property: string): boolean {
        return !!this.multichoiceField.component && !!this.multichoiceField.component.properties && property in this.multichoiceField.component.properties;
    }

    protected filterType(): string | undefined {
        if (this.checkPropertyInComponent('filter')) {
            return this.multichoiceField.component.properties.filter;
        }
    }

    protected _filter(value: any): Array<ChoiceFieldValue> {
        let filterType = this.filterType()?.toLowerCase()
        switch (filterType) {
            case MultichoiceAutocompleteFilterProperty.SUBSTRING:
                return this._filterInclude(value);
            case MultichoiceAutocompleteFilterProperty.PREFIX:
                return this._filterIndexOf(value);
            default:
                return this._filterIndexOf(value);
        }
    }

    protected _filterInclude(value: string): Array<ChoiceFieldValue> {
        if (typeof value === 'string') {
            if (Array.isArray(value)) {
                value = '';
            }
            const filterValue = value?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            return this.multichoiceField.choices
                .filter(option => typeof option === 'string')
                .filter(option => {
                    if (typeof  option.value === 'string') {
                        return option.value.toLowerCase().normalize('NFD')
                            .replace(/[\u0300-\u036f]/g, '').includes(filterValue);
                    }
                })
        } else {
            return this.multichoiceField.choices;
        }
    }

    protected _filterIndexOf(value: any): Array<ChoiceFieldValue> {
        if (typeof value === 'string') {
            if (Array.isArray(value)) {
                value = '';
            }
            const filterValue = value?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

            return this.multichoiceField.choices
                .filter(option => typeof option === 'string')
                .filter(option => {
                    if (typeof  option.value === 'string') {
                        return option.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').indexOf(filterValue) === 0;
                    }
                })
        } else {
            return this.multichoiceField.choices;
        }
    }

    public renderSelection = (key) => {
        if (key !== undefined && key !== '' && key !== null) {
            if (this.multichoiceField.choices.find(choice => choice.key === key)) {
                return this.multichoiceField.choices.find(choice => choice.key === key).value;
            }
        }
        return key;
    }

    public getValueFromKey(key: string): any | undefined {
        return this.multichoiceField.choices.find(choice => choice.key === key)?.value;
    }
}
