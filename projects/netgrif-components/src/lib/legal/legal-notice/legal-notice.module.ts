import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LegalNoticeComponent} from './legal-notice.component';
import {TranslateLibModule} from 'netgrif-application-engine';


@NgModule({
    declarations: [LegalNoticeComponent],
    imports: [
        CommonModule,
        TranslateLibModule
    ],
    exports: [LegalNoticeComponent]
})
export class LegalNoticeModule {
}
