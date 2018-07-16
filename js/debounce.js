'use strict';

(function () {
  var lastTimeout;

  var DEBOUNCE_INTERVAL = 500;

  window.debounce = function (callback) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }

    lastTimeout = window.setTimeout(callback, DEBOUNCE_INTERVAL);
  };
})();
