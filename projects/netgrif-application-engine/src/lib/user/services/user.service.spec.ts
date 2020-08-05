import {TestBed} from '@angular/core/testing';
import {UserService} from './user.service';
import {ConfigurationService} from '../../configuration/configuration.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TestConfigurationService} from '../../utility/tests/test-config';
import {AuthenticationService} from '../../authentication/services/authentication/authentication.service';
import {AuthenticationMethodService} from '../../authentication/services/authentication-method.service';
import {MockAuthenticationService} from '../../utility/tests/mocks/mock-authentication.service';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('UserService', () => {
    let service: UserService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                NoopAnimationsModule
            ],
            providers: [
                AuthenticationMethodService,
                {provide: ConfigurationService, useClass: TestConfigurationService},
                {provide: AuthenticationService, useClass: MockAuthenticationService},
            ]
        });
        service = TestBed.inject(UserService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should login', () => {
        service.login({password: '', username: ''}).subscribe(res => {
            expect(res.id).toEqual('id');
            expect(service.hasAuthority('ADMIN')).toBeTrue();
            expect(service.hasRoleById('id')).toBeTrue();
        });
    });

    it('should logout', () => {
        service.logout().subscribe(res => {
            expect(res).toEqual(undefined);
        });
    });

    it('should check authorities and roles', () => {
        expect(service.hasRole({id: 'ids', name: 'ids'})).toBeFalse();
        expect(service.hasAuthority('USER')).toBeFalse();
        expect(service.hasRoleById('ids')).toBeFalse();
    });

    afterAll(() => {
        TestBed.resetTestingModule();
    });
});
