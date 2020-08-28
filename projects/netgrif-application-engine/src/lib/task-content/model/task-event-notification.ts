import {TaskEvent} from './task-event';
import {Task} from '../../resources/public-api';

/**
 * Holds the information about an event that occurred to some {@link Task} resource.
 *
 * Task events correspond more or less 1-to-1 to backend calls and their results.
 */
export interface TaskEventNotification {
    /**
     * StringId of the affected {@link Task}
     */
    taskId: string;
    /**
     * The event that occurred
     */
    event: TaskEvent;
    /**
     * Success state of the event
     */
    success: boolean;
}

/**
 * @param task affected Task object
 * @param event the reported Task event
 * @param success success state of the reported event
 * @returns the notification informing about the event
 */
export function createTaskEventNotification(task: Task, event: TaskEvent, success: boolean): TaskEventNotification {
    return {
        taskId: task.stringId,
        event,
        success
    };
}
