import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {PreviewDialogData} from '@netgrif/application-engine';
import {SafeUrl} from '@angular/platform-browser';


@Component({
    selector: 'nc-preview-dialog',
    templateUrl: './preview-dialog.component.html',
    styleUrls: ['./preview-dialog.component.scss']
})
export class PreviewDialogComponent implements OnInit {
    image: SafeUrl;

    constructor(@Inject(MAT_DIALOG_DATA) public data: PreviewDialogData) {
        data.imageFull.subscribe(imageSource => {
            this.image = imageSource;
        });
    }

    ngOnInit(): void {
    }

    fullImageExists(): boolean {
        return !!this.image;
    }

    isPdf(): boolean {
        return this.data.extension === 'pdf';
    }
}
