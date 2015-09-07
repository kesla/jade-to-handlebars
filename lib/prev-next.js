'use strict';

module.exports = function (elements) {
  elements.forEach(function (current, index) {
    current.prev = elements[index - 1];
    current.next = elements[index + 1];
  });
};
