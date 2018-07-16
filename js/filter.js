'use strict';

(function () {
  var MAP_FILTERS = document.querySelector('.map__filters');
  var selectElems = MAP_FILTERS.querySelectorAll('.map__filter');
  var featureCheckboxElems = MAP_FILTERS.querySelectorAll('input[type="checkbox"]');
  var FILTER_TYPE = MAP_FILTERS.querySelector('#housing-type');
  var FILTER_PRICE = MAP_FILTERS.querySelector('#housing-price');
  var FILTER_ROOMS = MAP_FILTERS.querySelector('#housing-rooms');
  var FILTER_GUESTS = MAP_FILTERS.querySelector('#housing-guests');

  var PRICE_RANGES = {
    low: 10000,
    high: 50000
  };

  var checkType = function (offerType, filterType) {
    return filterType === 'any' || filterType === offerType.toString();
  };

  var checkNumber = function (offerValue, filterValue) {
    return filterValue === 'any' || parseInt(filterValue.toString(), 10) === parseInt(offerValue.toString(), 10);
  };

  var getRentCostRange = function (offerRentCost) {
    if (offerRentCost < PRICE_RANGES.low) {
      return 'low';
    } else if (offerRentCost >= PRICE_RANGES.high) {
      return 'high';
    } else {
      return 'middle';
    }
  };

  var checkRentCost = function (offerRentCost, filtersCost) {
    return filtersCost === 'any' || filtersCost === getRentCostRange(offerRentCost);
  };

  selectElems.forEach(function (selectElem) {
    selectElem.dataset.feature = selectElem.id.replace(/housing-/i, '');
  });

  var filterFeatures = function (item) {
    var arr = Array.from(featureCheckboxElems).filter(function (checkedBox) {
      return checkedBox.checked;
    });
    return arr.every(function (feature) {
      return item.offer.features.indexOf(feature.value) !== -1;
    });
  };

  var filterOffers = function (data) {
    return checkType(data.offer.type, FILTER_TYPE.value) &&
      checkNumber(data.offer.rooms, FILTER_ROOMS.value) &&
      checkNumber(data.offer.guests, FILTER_GUESTS.value) &&
      checkRentCost(data.offer.price, FILTER_PRICE.value) &&
      filterFeatures(data);
  };

  var filterRents = function (data) {
    return data.filter(filterOffers);
  };


  window.filter = filterRents;

})();
