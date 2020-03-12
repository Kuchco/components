import {LogPublisher} from './log-publisher';
import {LogEntry} from '../log-entry';
import {LogPublisherService} from '../log-publisher.service';
import {LogLevel} from "../logLevel";


export class ConsoleLogPublisher extends LogPublisher {

    constructor(publisherService: LogPublisherService) {
        super(publisherService);
    }

    clear(): void {
        console.clear();
    }

    log(entry: LogEntry): void {
        if (!entry) {
            return;
        }
        switch (entry.level) {
            case LogLevel.DEBUG:
                console.debug(entry.toString());
                break;
            case LogLevel.ERROR:
                console.error(entry.toString());
                break;
            case LogLevel.INFO:
                console.info(entry.toString());
                break;
            case LogLevel.WARN:
                console.warn(entry.toString());
                break;
            default:
                console.log(entry.toString());
        }
    }

}
