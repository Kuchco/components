import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {DateFieldComponent} from './date-field.component';
import {AngularResizedEventModule} from 'angular-resize-event';
import {DataFieldTemplateComponent} from '../data-field-template/data-field-template.component';
import {RequiredLabelComponent} from '../required-label/required-label.component';
import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import moment from 'moment';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {
    MaterialModule,
    TranslateLibModule,
    AuthenticationMethodService,
    AuthenticationService,
    UserResourceService,
    ConfigurationService,
    MockAuthenticationService,
    MockUserResourceService,
    TestConfigurationService,
    DateField,
    MockAuthenticationMethodService
} from '@netgrif/application-engine';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('DateFieldComponent', () => {
    let component: DateFieldComponent;
    let fixture: ComponentFixture<TestWrapperComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MaterialModule,
                AngularResizedEventModule,
                TranslateLibModule,
                HttpClientTestingModule, NoopAnimationsModule
            ],
            providers: [
                {provide: AuthenticationMethodService, useClass: MockAuthenticationMethodService},
                {provide: AuthenticationService, useClass: MockAuthenticationService},
                {provide: UserResourceService, useClass: MockUserResourceService},
                {provide: ConfigurationService, useClass: TestConfigurationService},
            ],
            declarations: [
                DateFieldComponent,
                DataFieldTemplateComponent,
                RequiredLabelComponent,
                TestWrapperComponent
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(TestWrapperComponent);
        component = fixture.debugElement.children[0].componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });
});

@Component({
    selector: 'nc-test-wrapper',
    template: '<nc-date-field [dataField]="field"></nc-date-field>'
})
class TestWrapperComponent {
    field = new DateField('', '', moment(new Date()), {
        required: true,
        optional: true,
        visible: true,
        editable: true,
        hidden: true
    }, undefined, undefined, undefined, [
        {validationRule: 'weekend', validationMessage: 'This is custom message!'},
        {validationRule: 'workday', validationMessage: 'This is custom message!'}
        ]);
}

