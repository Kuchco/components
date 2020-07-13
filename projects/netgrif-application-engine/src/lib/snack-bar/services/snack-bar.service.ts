import {Injectable} from '@angular/core';
import {GenericSnackBarComponent} from '../components/generic-snack-bar/generic-snack-bar.component';
import {SuccessSnackBarComponent} from '../components/success-snack-bar/success-snack-bar.component';
import {ErrorSnackBarComponent} from '../components/error-snack-bar/error-snack-bar.component';
import {WarningSnackBarComponent} from '../components/warning-snack-bar/warning-snack-bar.component';
import {SnackBarInjectionData} from '../models/snack-bar-injection-data';
import {MatSnackBar, MatSnackBarConfig, MatSnackBarRef} from '@angular/material/snack-bar';

export enum SnackBarVerticalPosition {
    BOTTOM = 'bottom',
    TOP = 'top'
}

export enum SnackBarHorizontalPosition {
    LEFT = 'left',
    CENTER = 'center',
    RIGHT = 'right'
}

@Injectable({
    providedIn: 'root'
})
export class SnackBarService {

    private _defaultTimeout = 2.5;

    constructor(private _snackBar: MatSnackBar) {
    }

    public openSuccessSnackBar(message: string,
                               verticalPosition = SnackBarVerticalPosition.BOTTOM,
                               horizontalPosition = SnackBarHorizontalPosition.CENTER,
                               durationInSeconds = this._defaultTimeout,
                               config?: MatSnackBarConfig<SnackBarInjectionData>): MatSnackBarRef<SuccessSnackBarComponent> {
        return this._snackBar.openFromComponent(SuccessSnackBarComponent, Object.assign({
            data: {
                message,
                matIconName: 'done',
                closable: false
            },
            duration: durationInSeconds * 1000,
            horizontalPosition,
            verticalPosition
        }, config));
    }

    public openErrorSnackBar(message: string,
                             verticalPosition = SnackBarVerticalPosition.BOTTOM,
                             horizontalPosition = SnackBarHorizontalPosition.CENTER,
                             // durationInSeconds = this._defaultTimeout,
                             config?: MatSnackBarConfig<SnackBarInjectionData>): MatSnackBarRef<ErrorSnackBarComponent> {
        return this._snackBar.openFromComponent(ErrorSnackBarComponent, Object.assign({
            data: {
                message,
                matIconName: 'error',
                closable: true
            },
            // duration: durationInSeconds * 1000, // Error has to be acknowledged to be closed
            horizontalPosition,
            verticalPosition
        }, config));
    }

    public openWarningSnackBar(message: string,
                               verticalPosition = SnackBarVerticalPosition.BOTTOM,
                               horizontalPosition = SnackBarHorizontalPosition.CENTER,
                               durationInSeconds = this._defaultTimeout,
                               config?: MatSnackBarConfig<SnackBarInjectionData>): MatSnackBarRef<WarningSnackBarComponent> {
        return this._snackBar.openFromComponent(WarningSnackBarComponent, Object.assign({
            data: {
                message,
                matIconName: 'warning',
                closable: false
            },
            duration: durationInSeconds * 1000,
            horizontalPosition,
            verticalPosition
        }, config));
    }

    public openGenericSnackBar(message: string,
                               matIconName: string,
                               verticalPosition = SnackBarVerticalPosition.BOTTOM,
                               horizontalPosition = SnackBarHorizontalPosition.CENTER,
                               durationInSeconds = this._defaultTimeout,
                               config?: MatSnackBarConfig<SnackBarInjectionData>): MatSnackBarRef<GenericSnackBarComponent> {
        return this._snackBar.openFromComponent(GenericSnackBarComponent, Object.assign({
            data: {
                message,
                matIconName,
                closable: true
            },
            duration: durationInSeconds * 1000,
            horizontalPosition,
            verticalPosition
        }, config));
    }
}
