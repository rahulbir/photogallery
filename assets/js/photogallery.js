(() => {
  // dom elements 
  const photoGallery     =  document.getElementById('photo-gallery');
  const lightbox         =  document.getElementById('lightbox');
  const lightboxImage    =  document.getElementById('lightbox-image');
  const lightboxCaption  =  document.getElementById('lightbox-caption');
  const lightboxPrevBtn  =  document.getElementById('prev-lightbox-btn');
  const lightboxNextBtn  =  document.getElementById('next-lightbox-btn');
  const lightboxCloseBtn =  document.getElementById('close-lightbox-btn');

  // configurations
  const googleApi = {
    host:             'https://www.googleapis.com/customsearch/v1',
    key:              'AIzaSyAFwXrSDLvjyqyZbLlZ_csNiCkDcsAHDeU',
    searchEngineId:   '013872130897346659415:yae-br_hnby',
    imageSize:        'xxlarge',
    searchType:       'image',
    num:              '10'
  };
  
  // global variables
  let images = [];                // meta data for images obtained from Google Search API
  let currentLightboxIndex = 0;   // index of the current image displayed in the lightbox
  let imageCount = 0;             // total number of images created. Used to track id's of images.

  /**
   * Retrieve images from Google Search API asynchronously and initializes each image
   *
   * @param  {String} search    'Wallpaper'
   * @param  {Integer} page     defaults to 1
   */
  const getImageData = (search, page) => {
    search = search ? search : 'wallpaper';
    page = (page && (typeof page === 'number')) ? page : 1;
    
    const path = '?q=' + search + 
               '&cx=' + googleApi.searchEngineId +
               '&key=' + googleApi.key +
               '&imgSize=' + googleApi.imageSize +
               '&searchType=' + googleApi.searchType +
               '&num=' + googleApi.num + 
               '&start=' + page;

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = (e) => {
      if(xhr.readyState === 4 && xhr.status === 200) {
        response = JSON.parse(xhr.responseText);
        images = images.concat(response.items);

        response.items.map(image => {
          initThumbnail(imageCount);
          initImage(image, imageCount);
          imageCount++;
        });
      }
    };

    xhr.onerror = (e) => console.error(xhr.statusText);

    xhr.open('GET', `${googleApi.host}${path}`);
    xhr.send(null);
  };

  /**
   * Create and initialize thumbnail with id
   *
   * @param  {Integer} id       id of the image associated with this thumbnail
   */
  const initThumbnail = (id) => {    
    var thumbnail = document.createElement('div');
    thumbnail.className = 'thumbnail';
    thumbnail.setAttribute('data-id', id);
    photoGallery.appendChild(thumbnail);
  };

  /**
   * Create, initialize, and preload images. 
   * Display images on screen once loaded. 
   * 
   * @note: This will cache all images in browser once loaded.
   *
   * @param  {Object} image     image meta data from google search api
   * @param  {Integer} id       id of the image
   */
  const initImage = (image, id) => {
    const thumbnail = document.querySelector('.thumbnail[data-id="' + id + '"]');
    startSpinner(thumbnail);

    let imageContainer = new Image();
    
    imageContainer.onload = () => {
      thumbnail.appendChild(imageContainer);
      stopSpinner(thumbnail);
    }

    imageContainer.src = image.link;
    imageContainer.onclick = () => displayLightboxView(id);
  };

  const initLightboxView = () => {
    lightboxPrevBtn.onclick = () => navigateLightbox(-1);
    lightboxNextBtn.onclick = () => navigateLightbox(1);
    lightboxCloseBtn.onclick = () => closeLightbox();
  };

  /**
   * Displays clicked image thumbnail in lightbox view
   *
   * @param  {Integer} index
   */
  const displayLightboxView = (index) => {
    currentLightboxIndex = index; 
    lightbox.classList.remove('hide');
    lightboxImage.src = images[index].link;
    lightboxCaption.innerHTML = images[index].title;
  };

  /**
   * Changes the lightbox image to the next or previous image in the photo-gallery list
   *
   * @param  {Integer} direction     -1 for previos, 1 for next
   */
  const navigateLightbox = (direction) => {
    if(direction !== -1 && direction !== 1) { return; }

    lightboxImage.src = '';

    currentLightboxIndex += direction;
    if(currentLightboxIndex > images.length - 1) { currentLightboxIndex = 0; }
    if(currentLightboxIndex < 0) { currentLightboxIndex = images.length - 1; }

    displayLightboxView(currentLightboxIndex);
  };

  /**
   * Closes the lightbox view
   */
  const closeLightbox = () => {
    lightbox.classList.add('hide');
    lightboxImage.src = '';
    lightboxCaption.innerHTML = '';
  };

  /**
   * Adds a loading spinner to target element 
   *
   * @param  {document.Element} targetElement
   */
  const startSpinner = (targetElement) => {
    if(!targetElement) { return; }

    var spinner = document.createElement('div');
    spinner.className = 'spinner';

    targetElement.appendChild(spinner);
  };

  /**
   * Stops a loading spinner on a target element 
   *
   * @param  {document.Element} targetElement
   */
  const stopSpinner = (targetElement) => {
    if(!targetElement) { return; }

    var spinner = document.querySelector('.thumbnail[data-id="' + targetElement.getAttribute('data-id') + '"] div.spinner');
    targetElement.removeChild(spinner);
  };

  // on document load fetch 20 images asynchronously and display them on screen
  getImageData('san+francisco', 1);
  getImageData('san+francisco', 2);
  initLightboxView();
})();