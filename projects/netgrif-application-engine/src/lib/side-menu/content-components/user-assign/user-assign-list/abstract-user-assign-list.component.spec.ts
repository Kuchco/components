import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CovalentCommonModule} from '@covalent/core/common';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Component, NO_ERRORS_SCHEMA} from '@angular/core';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {FormControl} from '@angular/forms';
import {AbstractUserAssignListComponent} from './abstract-user-assign-list.component';
import {UserListService} from '../../../../user/services/user-list.service';
import {ErrorSnackBarComponent} from '../../../../snack-bar/components/error-snack-bar/error-snack-bar.component';
import {UserValue} from '../../../../data-fields/user-field/models/user-value';
import {UserListInjectedData} from '../model/user-list-injected-data';
import {ConfigurationService} from '../../../../configuration/configuration.service';
import {TestConfigurationService} from '../../../../utility/tests/test-config';
import {TranslateLibModule} from '../../../../translate/translate-lib.module';
import {MaterialModule} from '../../../../material/material.module';
import {SnackBarModule} from '../../../../snack-bar/snack-bar.module';

describe('AbstractUserAssignListComponent', () => {
    let component: TestUserComponent;
    let fixture: ComponentFixture<TestWrapperComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MaterialModule,
                BrowserAnimationsModule,
                CovalentCommonModule,
                HttpClientTestingModule,
                TranslateLibModule,
                SnackBarModule
            ],
            providers: [
                UserListService,
                {provide: ConfigurationService, useClass: TestConfigurationService}
            ],
            declarations: [
                TestUserComponent,
                TestWrapperComponent
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).overrideModule(BrowserDynamicTestingModule, {
                set: {
                    entryComponents: [
                        ErrorSnackBarComponent
                    ]
                }
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
    selector: 'nae-test-user',
    template: ''
})
class TestUserComponent extends AbstractUserAssignListComponent {
    constructor(protected _userListService: UserListService) {
        super(_userListService);
    }
}

@Component({
    selector: 'nae-test-wrapper',
    template: '<nae-test-user [searchUserControl]="formControl"></nae-test-user>'
})
class TestWrapperComponent {
    injectedData = {roles: [], value: new UserValue('5', 'admin', 'netgrif', 'super@netgrif.com')} as UserListInjectedData;
    formControl = new FormControl();
}
