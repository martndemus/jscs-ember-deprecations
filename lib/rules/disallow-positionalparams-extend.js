var assert = require('assert');
var EmberCoreHelpers = require('../helpers/ember-core');

module.exports = function() {};

module.exports.prototype.getOptionName = function() {
  return 'disallowPositionalParamsExtend';
};

module.exports.prototype.configure = function(options) {
  assert(
    options === true,
    this.getOptionName() + ' option requires a true value or should be removed'
  );
};

module.exports.prototype.check = function(file, errors) {
  var ember = new EmberCoreHelpers(file);
  ember.findExtendBlocksProperties('positionalParams').forEach(function(prop) {
    errors.add(
      'positionalParams within .extend() is deprecated in Ember 1.13',
      prop.loc.start
    );
  });
};