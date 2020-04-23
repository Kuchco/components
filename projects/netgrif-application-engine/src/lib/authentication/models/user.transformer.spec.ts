import {UserTransformer} from './user.transformer';

describe('UserTransformer', () => {
    it('should create an instance', () => {
        expect(new UserTransformer()).toBeTruthy();
    });

    it('should transform user', () => {
        const userTransformer = new UserTransformer();
        expect(userTransformer.transform({
            id: 'string',
            email: 'string',
            name: 'string',
            surname: 'string',
            fullName: 'string string',
            groups: [],
            authorities: [{authority: 'ADMIN'}],
            processRoles: [{stringId: 'string', description: 'desc', name: 'name'}],
            userProcessRoles: [{netId: 'netid', roleId: 'roleid'}],
            _links: {}
        }).fullName).toEqual('string string');
    });
});
