import { assert } from 'chai';
import config from '../lib/config';

describe('config', () => {
  it('should not be undefined', () => {
    assert.isDefined(config);
  });
  // TODO : more tests
});
