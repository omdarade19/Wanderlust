
// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.comnp
mapboxgl.accessToken = mapToken;
  const map = new mapboxgl.Map({
      container: 'map', // container ID
      center: [73.856255, 18.516726], // starting position [lng, lat]. Note that lat must be set between -90 and 90
      zoom: 9 // starting zoom
  });



  const marker = new mapboxgl.Marker({color: "red"})
   .setLngLat(coordinates)
   .setPopup(new mapboxgl.Popup({offset:25})
   .setHTML("<p>Exact Location Shown after booking</p>"))
   .addTo(map);