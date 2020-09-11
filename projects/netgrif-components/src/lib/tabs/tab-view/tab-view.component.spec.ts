import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TabViewComponent} from './tab-view.component';
import {TabCreationDetectorComponent} from '../tab-creation-detector/tab-creation-detector.component';
import {Component, NgModule} from '@angular/core';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {
    MaterialModule,
    AuthenticationMethodService,
    AuthenticationService,
    UserResourceService,
    ConfigurationService,
    MockAuthenticationService,
    MockUserResourceService,
    TestConfigurationService,
    ViewService,
    TestViewService,
    TabView,
    TabContent,
    MockAuthenticationMethodService
} from '@netgrif/application-engine';
import {RouterModule} from '@angular/router';

describe('TabViewComponent', () => {
    let component: TabViewComponent;
    let fixture: ComponentFixture<TestWrapperComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MaterialModule,
                TabTestModule,
                NoopAnimationsModule,
                RouterModule.forRoot([])
            ],
            providers: [
                {provide: AuthenticationMethodService, useClass: MockAuthenticationMethodService},
                {provide: AuthenticationService, useClass: MockAuthenticationService},
                {provide: UserResourceService, useClass: MockUserResourceService},
                {provide: ConfigurationService, useClass: TestConfigurationService},
                {provide: ViewService, useClass: TestViewService}
            ],
            declarations: [
                TabViewComponent,
                TabCreationDetectorComponent,
                TestWrapperComponent,
            ]
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
    template: '<nc-tab-view [initialTabs]="tabs"></nc-tab-view>'
})
class TestWrapperComponent {
    tabs: Array<TabContent> = [
        {
            label: {
                text: 'tab title',
                icon: 'home'
            },
            canBeClosed: false,
            tabContentComponent: TestComponent
        }
    ];
}

@Component({
    selector: 'nc-test-div',
    template: '<div></div>'
})
class TestComponent {
}

@NgModule({
    declarations: [TestComponent],
    entryComponents: [TestComponent]
})
class TabTestModule {
}
