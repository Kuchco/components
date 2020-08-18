import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {TaskResourceService} from '../../resources/engine-endpoint/task-resource.service';
import {LoggerService} from '../../logger/services/logger.service';
import {SnackBarService} from '../../snack-bar/services/snack-bar.service';
import {TranslateService} from '@ngx-translate/core';
import {AbstractDataFieldComponent} from '../models/abstract-data-field-component';
import {ProgressType, ProviderProgress} from '../../resources/resource-provider.service';
import {ChangedFieldContainer} from '../../resources/interface/changed-field-container';
import {FileListField, FileListFieldValidation} from './models/file-list-field';
import {FileFieldValue} from '../file-field/models/file-field-value';

export interface FilesState {
    progress: number;
    uploading: boolean;
    downloading: boolean;
    completed: boolean;
    error: boolean;
}

@Component({
  selector: 'nae-file-list-field',
  templateUrl: './file-list-field.component.html',
  styleUrls: ['./file-list-field.component.scss']
})
export class FileListFieldComponent extends AbstractDataFieldComponent implements OnInit, AfterViewInit {

    public uploadedFiles: Array<string>;
    public state: FilesState;

    /**
     * Values from file list field validation (eg. maxFiles 5)
     * maxFilesNumber - maximum uploadable files
     * maxFilesMessage - error message if number of files is exceeded
     */
    private maxFilesNumber: number;
    private maxFilesMessage: string;

    /**
     * Task mongo string id is binding property from parent component.
     */
    @Input() public taskId: string;
    /**
     * Binding property as instance from parent component.
     */
    @Input() public dataField: FileListField;
    /**
     * File picker element reference from component template that is initialized after view init.
     */
    @ViewChild('fileUploadInput') public fileUploadEl: ElementRef<HTMLInputElement>;

    constructor(private _taskResourceService: TaskResourceService,
                private _log: LoggerService,
                private _snackbar: SnackBarService,
                private _translate: TranslateService) {
        super();
        this.state = this.defaultState;
        this.uploadedFiles = new Array<string>();
        this.maxFilesNumber = Number.POSITIVE_INFINITY;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.parseResponse();
        if (this.dataField.validations && this.dataField.validations.length !== 0) {
            const val = this.dataField.validations.find(validation =>
                validation.validationRule.includes(FileListFieldValidation.MAX_FILES)
            );
            if (val && val.validationRule.split(' ').length === 2 && !isNaN(parseInt(val.validationRule.split(' ')[1], 10))) {
                this.maxFilesNumber = parseInt(val.validationRule.split(' ')[1], 10);
                this.maxFilesMessage = val.validationMessage && val.validationMessage !== '' ? val.validationMessage : null;
            }
        }
    }

    /**
     * Set file picker and image elements to [FileFieldService]{@link FileFieldService}.
     *
     * Initialize file image.
     */
    ngAfterViewInit(): void {
        if (this.fileUploadEl) {
            this.fileUploadEl.nativeElement.onchange = () => this.upload();
        }
    }

    public chooseFile() {
        if (this.state.uploading) {
            return;
        }
        this.fileUploadEl.nativeElement.click();
    }

    /**
     * Call after click on file field.
     *
     * If file field has no file uploaded
     * [FilesUploadComponent]{@link FilesUploadComponent} via [SideMenu]{@link SideMenuService} opens.
     *
     * Otherwise opens a file picker from which the user can select files.
     */
    public upload() {
        if (!this.fileUploadEl.nativeElement.files || this.fileUploadEl.nativeElement.files.length === 0) {
            return;
        }
        if (!this.taskId) {
            this._log.error('File cannot be uploaded. No task is set to the field.');
            return;
        }
        if (this.fileUploadEl.nativeElement.files.length + this.uploadedFiles.length > this.maxFilesNumber) {
            this._snackbar.openErrorSnackBar(this.maxFilesMessage ? this.maxFilesMessage :
                this._translate.instant('dataField.snackBar.maxFilesExceeded') + this.maxFilesNumber
            );
            return;
        }

        let filesToUpload = Array.from(this.fileUploadEl.nativeElement.files);
        let sum = 0;
        filesToUpload.forEach(item => sum += item.size);
        if (this.dataField.maxUploadSizeInBytes &&
            this.dataField.maxUploadSizeInBytes < sum) {
            this._log.error('Files cannot be uploaded. Maximum size of files exceeded.');
            this._snackbar.openErrorSnackBar(
                this._translate.instant('dataField.snackBar.maxFilesSizeExceeded') + this.dataField.maxUploadSizeInBytes
            );
        }

        if (this.dataField.value && this.dataField.value.namesPaths && this.dataField.value.namesPaths.length !== 0) {
            this.dataField.value.namesPaths.forEach(namePath => {
                filesToUpload = filesToUpload.filter(fileToUpload => fileToUpload.name !== namePath.name);
            });
            if (filesToUpload.length === 0) {
                this._log.error('User chose the same files that are already uploaded. Uploading skipped');
                this._snackbar.openErrorSnackBar(this._translate.instant('dataField.snackBar.wontUploadSameFiles'));
                return;
            }
        }

        this.state = this.defaultState;
        this.state.uploading = true;
        const fileFormData = new FormData();

        filesToUpload.forEach(fileToUpload => {
            fileFormData.append('files', fileToUpload);
        });
        this._taskResourceService.uploadFile(this.taskId, this.dataField.stringId, fileFormData, true).subscribe(response => {
            if ((response as ProviderProgress).type && (response as ProviderProgress).type === ProgressType.UPLOAD) {
                this.state.progress = (response as ProviderProgress).progress;
            } else {
                this.dataField.emitChangedFields(response as ChangedFieldContainer);
                this._log.debug(
                    `Files [${this.dataField.stringId}] were successfully uploaded`
                );
                this.state.completed = true;
                this.state.error = false;
                this.state.uploading = false;
                this.state.progress = 0;
                filesToUpload.forEach(fileToUpload => {
                    this.uploadedFiles.push(fileToUpload.name);
                    this.dataField.value.namesPaths.push({name: fileToUpload.name});
                });
            }
        }, error => {
            this.state.completed = true;
            this.state.error = true;
            this.state.uploading = false;
            this.state.progress = 0;
            this._log.error(
                `File [${this.dataField.stringId}] ${this.fileUploadEl.nativeElement.files.item(0)} uploading has failed!`, error
            );
            this._snackbar.openErrorSnackBar(this._translate.instant('dataField.snackBar.fileUploadFailed'));
        });
    }

    public download(fileName: string) {
        if (!this.dataField.value || !this.dataField.value.namesPaths ||
            !this.dataField.value.namesPaths.find(namePath => namePath.name === fileName)) {
            return;
        }
        if (!this.taskId) {
            this._log.error('File cannot be downloaded. No task is set to the field.');
            return;
        }

        this.state = this.defaultState;
        this.state.downloading = true;
        this._taskResourceService.downloadFile(this.taskId, this.dataField.stringId, fileName).subscribe(response => {
            if ((response as ProviderProgress).type && (response as ProviderProgress).type === ProgressType.DOWNLOAD) {
                this.state.progress = (response as ProviderProgress).progress;
            } else {
                this._log.debug(`File [${this.dataField.stringId}] ${fileName} was successfully downloaded`);
                this.downloadViaAnchor(response as Blob, fileName);
                this.state.downloading = false;
                this.state.progress = 0;
                this.dataField.downloaded.push(fileName);
            }
        }, error => {
            this._log.error(`Downloading file [${this.dataField.stringId}] ${fileName} has failed!`, error);
            this._snackbar.openErrorSnackBar(fileName + ' ' + this._translate.instant('dataField.snackBar.downloadFail'));
            this.state.downloading = false;
            this.state.progress = 0;
        });
    }

    private downloadViaAnchor(blob: Blob, fileName: string): void {
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        blob = new Blob([blob], {type: 'application/octet-stream'});
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    public deleteFile(fileName: string) {
        if (!this.dataField.value || !this.dataField.value.namesPaths ||
            !this.dataField.value.namesPaths.find(namePath => namePath.name === fileName)) {
            return;
        }
        if (!this.taskId) {
            this._log.error('File cannot be deleted. No task is set to the field.');
            return;
        }

        this._taskResourceService.deleteFile(this.taskId, this.dataField.stringId, fileName).subscribe(response => {
            if (response.success) {
                this.uploadedFiles = this.uploadedFiles.filter(uploadedFile => uploadedFile !== fileName);
                if (this.dataField.value.namesPaths) {
                    this.dataField.value.namesPaths = this.dataField.value.namesPaths.filter(namePath => namePath.name !== fileName);
                }
                this.dataField.downloaded = this.dataField.downloaded.filter(one => one !== fileName);
                this._log.debug(`File [${this.dataField.stringId}] ${fileName} was successfully deleted`);
            } else {
                this._log.error(`Downloading file [${this.dataField.stringId}] ${fileName} has failed!`, response.error);
                this._snackbar.openErrorSnackBar(
                    fileName + ' ' + this._translate.instant('dataField.snackBar.fileDeleteFailed')
                );
            }
        });
    }

    private get defaultState(): FilesState {
        return {
            progress: 0,
            completed: false,
            error: false,
            uploading: false,
            downloading: false
        };
    }

    /**
     * Construct display name.
     */
    public constructDisplayName(): string {
        return this.dataField.placeholder ? this.dataField.placeholder : this._translate.instant('dataField.noFile');
    }

    private parseResponse(): void {
        if (this.dataField.value) {
            if (this.dataField.value.namesPaths && this.dataField.value.namesPaths.length !== 0) {
                this.dataField.value.namesPaths.forEach(namePath => {
                    this.uploadedFiles.push(namePath.name);
                });
            } else {
                this.dataField.value.namesPaths = new Array<FileFieldValue>();
            }
        }
    }
}
