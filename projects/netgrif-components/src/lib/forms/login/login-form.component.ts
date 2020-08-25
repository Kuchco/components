import {Component} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {UserService, AbstractLoginFormComponent} from '@netgrif/application-engine';

@Component({
    selector: 'nc-login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent extends AbstractLoginFormComponent {
    constructor(formBuilder: FormBuilder, protected _userService: UserService) {
        super(formBuilder, _userService);
    }
}
