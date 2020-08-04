import {inject, TestBed} from '@angular/core/testing';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TranslateInterceptor} from './translate-interceptor';
import {ConfigurationService} from '../configuration/configuration.service';
import {TestConfigurationService} from '../utility/tests/test-config';
import {TranslateLibModule} from './translate-lib.module';
import {MatSnackBarModule} from '@angular/material';
import {AuthenticationMethodService} from '../authentication/services/authentication-method.service';
import {AuthenticationService} from '../authentication/services/authentication/authentication.service';
import {MockAuthenticationService} from '../utility/tests/mocks/mock-authentication.service';
import {UserResourceService} from '../resources/engine-endpoint/user-resource.service';
import {MockUserResourceService} from '../utility/tests/mocks/mock-user-resource.service';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('TranslateInterceptor', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                TranslateLibModule,
                MatSnackBarModule,
                NoopAnimationsModule
            ],
            providers: [
                AuthenticationMethodService,
                {provide: AuthenticationService, useClass: MockAuthenticationService},
                {provide: UserResourceService, useClass: MockUserResourceService},
                {provide: ConfigurationService, useClass: TestConfigurationService},
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: TranslateInterceptor,
                    multi: true
                }
            ]
        });
    });

    describe('intercept HTTP request', () => {
        it('should add Accept-language to headers', inject([HttpClient, HttpTestingController],
            (http: HttpClient, mock: HttpTestingController) => {

                http.get('/api').subscribe(response => {
                    expect(response).toBeTruthy();
                });
                const request = mock.expectOne(req => req.headers.has('Accept-Language'));

                request.flush({});
                mock.verify();
            }));
    });

    afterEach(inject([HttpTestingController], (mock: HttpTestingController) => {
        mock.verify();
    }));

    afterAll(() => {
        TestBed.resetTestingModule();
    });
});
