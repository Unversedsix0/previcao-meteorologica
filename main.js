import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import { useGeographic } from "ol/proj.js";
import OSM from 'ol/source/OSM';
useGeographic();

const map = new Map({
  target: "map",
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  view: new View({
    center: [-45.8866816, -23.1860383],
    zoom: 12,
  }),
});
