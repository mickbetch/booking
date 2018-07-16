'use strict';
(function () {

  var cleanNode = function (parentElement) {
    while (parentElement.firstChild) {
      parentElement.removeChild(parentElement.firstChild);
    }
  };

  var removeElems = function () {
    var pins = document.querySelectorAll('.map__pin[id]');

    pins.forEach(function (pin) {
      pin.parentNode.removeChild(pin);
    });
  };

  var removeActiveClass = function () {
    var mapPins = document.querySelectorAll('.map__pin--active');

    mapPins.forEach(function (pin) {
      pin.classList.remove('map__pin--active');
    });
  };

  var syncTwoSelect = function (evt, selectTwo) {
    var selectOne = evt.currentTarget;
    var selectedOption = selectOne.options[selectOne.selectedIndex];
    var form = selectOne.parentElement;

    while (form.tagName !== 'FORM') {
      form = form.parentElement;
    }

    for (var i = 0; i < selectTwo.options.length; i++) {
      if (selectTwo.options[i].value === selectedOption.value) {
        selectTwo.options[i].selected = 'true';
        break;
      }
    }
  };

  var hideErrorMessage = function (error) {
    error.classList.add('hidden');
    return error;
  };

  // var messageError = function (message) {
  //   console.error(message);
  // };

  window.utils = {
    cleanNode: cleanNode,
    syncTwoSelect: syncTwoSelect,
    hideErrorMessage: hideErrorMessage,
    removeElems: removeElems,
    removeActiveClass: removeActiveClass
    // messageError: messageError
  };
})();
