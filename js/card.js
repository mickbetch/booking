'use strict';

(function () {
  var MAP = document.querySelector('.map');
  var TEMPLATE = document.querySelector('template').content;
  var TEMPLATE_MAP_CARD = TEMPLATE.querySelector('.map__card');
  var PLACE_BEFORE_CARD_LIST = MAP.querySelector('.map__filters-container');

  var HOUSE_LABELS = {
    'palace': 'дворец',
    'flat': 'квартира',
    'house': 'дом',
    'bungalo': 'бунгало'
  };

  var createFeaturesElem = function (feature) {
    var featureElem = document.createElement('li');
    featureElem.classList.add('popup__feature', 'popup__feature--' + feature);
    return featureElem;
  };

  var renderFeaturesElem = function (featuresArr, parentElement) {
    window.utils.cleanNode(parentElement);
    var featuresFragment = document.createDocumentFragment();
    for (var i = 0; i < featuresArr.length; i++) {
      featuresFragment.appendChild(createFeaturesElem(featuresArr[i]));
    }
    return featuresFragment;
  };

  var createPhotoElem = function () {
    var photoElem = document.createElement('img');
    photoElem.classList.add('popup__photo');
    photoElem.width = '45';
    photoElem.height = '40';
    photoElem.alt = 'Фотография жилья';
    return photoElem;
  };

  var renderPhotoElem = function (photosArr, parentElement) {
    window.utils.cleanNode(parentElement);
    var featuresFragment = document.createDocumentFragment();
    for (var i = 0; i < photosArr.length; i++) {
      var photo = createPhotoElem();
      photo.src = photosArr[i];
      featuresFragment.appendChild(photo);
    }
    return featuresFragment;
  };

  var createMapCard = function (data) {
    TEMPLATE_MAP_CARD.querySelector('.popup__title').textContent = data.offer.title;
    TEMPLATE_MAP_CARD.querySelector('.popup__text--address').textContent = data.offer.address;
    TEMPLATE_MAP_CARD.querySelector('.popup__text--price').textContent = data.offer.price + '₽/ночь';
    TEMPLATE_MAP_CARD.querySelector('.popup__type').textContent = HOUSE_LABELS[data.offer.type];
    TEMPLATE_MAP_CARD.querySelector('.popup__text--capacity').textContent = data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей';
    TEMPLATE_MAP_CARD.querySelector('.popup__text--time').textContent = 'Заезд после ' + data.offer.checkin + ', выезд до ' + data.offer.checkout;
    TEMPLATE_MAP_CARD.querySelector('.popup__features').appendChild(renderFeaturesElem(data.offer.features, TEMPLATE_MAP_CARD.querySelector('.popup__features')));
    TEMPLATE_MAP_CARD.querySelector('.popup__description').textContent = data.offer.description;
    TEMPLATE_MAP_CARD.querySelector('.popup__photos').appendChild(renderPhotoElem(data.offer.photos, TEMPLATE_MAP_CARD.querySelector('.popup__photos')));
    TEMPLATE_MAP_CARD.querySelector('.popup__avatar').src = data.author.avatar;

    return TEMPLATE_MAP_CARD;
  };

  var renderMapCard = function (data) {
    var oldOfferElem = MAP.querySelector('.map__card');
    var offerElem = createMapCard(data);
    if (oldOfferElem) {
      MAP.replaceChild(offerElem, oldOfferElem);
    } else {
      MAP.insertBefore(createMapCard(data), PLACE_BEFORE_CARD_LIST);
    }
  };

  window.card = renderMapCard;
})();
