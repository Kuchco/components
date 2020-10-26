import {Component, EventEmitter, Injector, OnInit, Output} from '@angular/core';
import {AbstractCustomCard, DashboardEventContent, DashboardResourceService} from '@netgrif/application-engine';
import {TranslateService} from '@ngx-translate/core';
import {AggregationResult, LoggerService} from '@netgrif/application-engine';

@Component({
    selector: 'nc-linear-gauge-card',
    templateUrl: './linear-gauge-card.component.html',
    styleUrls: ['./linear-gauge-card.component.scss'],
    providers: [
        DashboardResourceService
    ]
})
export class LinearGaugeCardComponent extends AbstractCustomCard implements OnInit {

    @Output() selectEvent: EventEmitter<DashboardEventContent>;

    constructor(protected _injector: Injector,
                protected resourceService: DashboardResourceService,
                protected translateService: TranslateService,
                protected loggerService: LoggerService) {
        super(_injector, resourceService, translateService, loggerService);
        this.selectEvent = new EventEmitter();
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    onSelect(data: DashboardEventContent) {
        this.loggerService.info('Linear gauge selected.');
        this.selectEvent.emit(data);
    }

    convertData(json: AggregationResult): void {
        this.value = json.aggregations.types_count.value;
    }
}
