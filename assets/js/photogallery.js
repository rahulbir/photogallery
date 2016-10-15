const googleApi = {
  host:             'https://www.googleapis.com/customsearch/v1',
  key:              'AIzaSyAFwXrSDLvjyqyZbLlZ_csNiCkDcsAHDeU',
  searchEngineId:   '013872130897346659415:yae-br_hnby',
  imageSize:        'xlarge',
  searchType:       'image',
  num:              '10'
}

// INITIALIZER
var images = [];
var photoGallery = document.getElementById('photos');
var lightbox = document.getElementById('lightbox');
var lightboxImage = document.getElementById('lightbox-image');
var lightboxCaption = document.getElementById('lightbox-caption');
var currentImageIndex = 0;

// TODO Change this to use asynchronous call
function getImages(search, page) {
  page = (page && (typeof page === 'integer')) ? page : 1;
  var xhr = new XMLHttpRequest();
  var path = '?q=' + search + 
             '&cx=' + googleApi.searchEngineId +
             '&key=' + googleApi.key +
             '&imgSize=' + googleApi.imageSize +
             '&searchType=' + googleApi.searchType +
             '&num=' + googleApi.num + 
             '&start=' + page;

  xhr.open('GET', `${googleApi.host}${path}`, false);
  xhr.send(null);

  response = JSON.parse(xhr.response);

  if(response.error) {
    return [];
  }

  return response.items;
};

function findImages() {
  var search = document.forms['search-form']['search'].value;
  
  var data = '';
  
  images = getImages(search, 1);
  images = images.concat(getImages(search, 2));

  for (var i = 0; i < images.length; i++) {
    data += '<div class="thumbnail"><img src="' + images[i].link + '" onclick="handleImageClick(' + i + ')"></img></div>';
  }

  photoGallery.innerHTML = data;
  return false;
}

function handleImageClick(index) {
  currentImageIndex = index; 
  lightbox.classList.remove('hide');
  lightboxImage.src = images[index].link;
  lightboxCaption.innerHTML = images[index].title;
}

function navigate(direction) {
  currentImageIndex += direction;

  if (currentImageIndex > images.length - 1) { currentImageIndex = 0; }
  if (currentImageIndex < 0) { currentImageIndex = images.length - 1; }

  handleImageClick(currentImageIndex);
}

function closeLightbox() {
  lightbox.classList.add('hide');
  lightboxImage.src = '';
  lightboxCaption.innerHTML = '';
}










