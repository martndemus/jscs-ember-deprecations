var assert = require('assert');

module.exports = function() {};

module.exports.prototype.getOptionName = function() {
  return 'disallowPrivateRegistryProperty';
};

module.exports.prototype.configure = function(options) {
  assert(
    options === true || options === false,
    this.getOptionName() + ' option requires a true value or should be removed'
  );

  this.map = {
    'resolve': 'resolveRegistration',
    'register': 'register',
    'unregister': 'unregister',
    'has': 'hasRegistration',
    'option': 'registerOption',
    'options': 'registerOptions',
    'getOptions': 'registeredOptions',
    'optionsForType': 'registerOptionsForType',
    'getOptionsForType': 'registeredOptionsForType',
    'injection': 'inject'
  };
};

module.exports.prototype.check = function(file, errors) {
  var _this = this;

  file.iterateNodesByType('MemberExpression', function(node) {
    if (node.property.name !== 'registry' || !node.parentNode.property) {
      return;
    }

    var method = node.parentNode.property.name;
    if (method in _this.map) {
      errors.cast({
        message: 'app.registry.' + method +
          ' is deprecated in Ember 2.1. Use app.' + _this.map[method] +
          ' instead',
        line: node.parentNode.loc.start.line,
        column: node.parentNode.loc.start.column,
        additional: node
      });
    }
  });
};

module.exports.prototype._fix = function(file, error) {
  var node = error.additional.property;
  var token = file.getFirstNodeToken(node);
  file.removeToken(file.findNextToken(token, 'Punctuator', '.'));
  file.removeToken(token);

  var methodToken = file.getFirstNodeToken(error.additional.parentNode.property);
  methodToken.value = this.map[error.additional.parentNode.property.name];
};
