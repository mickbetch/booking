'use strict';

(function () {
  var FORM = document.forms[1];
  var ESC_KEYCODE = 27;
  var CHECKIN_SELECT_ELEM = FORM.querySelector('select[name="timein"]');
  var CHECKOUT_SELECT_ELEM = FORM.querySelector('select[name="timeout"]');
  var TYPE_SELECT_ELEM = FORM.querySelector('select[name="type"]');
  var PRICE_INPUT_ELEM = FORM.querySelector('input[name="price"]');
  var NUM_ROOM_SELECT_ELEM = FORM.querySelector('select[name="rooms"]');
  var TITLE_INPUT_ELEM = FORM.querySelector('input[name="title"]');
  var CAPACITY_SELECT_ELEM = FORM.querySelector('select[name="capacity"]');

  var CAPACITY_NUMBER = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };

  var typesToMinPrice = {
    bungalo: '0',
    flat: '1000',
    house: '5000',
    palace: '10000'
  };

  var INVALID_FIELD_BORDER = '2px solid red';

  var VALID_FIELD_BORDER = '';

  var FORM_RESET = FORM.querySelector('.ad-form__reset');

  var showSuccesBlock = function () {
    var success = document.querySelector('.success');
    success.classList.remove('hidden');

    document.addEventListener('click', hideSuccessBlock);
    document.addEventListener('keydown', onFormEscPress);
  };

  var hideSuccessBlock = function () {
    var success = document.querySelector('.success');
    success.classList.add('hidden');
    document.removeEventListener('keydown', onFormEscPress);
  };

  var onFormLoad = function () {
    showSuccesBlock();
    window.map.hideActiveMap();
  };

  var onFormSubmit = function (evt) {
    window.backend.upload(new FormData(evt.target), onFormLoad, window.map.onDataLoadError);

    evt.preventDefault();
  };

  var syncTypeWithMinPrice = function () {
    var selectOne = FORM.querySelector('select[name="type"]');
    var selectedValue = selectOne.options[selectOne.selectedIndex].value;
    var form = selectOne.parentElement;

    while (form.tagName !== 'FORM') {
      form = form.parentElement;
    }

    var selectTwo = FORM.querySelector('input[name="price"]');

    selectTwo.min = typesToMinPrice[selectedValue];
    selectTwo.placeholder = selectTwo.min;
  };

  var syncRoomsWithGuests = function () {
    var selectOne = FORM.querySelector('select[name="rooms"]');
    var selectTwo = FORM.querySelector('select[name="capacity"]');
    var allowedCapacity = CAPACITY_NUMBER[selectOne.value];
    var options = selectTwo.querySelectorAll('option');

    for (var i = 0; i < options.length; i++) {
      options[i].disabled = allowedCapacity.indexOf(options[i].value) === -1;
    }
    if (allowedCapacity.indexOf(selectTwo.value) === -1) {
      selectTwo.setCustomValidity('Введено неправильное значение');
    } else {
      selectTwo.setCustomValidity('');
    }
  };

  var onCheckinChange = function (evt) {
    window.utils.syncTwoSelect(evt, CHECKOUT_SELECT_ELEM);
  };

  var onCheckoutChange = function (evt) {
    window.utils.syncTwoSelect(evt, CHECKIN_SELECT_ELEM);
  };

  var onTypeSelectElemChange = function () {
    syncTypeWithMinPrice();
  };

  var onNumRoomSelectElemChange = function () {
    syncRoomsWithGuests();
  };

  var onTitleInputElemInvalid = function (evt) {
    evt.target.style.border = INVALID_FIELD_BORDER;
    if (evt.target.validity.tooShort) {
      evt.target.setCustomValidity('Заголовок объявления должен состоять минимум из 30 символов');
    } else if (evt.target.validity.tooLong) {
      evt.target.setCustomValidity('Заголовок объявления долэен содержать не более 100' +
        ' символов');
    } else if (evt.target.validity.valueMissing) {
      evt.target.setCustomValidity('Обязательное для заполнения поле');
    } else {
      evt.target.setCustomValidity('');
      evt.target.style.border = VALID_FIELD_BORDER;
    }
  };

  var onTitleInputElemInput = function (evt) {
    if (evt.target.value.length < 30) {
      evt.target.setCustomValidity('Заголовок объявления должен состоять минимум из 30 символов');
    } else {
      evt.target.setCustomValidity('');
    }
  };

  var onPriceInputElemInvalid = function (evt) {
    evt.target.style.border = INVALID_FIELD_BORDER;
    if (evt.target.validity.typeMismatch) {
      evt.target.setCustomValidity('Используйте числовые значения');
    } else if (evt.target.validity.rangeOverflow) {
      evt.target.setCustomValidity('Цена не должна превышать 1 000 000');
    } else if (evt.target.validity.valueMissing) {
      evt.target.setCustomValidity('Обязательное для заполнения поле');
    } else if (evt.target.validity.rangeUnderflow) {
      evt.target.setCustomValidity('Минимальная цена составляет не менее ' +
        evt.target.min);
    } else {
      evt.target.setCustomValidity('');
      evt.target.style.border = VALID_FIELD_BORDER;
    }
  };

  var onFormEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      hideSuccessBlock();
    }
  };

  var onFormResetClick = function (evt) {
    evt.preventDefault();
    window.map.hideActiveMap();
  };

  TITLE_INPUT_ELEM.addEventListener('invalid', onTitleInputElemInvalid);
  TITLE_INPUT_ELEM.addEventListener('input', onTitleInputElemInput);


  PRICE_INPUT_ELEM.addEventListener('invalid', onPriceInputElemInvalid);
  PRICE_INPUT_ELEM.addEventListener('input', onPriceInputElemInvalid);
  NUM_ROOM_SELECT_ELEM.addEventListener('change', onNumRoomSelectElemChange);

  CHECKIN_SELECT_ELEM.addEventListener('change', onCheckinChange);
  CHECKOUT_SELECT_ELEM.addEventListener('change', onCheckoutChange);
  TYPE_SELECT_ELEM.addEventListener('change', onTypeSelectElemChange);

  CAPACITY_SELECT_ELEM.addEventListener('change', syncRoomsWithGuests);

  FORM.addEventListener('submit', onFormSubmit);
  FORM_RESET.addEventListener('click', onFormResetClick);

  window.form = {
    syncTypeWithMinPrice: syncTypeWithMinPrice,
    syncRoomsWithGuests: syncRoomsWithGuests
  };
})();
