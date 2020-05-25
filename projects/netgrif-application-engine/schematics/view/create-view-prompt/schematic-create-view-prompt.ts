import {
    chain,
    Rule, schematic,
    SchematicsException,
    Tree
} from '@angular-devkit/schematics';
import {addViewToNaeJson} from '../_utility/add-view-to-nae-json';
import {getParentPath, parentViewDefined} from '../_utility/view-utility-functions';
import {createLoginView} from './views/login/create-login-view';
import {createTabView} from './views/tab-view/create-tab-view';
import {createTaskView} from './views/task-view/create-task-view';
import {createCaseView} from './views/case-view/create-case-view';
import {createSidenavOrToolbarView} from './views/sidenav-toolbar-view/create-sidenav-or-toolbar-view';
import {createEmptyView} from './views/empty-view/create-empty-view';
import {createDashboardView} from './views/dashboard-view/create-dashboard-view';
import {checkJsonParamsForSidenav} from '../create-sidenav-prompt/schematic-create-sidenav-prompt';
import {CreateViewArguments} from './models/create-view-arguments';


export function schematicEntryPoint(schematicArguments: CreateViewArguments): Rule {
    return (tree: Tree) => {
        checkPathValidity(tree, schematicArguments.path);
        return createView(tree, schematicArguments);
    };
}

function checkPathValidity(tree: Tree, path: string | undefined) {
    if (path === undefined) {
        throw new SchematicsException(`View path cannot be undefined!`);
    }
    if (!parentViewDefined(tree, path)) {
        throw new SchematicsException(`Parent view doesn't exist! Create a view with '${getParentPath(path)}' path first.`);
    }
}

function createView(tree: Tree, args: CreateViewArguments, addViewToService: boolean = true): Rule {
    const rules = [];
    switch (args.viewType) {
        case 'login':
            rules.push(createLoginView(tree, args, addViewToService));
            break;
        case 'tabView':
            rules.push(createTabView(tree, args, addViewToService, createViewRef));
            break;
        case 'taskView':
            rules.push(createTaskView(tree, args, addViewToService));
            break;
        case 'caseView':
            rules.push(createCaseView(tree, args, addViewToService));
            break;
        case 'emptyView':
            rules.push(createEmptyView(tree, args, addViewToService));
            break;
        case 'dashboard':
            rules.push(createDashboardView(tree, args, addViewToService));
            break;
        case 'toolbarView':
            rules.push(createSidenavOrToolbarView(tree, {
                createViewArguments: args,
                addViewToService
            }));
            break;
        case 'sidenavView':
        case 'sidenavAndToolbarView':
            rules.push(schematic('create-sidenav-prompt', checkJsonParamsForSidenav(args, addViewToService)
            ));
            // we want to add the route AFTER we get the data from the schematic
            addViewToService = false;
            break;
        default:
            throw new SchematicsException(`Unknown view type '${args.viewType}'`);
    }
    if (addViewToService) {
        rules.push(addViewToNaeJson(args));
    }
    return chain(rules);
}

const createViewRef: (tree: Tree, args: CreateViewArguments, addRoute?: boolean) => Rule = createView;
