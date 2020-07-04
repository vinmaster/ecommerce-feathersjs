import assert from 'assert';
import app from '../../src/app';

describe('\'products\' service', () => {
  it('registered the service', () => {
    const service = app.service('products');

    assert.ok(service, 'Registered the service');
  });
});
