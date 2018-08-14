const assert = require('assert');
const { createContainer, strategies } = require('./index');

class MixinA {
  regularMethod(input) {
    return [this.constructor, input];
  }
  overrideMethod(input) {
    return [this.constructor, input];
  }
  parallelMethod(input) {
    return [this.constructor, input];
  }
  pipeMethod(input) {
    return [this.constructor, input];
  }
  composeMethod(input) {
    return [this.constructor, input];
  }
}
MixinA.strategies = {
  overrideMethod: strategies.override,
  parallelMethod: strategies.parallel,
  pipeMethod: strategies.pipe,
  composeMethod: strategies.compose,
};

class MixinB {
  regularMethod(input) {
    return [this.constructor, input];
  }
  overrideMethod(input) {
    return [this.constructor, input];
  }
  parallelMethod(input) {
    return [this.constructor, input];
  }
  pipeMethod(input) {
    return [this.constructor, input];
  }
  composeMethod(input) {
    return [this.constructor, input];
  }
}

const a = new MixinA();
const b = new MixinB();
const container = createContainer(a, b);

// regularMethod is not available on container
{
  assert.equal(typeof container.regularMethod, 'undefined');
}

// executes overrideMethod of MixinB only
{
  const actual = container.overrideMethod('overrideMethod');
  assert.deepEqual(actual, [MixinB, 'overrideMethod']);
}

// executes parallelMethod of MixinA and MixinB and returns results as array
{
  const actual = container.parallelMethod('parallelMethod');
  assert.deepEqual(actual, [
    [MixinA, 'parallelMethod'],
    [MixinB, 'parallelMethod'],
  ]);
}

// executes pipeMethod of MixinA and passes the result to pipeMethod of MixinB
{
  const actual = container.pipeMethod('pipeMethod');
  assert.deepEqual(actual, [MixinB, [MixinA, 'pipeMethod']]);
}

// executes composeMethod of MixinB and passes the result to composeMethod of MixinA
{
  const actual = container.composeMethod('composeMethod');
  assert.deepEqual(actual, [MixinA, [MixinB, 'composeMethod']]);
}
