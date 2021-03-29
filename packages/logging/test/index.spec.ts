import { expect } from 'chai';
import 'mocha';

import * as Logger from '../src/index';

describe('Logger', () => {
  it('should be a object', () => {
    expect(Logger.logger).to.be.a('object');
  });
});

describe('useConsole', () => {
  it('should be a function', () => {
    expect(Logger.useConsole).to.be.a('function');
  });
});

describe('useSentry', () => {
  it('should be a function', () => {
    expect(Logger.useSentry).to.be.a('function');
  });
});

describe('useElastic', () => {
  it('should be a function', () => {
    expect(Logger.useElastic).to.be.a('function');
  });
});

describe('handleException', () => {
  it('should be a function', () => {
    expect(Logger.handleException).to.be.a('function');
  });
});

describe('handleWarning', () => {
  it('should be a function', () => {
    expect(Logger.handleWarning).to.be.a('function');
  });
});
