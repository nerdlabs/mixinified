const last = xs => xs[xs.length - 1];
const head = xs => xs[0];
const tail = xs => xs.slice(1);
const init = xs => xs.slice(0, -1);

const createContainer = (...mixins) => {
  const strategies = mixins.reduce(
    (strategies, { constructor: { strategies: mixinStrategies = {} } }) => {
      Object.entries(mixinStrategies).forEach(([method, strategy]) => {
        strategies[method] = strategy(
          mixins.map(instance => instance[method].bind(instance))
        );
      });
      return strategies;
    },
    {}
  );

  return strategies;
};
module.exports.createContainer = createContainer;

const strategies = {};
strategies.override = methods => (...args) => last(methods)(...args);
strategies.parallel = methods => (...args) => methods.map(m => m(...args));
strategies.pipe = methods => (...args) =>
  tail(methods).reduce(
    (result, method) => method(result),
    head(methods)(...args)
  );
strategies.compose = methods => (...args) =>
  init(methods).reduceRight(
    (result, method) => method(result),
    last(methods)(...args)
  );
module.exports.strategies = strategies;
