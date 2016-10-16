(function() {
  // dom elements 
  var photoGallery     =  document.getElementById('photo-gallery');
  var lightbox         =  document.getElementById('lightbox');
  var lightboxImage    =  document.getElementById('lightbox-image');
  var lightboxCaption  =  document.getElementById('lightbox-caption');
  var lightboxPrevBtn  =  document.getElementById('prev-lightbox-btn');
  var lightboxNextBtn  =  document.getElementById('next-lightbox-btn');
  var lightboxCloseBtn =  document.getElementById('close-lightbox-btn');
  
  // global variables
  var images = [];                // meta data for images obtained from Google Search API
  var currentLightboxIndex = 0;   // index of the current image displayed in the lightbox
  var imageCount = 0;             // total number of images created. Used to track id's of images.
  var googleApi = {               // config for Google Search API
    host:             'https://www.googleapis.com/customsearch/v1',
    key:              'AIzaSyAFwXrSDLvjyqyZbLlZ_csNiCkDcsAHDeU',
    searchEngineId:   '013872130897346659415:yae-br_hnby',
    imageSize:        'xxlarge',
    searchType:       'image',
    num:              '10'
  };

  // on document load 
  getImageData('wallpaper', 1);
  getImageData('san+francisco', 2);
  initLightboxView();

  /**
   * Retrieve images from Google Search API asynchronously and initializes each image
   *
   * @param  {String} search    'Wallpaper'
   * @param  {Integer} page     defaults to 1
   */
  function getImageData(search, page) {
    search = search ? search : 'wallpaper';
    page = (page && (typeof page === 'integer')) ? page : 1;
    var path = '?q=' + search + 
               '&cx=' + googleApi.searchEngineId +
               '&key=' + googleApi.key +
               '&imgSize=' + googleApi.imageSize +
               '&searchType=' + googleApi.searchType +
               '&num=' + googleApi.num + 
               '&start=' + page;

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(e) {
      if (xhr.readyState === 4 && xhr.status === 200) {
        response = JSON.parse(xhr.responseText);
        images = images.concat(response.items);

        response.items.map(function(image) {
          initThumbnail(imageCount);
          initImage(image, imageCount);
          imageCount++;
        });
      }
    };

    xhr.onerror = function (e) {
      console.error(xhr.statusText);
    };

    xhr.open('GET', `${googleApi.host}${path}`);
    xhr.send(null);
  };

  /**
   * Create and initialize thumbnail with id
   *
   * @param  {Integer} id       id of the image associated with this thumbnail
   */
  function initThumbnail(id) {    
    var thumbnail = document.createElement('div');
    thumbnail.className = 'thumbnail';
    thumbnail.setAttribute('data-id', id);
    photoGallery.appendChild(thumbnail);
  }

  /**
   * Create, initialize, and preload images. 
   * Display images on screen once loaded. 
   * 
   * @note: This will cache all images in browser once loaded.
   *
   * @param  {Object} image     image meta data from google search api
   * @param  {Integer} id       id of the image
   */
  function initImage(image, id) {
    var thumbnail = document.querySelector('.thumbnail[data-id="' + id + '"]');
    startSpinner(thumbnail);

    var imageContainer = new Image();
    
    imageContainer.onload = function() {
      thumbnail.appendChild(imageContainer);
      stopSpinner(thumbnail);
    }

    imageContainer.src = image.link;
    imageContainer.onclick = function() {
      displayLightboxView(id);
    };
  }

  function initLightboxView() {
    lightboxPrevBtn.onclick = function() {
      navigateLightbox(-1);
    };

    lightboxNextBtn.onclick = function() {
      navigateLightbox(1);
    };

    lightboxCloseBtn.onclick = function() {
      closeLightbox();
    };
  }

  /**
   * Displays clicked image thumbnail in lightbox view
   *
   * @param  {Integer} index
   */
  function displayLightboxView(index) {
    currentLightboxIndex = index; 
    lightbox.classList.remove('hide');
    lightboxImage.src = images[index].link;
    lightboxCaption.innerHTML = images[index].title;
  }

  /**
   * Changes the lightbox image to the next or previous image in the photo-gallery list
   *
   * @param  {Integer} direction     -1 for previos, 1 for next
   */
  function navigateLightbox(direction) {
    if(direction !== -1 && direction !== 1) { return; }

    lightboxImage.src = '';

    currentLightboxIndex += direction;
    if (currentLightboxIndex > images.length - 1) { currentLightboxIndex = 0; }
    if (currentLightboxIndex < 0) { currentLightboxIndex = images.length - 1; }

    displayLightboxView(currentLightboxIndex);
  }

  /**
   * Closes the lightbox view
   */
  function closeLightbox() {
    lightbox.classList.add('hide');
    lightboxImage.src = '';
    lightboxCaption.innerHTML = '';
  }

  /**
   * Adds a loading spinner to target element 
   *
   * @param  {document.Element} targetElement
   */
  function startSpinner(targetElement) {
    if(!targetElement) { return; }

    var spinner = document.createElement('div');
    spinner.className = 'spinner';

    targetElement.appendChild(spinner);
  }

  /**
   * Stops a loading spinner on a target element 
   *
   * @param  {document.Element} targetElement
   */
  function stopSpinner(targetElement) {
    if(!targetElement) { return; }

    var spinner = document.querySelector('.thumbnail[data-id="' + targetElement.getAttribute('data-id') + '"] div.spinner');
    targetElement.removeChild(spinner);
  }
})();