import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NewCaseComponent} from './new-case.component';
import {FlexLayoutModule, FlexModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {HotkeyModule} from 'angular2-hotkeys';
import {
    MaterialModule,
    CovalentModule,
    SnackBarModule,
    TranslateLibModule,
    NAE_NEW_CASE_COMPONENT
} from '@netgrif/application-engine';

@NgModule({
    declarations: [
        NewCaseComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        CovalentModule,
        FlexLayoutModule,
        FlexModule,
        FormsModule,
        SnackBarModule,
        TranslateLibModule,
        HotkeyModule.forRoot()
    ],
    exports: [NewCaseComponent],
    entryComponents: [NewCaseComponent],
    providers: [
        {provide: NAE_NEW_CASE_COMPONENT, useValue: NewCaseComponent}
    ]
})
export class SideMenuNewCaseComponentModule {
}
