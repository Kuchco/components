import {Component, OnInit} from '@angular/core';
import {RedirectService, User} from '@netgrif/application-engine';

@Component({
    selector: 'nae-app-login-card',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

    readonly TITLE = 'Login form';
    readonly DESCRIPTION = 'Ukážka login form...';

    constructor(private redirectService: RedirectService) {
    }

    ngOnInit(): void {
    }

    onLogin(user: User) {
        console.log(user);
        if (!!user.id) {
            this.redirectService.redirect();
        }
    }

}
