import { expect } from 'chai';
import 'mocha';

import temp from '../../src/utils/temp';

describe('Types', () => {
  it("should equal 'Hello World'", () => {
    expect(temp).to.equal('Hello World');
  });
});
