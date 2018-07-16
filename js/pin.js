'use strict';

(function () {
  var TEMPLATE = document.querySelector('template').content;
  var TEMPLATE_MAP_PIN = TEMPLATE.querySelector('.map__pin');
  var ESC_KEYCODE = 27;

  var getClickedMapPinData = function (elem) {
    var offerIndex = parseInt(elem.id, 10);
    return window.map.filteredData[offerIndex];
  };

  var openPopup = function () {
    var mapCard = document.querySelector('.map__card');
    mapCard.classList.remove('hidden');
  };

  var onPopupEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closePopup();
    }
  };

  var closePopup = function () {
    var mapCard = document.querySelector('.map__card');
    if (mapCard) {
      mapCard.classList.add('hidden');
    }
    window.utils.removeActiveClass();

  };

  var onPopupCloseClick = function () {
    var popupClose = document.querySelector('.popup__close');
    popupClose.addEventListener('click', function () {
      closePopup();
    });
    document.addEventListener('keydown', onPopupEscPress);
  };

  var renderMapPin = function (item, index) {
    var mapPin = TEMPLATE_MAP_PIN.cloneNode(true);
    var mapPinWidth = mapPin.style.width;
    var mapPinHeight = mapPin.style.height;
    mapPin.style = 'left: ' + (item.location.x - (mapPinWidth / 2)) + 'px; top: ' + (item.location.y - mapPinHeight) + 'px;';
    mapPin.querySelector('img').src = item.author.avatar;
    mapPin.querySelector('img').alt = item.offer.title[index];
    mapPin.id = index;
    mapPin.addEventListener('click', onMapPinClick);
    return mapPin;
  };

  var onMapPinClick = function (evt) {
    window.utils.removeActiveClass();
    evt.currentTarget.classList.add('map__pin--active');
    window.card(getClickedMapPinData(evt.currentTarget));
    onPopupCloseClick();
    openPopup();
  };

  window.pin = renderMapPin;
})();
