import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SideMenuContainerComponent} from './side-menu-container.component';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../../material/material.module';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {SideMenuService} from '../services/side-menu.service';
import {ImportNetComponent} from '../content-components/import-net/import-net.component';
import {TranslateLibModule} from '../../translate/translate-lib.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('SideMenuContainerComponent', () => {
    let component: SideMenuContainerComponent;
    let fixture: ComponentFixture<SideMenuContainerComponent>;
    let service: SideMenuService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                MaterialModule,
                NoopAnimationsModule,
                TranslateLibModule,
                HttpClientTestingModule
            ],
            declarations: [SideMenuContainerComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SideMenuContainerComponent);
        service = TestBed.inject(SideMenuService);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should open and close', () => {
        service.open(ImportNetComponent).onClose.subscribe(event => {
            expect(event).toBeTruthy();
        });
        service.close({opened: false});
    });

    afterAll(() => {
        TestBed.resetTestingModule();
    });
});
