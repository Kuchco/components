import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NumberFieldComponent} from './number-field.component';
import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {NumberField} from './models/number-field';
import {MaterialModule} from '../../material/material.module';
import {AngularResizedEventModule} from 'angular-resize-event';
import {DataFieldTemplateComponent} from '../data-field-template/data-field-template.component';
import {RequiredLabelComponent} from '../required-label/required-label.component';
import {TranslateLibModule} from '../../translate/translate-lib.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AuthenticationMethodService} from '../../authentication/services/authentication-method.service';
import {AuthenticationService} from '../../authentication/services/authentication/authentication.service';
import {MockAuthenticationService} from '../../utility/tests/mocks/mock-authentication.service';
import {UserResourceService} from '../../resources/engine-endpoint/user-resource.service';
import {MockUserResourceService} from '../../utility/tests/mocks/mock-user-resource.service';
import {ConfigurationService} from '../../configuration/configuration.service';
import {TestConfigurationService} from '../../utility/tests/test-config';
import {LanguageService} from '../../translate/language.service';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('NumberFieldComponent', () => {
    let component: NumberFieldComponent;
    let fixture: ComponentFixture<TestWrapperComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MaterialModule,
                AngularResizedEventModule,
                TranslateLibModule,
                HttpClientTestingModule,
                NoopAnimationsModule
            ],
            providers: [
                AuthenticationMethodService,
                {provide: AuthenticationService, useClass: MockAuthenticationService},
                {provide: UserResourceService, useClass: MockUserResourceService},
                {provide: ConfigurationService, useClass: TestConfigurationService}
            ],
            declarations: [
                NumberFieldComponent,
                DataFieldTemplateComponent,
                RequiredLabelComponent,
                TestWrapperComponent
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();
        fixture = TestBed.createComponent(TestWrapperComponent);
        component = fixture.debugElement.children[0].componentInstance;
        const initializeLang = TestBed.inject(LanguageService);
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should get error message', () => {
        expect(component.getErrorMessage()).toEqual('This is custom odd message!');

        component.dataField.value = 5;
        expect(component.getErrorMessage()).toEqual('Entered number must be even');
    });

    afterAll(() => {
        TestBed.resetTestingModule();
    });
});

@Component({
    selector: 'nae-test-wrapper',
    template: '<nae-number-field [dataField]="field"></nae-number-field>'
})
class TestWrapperComponent {
    field = new NumberField('', '', 4, {
        optional: true,
        visible: true,
        editable: true,
        hidden: true
    }, [
        {validationRule: 'odd', validationMessage: 'This is custom odd message!'},
        {validationRule: 'even', validationMessage: ''},
        {validationRule: 'positive', validationMessage: 'This is custom message!'},
        {validationRule: 'negative', validationMessage: 'This is custom message!'},
        {validationRule: 'decimal', validationMessage: 'This is custom message!'},
        {validationRule: 'inrange inf,0', validationMessage: 'This is custom message!'},
        {validationRule: 'inrange 0,inf', validationMessage: 'This is custom message!'},
        {validationRule: 'inrange -5,0', validationMessage: 'This is custom message!'},
    ]);
}
