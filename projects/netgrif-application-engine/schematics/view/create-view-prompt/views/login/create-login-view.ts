import {chain, Rule, Tree} from '@angular-devkit/schematics';
import {createFilesFromTemplates, createRelativePath, getProjectInfo} from '../../../../_utility/utility-functions';
import {strings} from '@angular-devkit/core';
import {updateAppModule} from '../../../_utility/view-utility-functions';
import {addViewToViewService} from '../../../_utility/view-service-functions';
import {ViewClassInfo} from '../../../../../src/commons/view-class-info';
import {ImportToAdd} from '../../../../../src/commons/import-to-add';
import {CreateViewArguments} from '../../models/create-view-arguments';


export function createLoginView(tree: Tree, args: CreateViewArguments, addViewToService: boolean): Rule {
    const projectInfo = getProjectInfo(tree);
    const rules = [];
    const view = new ViewClassInfo(
        args.path,
        args.viewType,
        args.componentName
    );

    rules.push(createFilesFromTemplates('./views/login/files', `${projectInfo.path}/views/${args.path}`, {
        prefix: projectInfo.projectPrefixDasherized,
        className: view.nameWithoutComponent,
        dasherize: strings.dasherize,
        classify: strings.classify,
        configName: projectInfo.projectNameClassified,
        configImportPath: createRelativePath(view.fileImportPath, `./${projectInfo.projectNameDasherized}-configuration.service`)
    }));

    updateAppModule(tree, view.className, view.fileImportPath, [
        new ImportToAdd('FlexModule', '@angular/flex-layout'),
        new ImportToAdd('LoginFormModule', '@netgrif/application-engine')]);

    if (addViewToService) {
        addViewToViewService(tree, view);
    }
    return chain(rules);
}
