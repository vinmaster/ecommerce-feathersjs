import assert from 'assert';
import app from '../../src/app';
import logger from '../../src/logger';

describe("'users' service", () => {
  beforeEach(async () => {
    await app.service('users').remove(null);
  });

  it('registered the service', () => {
    const service = app.service('users');

    assert.ok(service, 'Registered the service');
  });

  const userInfo = {
    username: 'someone@example.com',
    password: 'supersecret',
  };

  it('create the user', async () => {
    const user = await app.service('users').create(userInfo);
    assert.equal(userInfo.username, user.username);
    assert.equal('Customer', user.role);
    assert.notEqual(userInfo, user.password);
    assert.ok(user.createdAt);
    assert.ok(user.updatedAt);
  });

  it('update the user', async () => {
    const user = await app.service('users').create(userInfo);
    const newUserInfo = {
      username: 'new username',
    };
    const newUser = await app.service('users').update(user._id, newUserInfo);
    assert.equal(newUserInfo.username, newUser.username);
  });

  it('patch the user', async () => {
    const user = await app.service('users').create(userInfo);
    const newUserInfo = {
      username: 'new username',
    };
    const newUser = await app.service('users').patch(user._id, newUserInfo);
    assert.equal(newUserInfo.username, newUser.username);
  });
});
