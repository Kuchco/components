import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {DateTimeFieldComponent} from './date-time-field.component';
import {AngularResizedEventModule} from 'angular-resize-event';
import {DataFieldTemplateComponent} from '../data-field-template/data-field-template.component';
import {RequiredLabelComponent} from '../required-label/required-label.component';
import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import moment from 'moment';
import {NgxMatDatetimePickerModule} from '@angular-material-components/datetime-picker';
import {BehaviorSubject} from 'rxjs';
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
    DateTimeField,
    ChangedFields,
    MockAuthenticationMethodService
} from '@netgrif/application-engine';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('DatetimeFieldComponent', () => {
    let component: DateTimeFieldComponent;
    let fixture: ComponentFixture<TestWrapperComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MaterialModule,
                AngularResizedEventModule,
                NgxMatDatetimePickerModule,
                TranslateLibModule, HttpClientTestingModule, NoopAnimationsModule
            ],
            providers: [
                {provide: AuthenticationMethodService, useClass: MockAuthenticationMethodService},
                {provide: AuthenticationService, useClass: MockAuthenticationService},
                {provide: UserResourceService, useClass: MockUserResourceService},
                {provide: ConfigurationService, useClass: TestConfigurationService}
            ],
            declarations: [
                DateTimeFieldComponent,
                DataFieldTemplateComponent,
                RequiredLabelComponent,
                TestWrapperComponent,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();
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
    template: '<nc-date-time-field [dataField]="field" [changedFields]="changedFields"></nc-date-time-field>'
})
class TestWrapperComponent {
    field = new DateTimeField('', '', moment('2020-03-09'), {
        required: true,
        optional: true,
        visible: true,
        editable: true,
        hidden: true
    }, undefined, undefined, undefined, []);
    changedFields = new BehaviorSubject<ChangedFields>({behavior: {editable: true}});
}

