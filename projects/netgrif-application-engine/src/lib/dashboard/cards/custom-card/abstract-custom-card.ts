import {Injector, Input, OnInit} from '@angular/core';
import {Filter} from '../../../filter/models/filter';
import {CustomCard} from '../model/custom-dashboard-model/custom-card';
import {DashboardCardTypes} from '../model/dashboard-card-types';
import {DashboardResourceService} from '../../../resources/engine-endpoint/dashboard-resource.service';
import {TranslateService} from '@ngx-translate/core';
import {LoadingEmitter} from '../../../utility/loading-emitter';
import {DashboardSingleData} from '../model/custom-dashboard-model/dashboard-single-data';
import {DashboardMultiData} from '../model/custom-dashboard-model/dashboard-multi-data';
import {LoggerService} from '../../../logger/services/logger.service';

export abstract class AbstractCustomCard implements OnInit {

    @Input() public card: CustomCard;
    protected _filter: Filter;
    public loading: LoadingEmitter;

    public count: number;

    /* Data holder for graphs with 1D data array, eg.: Pie Chart*/
    public single: Array<DashboardSingleData>;

    /* Data holder for graphs with multiple 2D data array, eg.: BarChart, LineChart*/
    public multi: Array<DashboardMultiData>;

    public showLegend = true;
    public showLabels = true;
    public animations = true;
    public xAxis = true;
    public yAxis = true;
    public showYAxisLabel = true;
    public showXAxisLabel = true;
    public gradient = true;
    public colorScheme = {
        domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
    };

    protected constructor(protected _injector: Injector,
                          protected resourceService: DashboardResourceService,
                          protected translateService: TranslateService,
                          protected loggerService: LoggerService) {
        this.loading = new LoadingEmitter();
        this.single = new Array<DashboardSingleData>();
        this.multi = new Array<DashboardMultiData>();
    }

    ngOnInit(): void {
        this.card.units = this.translateService.instant('dashboard.' + this.card.units);
        this.resourceService.getDashboardData(this.getResourceTypeAsString(), this.card.query).subscribe(json  => {
            this.convertData(json);
        }, error => {
            this.loggerService.error('Error occurred when calling dashboard resource service');
        });
    }

    public setCardType(type: string): void {
        switch (type) {
            case 'pie': {
                this.card.type = DashboardCardTypes.PIE;
                break;
            }
            case 'bar': {
                this.card.type = DashboardCardTypes.BAR;
                break;
            }
            case 'line': {
                this.card.type = DashboardCardTypes.LINE;
                break;
            }
            case 'lineargauge': {
                this.card.type = DashboardCardTypes.LINEARGAUGE;
                break;
            }
            default: {
                this.card.type = DashboardCardTypes.DEFAULT;
                break;
            }
        }
    }

    public getResourceTypeAsString(): string {
        return this.card.resourceType.toLowerCase();
    }

    public abstract convertData(json): void;

}
