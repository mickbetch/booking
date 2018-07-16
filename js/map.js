'use strict';

(function () {
  var MAP = document.querySelector('.map');
  var FORM = document.forms[1];
  var FIELDSETS = document.forms[1].querySelectorAll('fieldset');
  var addressInput = FORM.querySelector('#address');
  var MAP_PIN_MAIN_HEIGHT = 84;
  var MAP_PIN_MAIN_HALF_WIDTH = 32;
  var MAP_PIN_LIST = MAP.querySelector('.map__pins');
  var MAP_PIN_MAIN = MAP.querySelector('.map__pin--main');
  var STYLE_MAP_PIN_MAIN = getComputedStyle(MAP_PIN_MAIN);
  var MAP_PIN_MAIN_START_LEFT = MAP_PIN_MAIN.offsetLeft + 'px';
  var MAP_PIN_MAIN_START_TOP = MAP_PIN_MAIN.offsetTop + 'px';
  var FILTER_FORM = document.querySelector('.map__filters');
  var block = document.querySelector('.map__overlay');
  var mapData = [];
  var PIN_LIMIT_ON_MAP = 5;

  var Code = {
    ESC: 27,
    ENTER: 13,
    SPACE: 32
  };

  var limits = {
    top: 130,
    bottom: 630,
    right: block.offsetLeft + block.offsetWidth,
    left: block.offsetLeft
  };

  var closePopup = function () {
    var mapCard = document.querySelector('.map__card');
    if (mapCard) {
      mapCard.classList.add('hidden');
    }
    window.utils.removeActiveClass();

  };

  var calculateDistance = function (item) {
    var mainPinCoords = window.getMainPinCoords();
    var catX = mainPinCoords.x - item.location.x;
    var catY = mainPinCoords.y - item.location.y;
    var distance = Math.floor(Math.sqrt(Math.pow(catX, 2) + Math.pow(catY, 2)));

    return distance;
  };

  var pasteMapPins = function (data) {
    var length = Math.min(data.length, PIN_LIMIT_ON_MAP);
    var mapPinFragment = document.createDocumentFragment();
    for (var i = 0; i < length; i++) {
      mapPinFragment.appendChild(window.pin(data[i], i));
    }
    MAP_PIN_LIST.appendChild(mapPinFragment);
  };

  var getInputAddressCoordinates = function (coordinates, width, height) {
    var string = (parseInt(coordinates.left, 10) + width) + ', ' + (parseInt(coordinates.top, 10) + height);
    return string;
  };

  var toogleDisabledOnArrayElements = function (arr, isDisabled) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].setAttribute('disabled', isDisabled);
    }
  };

  var convertOffsetToCoords = function (x, y) {
    return {
      x: x + MAP_PIN_MAIN_HALF_WIDTH,
      y: y + MAP_PIN_MAIN_HEIGHT
    };
  };

  var convertCoordsToOffset = function (coord) {
    return {
      x: coord.x - MAP_PIN_MAIN_HALF_WIDTH,
      y: coord.y - MAP_PIN_MAIN_HEIGHT
    };
  };

  var removeDisabledOnArrayElements = function (arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].removeAttribute('disabled');
    }
  };

  var showActiveMap = function () {
    MAP.classList.remove('map--faded');
    FORM.classList.remove('ad-form--disabled');
    removeDisabledOnArrayElements(FIELDSETS);
    removeDisabledOnArrayElements(FILTER_FORM.children);
    window.backend.download(onDataLoadSuccess, onDataLoadError);
    window.form.syncTypeWithMinPrice();
    window.form.syncRoomsWithGuests();
  };

  var setStartMapPinCoords = function () {
    MAP_PIN_MAIN.style.left = MAP_PIN_MAIN_START_LEFT;
    MAP_PIN_MAIN.style.top = MAP_PIN_MAIN_START_TOP;
  };

  var deleteMapPins = function (parentElem, classNameOfDeletedChildren) {
    var mapPins = parentElem.querySelectorAll(classNameOfDeletedChildren);
    for (var i = 0; i < mapPins.length; i++) {
      parentElem.removeChild(mapPins[i]);
    }
  };

  var hideActiveMap = function () {
    MAP.classList.add('map--faded');
    FORM.classList.add('ad-form--disabled');
    FORM.reset();
    toogleDisabledOnArrayElements(FIELDSETS, true);
    deleteMapPins(MAP_PIN_LIST, '.map__pin:not(.map__pin--main)');
    setStartMapPinCoords();
    closePopup();
    addressInput.value = getInputAddressCoordinates(STYLE_MAP_PIN_MAIN, MAP_PIN_MAIN_HALF_WIDTH, MAP_PIN_MAIN_HEIGHT);
    MAP_PIN_MAIN.addEventListener('mouseup', onMapPinMainMouseUp);
    MAP_PIN_MAIN.addEventListener('keydown', onMapPinMainPressEnter);
  };

  var renderMap = function () {
    // if (mapData === undefined || mapData === null) {
    //   window.utils.messageError('Массив объявлений не инициализирован');
    //   return;
    // }

    var data = mapData;
    window.utils.removeElems();
    closePopup();
    window.map.filteredData = window.filter(data);
    window.map.filteredData.sort(function (a, b) {
      return calculateDistance(a) - calculateDistance(b);
    });
    pasteMapPins(window.map.filteredData);
  };

  var onDataLoadSuccess = function (data) {
    mapData = data;
    window.debounce(renderMap);
  };

  var onDataLoadError = function (error) {
    var errorElem = document.createElement('div');
    errorElem.classList.add('error', 'error--bottom');
    errorElem.textContent = error;
    document.body.insertAdjacentElement('afterbegin', errorElem);
    setTimeout(window.utils.hideErrorMessage, 3000, errorElem);
    document.addEventListener('click', function () {
      window.utils.hideErrorMessage(errorElem);
    });
    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === Code.ESC) {
        window.utils.hideErrorMessage(errorElem);
      }
    });
  };

  var onMapPinMainMouseUp = function () {
    showActiveMap();
    MAP_PIN_MAIN.removeEventListener('mouseup', onMapPinMainMouseUp);
    MAP_PIN_MAIN.removeEventListener('keydown', onMapPinMainPressEnter);
  };

  var onMapPinMainPressEnter = function (evt) {
    if (evt.keyCode === Code.ENTER || evt.keyCode === Code.SPACE) {
      showActiveMap();
    }
    MAP_PIN_MAIN.removeEventListener('mouseup', onMapPinMainMouseUp);
    MAP_PIN_MAIN.removeEventListener('keydown', onMapPinMainPressEnter);
  };

  MAP_PIN_MAIN.addEventListener('mouseup', onMapPinMainMouseUp);
  MAP_PIN_MAIN.addEventListener('keydown', onMapPinMainPressEnter);
  MAP_PIN_MAIN.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startCoords = {
      x: evt.pageX,
      y: evt.pageY
    };
    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      var shift = {
        x: startCoords.x - moveEvt.pageX,
        y: startCoords.y - moveEvt.pageY
      };
      var currentCoords = convertOffsetToCoords(MAP_PIN_MAIN.offsetLeft, MAP_PIN_MAIN.offsetTop);
      var newCoords = {
        x: currentCoords.x - shift.x,
        y: currentCoords.y - shift.y
      };
      if (newCoords.y > limits.bottom) {
        newCoords.y = limits.bottom;
      } else if (newCoords.y < limits.top) {
        newCoords.y = limits.top;
      }
      if (newCoords.x > limits.right) {
        newCoords.x = limits.right;
      } else if (newCoords.x < limits.left) {
        newCoords.x = limits.left;
      }
      // ------------
      window.getMainPinCoords = function () {
        return newCoords;
      };
      window.map.newCoords = newCoords;
      // ------------------
      var offsets = convertCoordsToOffset(newCoords);
      MAP_PIN_MAIN.style.top = offsets.y + 'px';
      MAP_PIN_MAIN.style.left = offsets.x + 'px';
      addressInput.value = newCoords.x + ', ' + newCoords.y;
      startCoords = {
        x: moveEvt.pageX,
        y: moveEvt.pageY
      };
      window.debounce(renderMap);
    };
    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      addressInput.value = getInputAddressCoordinates(MAP_PIN_MAIN.style, MAP_PIN_MAIN_HALF_WIDTH, MAP_PIN_MAIN_HEIGHT);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  FILTER_FORM.addEventListener('change', function () {
    window.debounce(renderMap);
  });
  FILTER_FORM.addEventListener('keydown', function (evt) {
    if (evt.keyCode === Code.ENTER && evt.target.name === 'features') {
      evt.target.checked = !evt.target.checked;
      window.debounce(renderMap);
    }
  });

  addressInput.value = getInputAddressCoordinates(MAP_PIN_MAIN.style, MAP_PIN_MAIN_HALF_WIDTH, MAP_PIN_MAIN_HEIGHT);
  toogleDisabledOnArrayElements(FIELDSETS, true);
  toogleDisabledOnArrayElements(FILTER_FORM.children, true);

  window.map = {
    hideActiveMap: hideActiveMap,
    onDataLoadError: onDataLoadError,
    mapData: mapData,
    filteredData: []
  };
})();


