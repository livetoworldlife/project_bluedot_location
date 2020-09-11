// 53-renderin google map
import React, { useRef, useEffect } from 'react';
import bluedot from './bluedot2.png';
import './Map.css';

const Map = props => {
  // that can be used to create so called references which can be one of two things
  // to get reference \, a ponter at a real DOM node
  //to create variables which survive re-render cycles of our components
  const mapRef = useRef();

  const { center, zoom } = props;

  useEffect(() => {
    // //constructur function
    // const map = new window.google.maps.Map(mapRef.current, {
    //   center: center,
    //   zoom: zoom
    // });
    // // marker point
    // new window.google.maps.Marker({ position: center, map: map });


    const map = new window.ol.Map({
      target: mapRef.current.id,
      layers: [
        new window.ol.layer.Tile({
          source: new window.ol.source.OSM()
        })
      ],
      view: new window.ol.View({
        center: window.ol.proj.fromLonLat([center.lng, center.lat]),
        zoom: zoom
      })
    });
    //marker change that with blue dot
    // const layer = new window.ol.layer.Vector({
    //   source: new window.ol.source.Vector({
    //     features: [
    //       new window.ol.Feature({
    //         geometry: new window.ol.geom.Point(window.ol.proj.fromLonLat([center.lng, center.lat]))
    //       })
    //     ]
    //   })
    // });
    const layer = new window.ol.layer.Image({
      source: new window.ol.source.ImageStatic({
        url: bluedot,
        imageExtent: window.ol.proj.transformExtent([center.lng, center.lat, center.lng + 0.0005, center.lat + 0.0005], 'EPSG:4326', 'EPSG:3857')
      })
    });

    // // set color of marker
    // layer.setStyle(new window.ol.style.Style({
    //   image: new window.ol.style.Icon(({
    //     // color: '#ffcd46',
    //     width: '10',
    //     // crossOrigin: 'anonymous',
    //     src: bluedot
    //   }))
    // }));
    map.addLayer(layer);


  }, [center, zoom]);

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
      id='map'
    ></div>
  );
};

export default Map;