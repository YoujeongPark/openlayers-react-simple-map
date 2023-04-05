import { useEffect, useRef } from 'react';
import { Map, View } from 'ol';
import 'ol/ol.css';
import { fromLonLat, get as getProjection } from 'ol/proj';
import { XYZ } from "ol/source";
import { Tile as TileLayer } from "ol/layer";
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Icon, Style, Circle as CircleStyle, Fill, Stroke } from "ol/style";
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import "./Map.css";


const MapComponent = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const mapObj = new Map({
      view: new View({
        center: fromLonLat([126.972656, 37.5516258]),
        zoom: 16,
      }),
      layers: [
        new TileLayer({
          source: new XYZ({ url: "https://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}",
          crossOrigin: 'anonymous'
         }),
        }),
      ],
      target: mapRef.current
    });

    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });


    const newMarkers = [
      { lon: 126.972656, lat: 37.5516258, name: 'Starbucks Dongja' }
    ];

    const markerStyle = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: 'https://openlayers.org/en/latest/examples/data/icon.png',
      }),
    });

    const newFeatures = newMarkers.map((marker) => {
      const point = new Point(fromLonLat([marker.lon, marker.lat]));
      const feature = new Feature({
        geometry: point,
        name: marker.name,
      });
      feature.setStyle(markerStyle);
      return feature;
    });


    mapObj.on('click', (evt) => {
      const feature = mapObj.forEachFeatureAtPixel(evt.pixel,
        (feature) => {
          return feature;
        });

      if (feature) {
        alert(feature.get('name'));
      }
    });
    mapObj.addLayer(vectorLayer);

    vectorSource.addFeatures(newFeatures);

    //mapObj.addLayer(vectorLayer);
    mapObj.setTarget(mapRef.current);

    return () => mapObj.setTarget('');
  }, []);

  return <div className ="map" ref={mapRef} />;
};

export default MapComponent;