import {DataGroup} from './data-groups';
import {AssignPolicy, DataFocusPolicy, FinishPolicy} from '../../task-content/model/policy';
import {TaskLayout} from './task-layout';
import {NaeDate} from '../types/nae-date-type';
import {UserResourceSmall} from './user-resource-small';
import {ImmediateData} from './immediate-data';

/**
 * Object from Backend
 */
export interface Task {
    /**
     * Mongo ID Case
     *
     * ***Example:*** 5e904fd80a975a7f87b2c2fd
     */
    caseId: string;
    /**
     * Case ID- mongo ID
     *
     * ***Example:*** 5e904fd80a975a7f87b2c2fd
     */
    transitionId: string;
    title: string;
    caseColor: string;
    caseTitle: string;
    /**
     * See [UserSmall]{@link UserResourceSmall#}
     */
    user: UserResourceSmall;
    /**
     * ***Example:***
     *
     *    "5e43f6a30a975a7f87551385": {
     *      "perform": true
     *    }
     */
    roles: object;
    users: {
        [k: number]: {
            [k: string]: boolean
        }
    };
    startDate: NaeDate;
    finishDate: NaeDate;
    /**
     * See [AssignPolicy]{@link AssignPolicy#}
     */
    assignPolicy: AssignPolicy;
    /**
     * See [DataFocusPolicy]{@link DataFocusPolicy#}
     */
    dataFocusPolicy: DataFocusPolicy;
    /**
     * See [FinishPolicy]{@link FinishPolicy#}
     */
    finishPolicy: FinishPolicy;
    stringId: string;
    layout: TaskLayout;
    /**
     * Array [DataGroup]{@link DataGroup#}
     */
    dataGroups: DataGroup[];
    _links: object;
    dataSize?: number;
    icon?: string;
    priority?: number;
    assignTitle?: string;
    finishTitle?: string;
    cancelTitle?: string;
    delegateTitle?: string;
    immediateData?: Array<ImmediateData>;
}
