import {Inject, Injectable, Optional} from '@angular/core';
import {Subject} from 'rxjs';
import {take} from 'rxjs/operators';
import {LoggerService} from '../../logger/services/logger.service';
import {TaskContentService} from '../../task-content/services/task-content.service';
import {TaskResourceService} from '../../resources/engine-endpoint/task-resource.service';
import {SnackBarService} from '../../snack-bar/services/snack-bar.service';
import {TranslateService} from '@ngx-translate/core';
import {TaskRequestStateService} from './task-request-state.service';
import {TaskDataService} from './task-data.service';
import {TaskHandlingService} from './task-handling-service';
import {NAE_TASK_OPERATIONS} from '../models/task-operations-injection-token';
import {TaskOperations} from '../interfaces/task-operations';
import {CallChainService} from '../../utility/call-chain/call-chain.service';
import {SelectedCaseService} from './selected-case.service';
import {createTaskEventNotification} from '../../task-content/model/task-event-notification';
import {TaskEvent} from '../../task-content/model/task-event';
import {TaskEventService} from '../../task-content/services/task-event.service';
import {FinishTaskEventOutcome} from '../../resources/event-outcomes/task-outcomes/finish-task-event-outcome';
import {EventOutcomeMessageResource} from '../../resources/interface/message-resource';


/**
 * Service that handles the logic of finishing a task.
 */
@Injectable()
export class FinishTaskService extends TaskHandlingService {

    constructor(protected _log: LoggerService,
                protected _taskResourceService: TaskResourceService,
                protected _snackBar: SnackBarService,
                protected _translate: TranslateService,
                protected _taskState: TaskRequestStateService,
                protected _taskDataService: TaskDataService,
                protected _callChain: CallChainService,
                protected _taskEvent: TaskEventService,
                @Inject(NAE_TASK_OPERATIONS) protected _taskOperations: TaskOperations,
                @Optional() _selectedCaseService: SelectedCaseService,
                _taskContentService: TaskContentService) {
        super(_taskContentService, _selectedCaseService);
    }

    /**
     * Updates the task data to their current state from backend, checks the validity of the data and
     * sends a finish request to backend.
     *
     * Finish request is not sent if the task contains invalid data.
     *
     * If an update to the data is already in progress waits for it's successful completion and sends the finish request after.
     *
     * @param afterAction if finish request completes successfully `true` will be emitted into this Subject,
     * otherwise `false` will be emitted
     */
    public validateDataAndFinish(afterAction = new Subject<boolean>()): void {
        if (this._safeTask.dataSize <= 0) {
            this._taskDataService.initializeTaskDataFields(this._callChain.create(() => {
                if (this._safeTask.dataSize <= 0 ||
                    (this._taskContentService.validateDynamicEnumField() && this._taskContentService.validateTaskData())) {
                    this.sendFinishTaskRequest(afterAction);
                }
            }));
        } else if (this._taskContentService.validateDynamicEnumField() && this._taskContentService.validateTaskData()) {
            const finishedTaskId = this._safeTask.stringId;
            this._taskDataService.updateTaskDataFields(this._callChain.create(success => {
                if (success) {
                    if (this._taskState.isUpdating(finishedTaskId)) {
                        this._taskDataService.updateSuccess$.pipe(take(1)).subscribe(bool => {
                            if (bool) {
                                this.sendFinishTaskRequest(afterAction);
                            }
                        });
                    } else {
                        this.sendFinishTaskRequest(afterAction);
                    }
                }
            }));
        }
    }

    /**
     * Sends the finish request to backend and notifies the user about the outcome of the operation via a snack bar message.
     *
     * Doesn't send any requests if the loading indicator is in it's active state.
     * Otherwise sets the indicator to the active state and disables it once the request response is received.
     *
     * The argument can be used to chain operations together,
     * or to execute code conditionally based on the success state of the finish request.
     *
     * If the task held within the {@link TaskContentService} changes before a response is received, the response will be ignored
     * and the `afterAction` will not be executed.
     * @param afterAction if finish request completes successfully `true` will be emitted into this Subject,
     * otherwise `false` will be emitted
     */
    protected sendFinishTaskRequest(afterAction: Subject<boolean>): void {
        const finishedTaskId = this._safeTask.stringId;

        if (this._taskState.isLoading(finishedTaskId)) {
            return;
        }
        this._taskState.startLoading(finishedTaskId);

        this._taskResourceService.finishTask(this._safeTask.stringId).pipe(take(1))
            .subscribe((outcomeResource: EventOutcomeMessageResource) => {
            this._taskState.stopLoading(finishedTaskId);
            if (!this.isTaskRelevant(finishedTaskId)) {
                this._log.debug('current task changed before the finish response could be received, discarding...');
                return;
            }

            if (outcomeResource.success) {
                this._taskContentService.updateStateData(outcomeResource.outcome as FinishTaskEventOutcome);
                this._taskDataService.emitChangedFields((outcomeResource.outcome as FinishTaskEventOutcome).data.changedFields);
                this._taskOperations.reload();
                this.sendNotification(true);
                afterAction.next(true);
                afterAction.complete();
                this._taskOperations.close();
                this._snackBar.openSuccessSnackBar(outcomeResource.outcome.message === undefined
                    ? this._translate.instant('tasks.snackbar.finishTaskSuccess')
                    : outcomeResource.outcome.message);
            } else if (outcomeResource.error !== undefined) {
                if (outcomeResource.error !== '') {
                    this._snackBar.openErrorSnackBar(outcomeResource.error);
                }
                this._taskDataService.emitChangedFields(outcomeResource.changedFields.changedFields);
                this.sendNotification(false);
                afterAction.next(false);
                afterAction.complete();
            }
        }, error => {
            this._taskState.stopLoading(finishedTaskId);
            this._log.debug('finishing task failed', error);

            if (!this.isTaskRelevant(finishedTaskId)) {
                this._log.debug('current task changed before the finish error could be received');
                return;
            }

            this._snackBar.openErrorSnackBar(`${this._translate.instant('tasks.snackbar.finishTask')}
             ${this._task} ${this._translate.instant('tasks.snackbar.failed')}`);
            this.sendNotification(false);
            afterAction.next(false);
            afterAction.complete();
        });
    }

    /**
     * Publishes a finish notification to the {@link TaskEventService}
     * @param success whether the finish operation was successful or not
     */
    protected sendNotification(success: boolean): void {
        this._taskEvent.publishTaskEvent(createTaskEventNotification(this._safeTask, TaskEvent.FINISH, success));
    }
}
