import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {InternalLinkComponent} from './internal-link.component';
import {MaterialModule} from '@netgrif/application-engine';
import {CommonModule} from '@angular/common';
import {RouterTestingModule} from '@angular/router/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('InternalLinkComponent', () => {
    let component: InternalLinkComponent;
    let fixture: ComponentFixture<InternalLinkComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InternalLinkComponent],
            imports: [
                CommonModule,
                RouterTestingModule.withRoutes([]),
                MaterialModule, NoopAnimationsModule
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InternalLinkComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });
});
