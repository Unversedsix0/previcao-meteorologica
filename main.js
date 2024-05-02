import "./style.css";
import { Map, View } from "ol";
import OSM from "ol/source/OSM";
import TileLayer from "ol/layer/Tile";
import { fromLonLat } from "ol/proj.js";

import { Service } from "./service/service";

const cidade = document.querySelector("#cidade");
const cidade_nome = document.querySelector("#cidade-nome");
const date = document.querySelector("#date");
const temperatura = document.querySelector("#temperatura");
const temperatura_max = document.querySelector("#temperatura-max");
const temperatura_min = document.querySelector("#temperatura-min");
const clima_atual = document.querySelector("#clima-atual");
const probabilidade_chuva = document.querySelector("#probabilidade-chuva");
const fase_lua = document.querySelector("#fase-lua");



const view = new View({
  center: [0, 0],
  zoom: 3,
});
const map = new Map({
  target: "map",
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  target: "map",
  view: view,
});

const consultarClima = () => {
  Service.getWeatherByName(cidade.value).then((data) => {
    cidade_nome.textContent = "Cidade:" + data.city_name;
    date.textContent = data.date;
    temperatura.textContent = "Temperatura:" + data.temp;
    temperatura_max.textContent = "Temperatura Máx.:" + data.forecast[0].max;
    temperatura_min.textContent = "Temperatura Min.:" + data.forecast[0].min;
    clima_atual.textContent = data.description;
    probabilidade_chuva.textContent =
      "Probabilidade de Chuva:" + data.forecast[0].rain_probability + "%";
    fase_lua.textContent = data.moon_phase;
  });
};

const consultarLocalizacao = () => {
  Service.getLongLatByName(cidade.value).then((data) => {
    console.log("consultarLocalização", data);
    var novaLocalizacao = fromLonLat([data[0].lon, data[0].lat]);
    var visaoAtual = map.getView();
    visaoAtual.setCenter(novaLocalizacao);
    visaoAtual.setZoom(13);
    map.setView(visaoAtual);
  });
};
