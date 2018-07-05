/* =================================================================================================
 ___  _   _    _
/   || | | |  | |
\__  | | | |  | |  __
/    |/  |/_) |/  /  \_/\/
\___/|__/| \_/|__/\__/  /\_/
              |\
              |/
Ajaxinate v2.0.1
https://github.com/Elkfox/Ajaxinate
Copyright (c) 2017 Elkfox Co Pty Ltd
https://elkfox.com
Project lead: George Butter
MIT License
================================================================================================= */

const Ajaxinate = function ajaxinateConstructor(config) {
  const settings = config || {};
  /*
    pagination: Selector of pagination container
    container: Selector of repeating content
    offset: 0, offset the number of pixels before the bottom to start loading more on scroll
    loadingText: 'Loading', The text changed during loading
    callback: null, function to callback after a new page is loaded
  */
  const defaultSettings = {
    pagination: '.AjaxinatePagination',
    method: 'scroll',
    container: '.AjaxinateLoop',
    offset: 0,
    loadingText: 'Loading',
    callback: null,
  };
  // Merge configs
  this.settings = Object.assign(defaultSettings, settings);

  this.addScrollListeners = this.addScrollListeners.bind(this);
  this.addClickListener = this.addClickListener.bind(this);
  this.checkIfPaginationInView = this.checkIfPaginationInView.bind(this);
  this.stopMultipleClicks = this.stopMultipleClicks.bind(this);

  this.containerElement = document.querySelector(this.settings.container);
  this.paginationElement = document.querySelector(this.settings.pagination);

  this.initialize();
};

Ajaxinate.prototype.initialize = function initializeTheCorrectFunctionsBasedOnTheMethod() {
  if (this.containerElement) {
    const initializers = {
      click: this.addClickListener,
      scroll: this.addScrollListeners,
    };
    initializers[this.settings.method]();
  }
};

Ajaxinate.prototype.addScrollListeners = function addEventListenersForScrolling() {
  if (this.paginationElement) {
    document.addEventListener('scroll', this.checkIfPaginationInView);
    window.addEventListener('resize', this.checkIfPaginationInView);
    window.addEventListener('orientationchange', this.checkIfPaginationInView);
  }
};

Ajaxinate.prototype.addClickListener = function addEventListenerForClicking() {
  if (this.paginationElement) {
    this.nextPageLinkElement = this.paginationElement.getElementsByTagName('a')[0];
    this.clickActive = true;
    if(typeof(this.nextPageLinkElement) !== 'undefined') {
      this.nextPageLinkElement.addEventListener('click', this.stopMultipleClicks);
    }
  }
};

Ajaxinate.prototype.stopMultipleClicks = function handleClickEvent(event) {
  event.preventDefault();
  if (this.clickActive) {
    this.nextPageLinkElement.innerText = this.settings.loadingText;
    this.nextPageUrl = this.nextPageLinkElement.href;
    this.clickActive = false;
    this.loadMore();
  }
};

  if (((this.paginationElement.getBoundingClientRect().top <= window.innerHeight) - this.settings.offset && (this.paginationElement.getBoundingClientRect().bottom + this.settings.offset) >= 0)) {
    this.nextPageLinkElement = this.paginationElement.getElementsByTagName('a')[0];
    if(this.nextPageLinkElement) {
Ajaxinate.prototype.checkIfPaginationInView = function handleScrollEvent() {
    document.removeEventListener('scroll', this.checkIfPaginationInView);
    window.removeEventListener('resize', this.checkIfPaginationInView);
    window.removeEventListener('orientationchange', this.checkIfPaginationInView);
      this.nextPageLinkElement.innerText = this.settings.loadingText;
      this.nextPageUrl = this.nextPageLinkElement.href;
      this.loadMore();
    }
  }
};

Ajaxinate.prototype.loadMore = function getTheHtmlOfTheNextPageWithAnAjaxRequest() {
  this.request = new XMLHttpRequest();
  this.request.onreadystatechange = function success() {
    if (this.request.readyState === 4 && this.request.status === 200) {
      const newContainer = this.request.responseXML.querySelectorAll(this.settings.container)[0];
      const newPagination = this.request.responseXML.querySelectorAll(this.settings.pagination)[0];
      this.containerElement.insertAdjacentHTML('beforeend', newContainer.innerHTML);
      this.paginationElement.innerHTML = newPagination.innerHTML;
      if (this.settings.callback && typeof(this.settings.callback) === 'function') {
        this.settings.callback(this.request.responseXML);
      }
      this.initialize();
    }
  }.bind(this);
  this.request.open('GET', this.nextPageUrl);
  this.request.responseType = 'document';
  this.request.send();
};
