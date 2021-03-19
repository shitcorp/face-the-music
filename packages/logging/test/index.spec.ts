import { expect } from 'chai';
import 'mocha';

import Logger from '../src/index';

describe('Logger', () => {
  it('should be a class', () => {
    expect(Logger).to.be.a('function');
  });
});
