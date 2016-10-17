# Photo Gallery
A page that asynchronously loads and caches images in the browser from Google's Custom Search API and displays them on the page as a grid of photo thumbnails. When an image is clicked, the images are loaded into a lightbox view with the image's title. 

## Demo
https://rahulbir.github.io/photogallery/


## Configurations
#### Note: This is an optional step. You can just skip this and use my keys :) 

You can change the required keys and configurations for Google Custom Search API and Google Search Engine in `photogallery.js`. Typically this would live on a server in a `.env` file for all configration keys. 

These can be obtained at: 
- Google Search Engine: https://cse.google.com/
- Google API Manager: https://console.developers.google.com

```
  var googleApi = {
    host:             'https://www.googleapis.com/customsearch/v1',
    key:              <google search api key>,
    searchEngineId:   <google search engine id>,
    imageSize:        'xxlarge',
    searchType:       'image',
    num:              '10'
  };
```

Note: The free account for Google Search API only allows you to do 100 api calls per day.

## Supported and Tested Browsers
- Google Chrome 53.0
- Safari 10.0
- Firefox 49.0
- IE 11.0

## Requirements
- Create a webpage to show a grid of photo thumbnails.
- When a thumbnail is clicked, show the image in a lightbox view.
- Have the ability to move next / previous in a lightbox view.
- Display the images title in the lightbox view.
- Access a public API and successfully retrieve image meta data from it.
- Display the images on a page without refreshing the page.
- Use only native JavaScript (no libraries such as jQuery).
