
  
	mapboxgl.accessToken = mapToken;


    const map = new mapboxgl.Map({
        container: 'map',
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [12.550343, 55.665957],
        zoom: 8
    });


    // console.log(coordinates);

    // const marker = new mapboxgl.Marker()
    //     .setLngLat(coordinates)
    //     .addTo(map);
