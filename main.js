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
document
  .getElementById("consulta")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    realizaConsultas();
  });

//Inicia o mapa
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

document.addEventListener("DOMContentLoaded", function () {
  atualizaSelect();
});

const atualizaCard = (data) => {
  cidade_nome.textContent = "Cidade:" + data.city_name;
  date.textContent = data.date;
  temperatura.textContent = "Temperatura:" + data.temp;
  temperatura_max.textContent = "Temperatura Máx.:" + data.forecast[0].max;
  temperatura_min.textContent = "Temperatura Min.:" + data.forecast[0].min;
  clima_atual.textContent = data.description;
  probabilidade_chuva.textContent =
    "Probabilidade de Chuva:" + data.forecast[0].rain_probability + "%";
  fase_lua.textContent = data.moon_phase;
};

const atualizaMapa = (data) => {
  var novaLocalizacao = fromLonLat([data.lon, data.lat]);
  var visaoAtual = map.getView();
  visaoAtual.setCenter(novaLocalizacao);
  visaoAtual.setZoom(13);
  map.setView(visaoAtual);
};

const consultarLocalizacao = async () => {
  try {
    let data = await Service.getLongLatByName(cidade.value);
    let jsonLocalizacao = data;
    return jsonLocalizacao;
  } catch (error) {
    console.log(error);
  }
};

const consultarClima = async () => {
  try {
    let data = await Service.getWeatherByName(cidade.value);
    let jsonClima = data;
    return jsonClima;
  } catch (error) {
    console.log(error);
  }
};

const realizaConsultas = async () => {
  try {
    let dataClima = await consultarClima();
    let dataLocalizacao = await consultarLocalizacao();
    let dadosCombinados = dataClima;
    dadosCombinados.id = Date.now().toString();
    dadosCombinados.lat = dataLocalizacao[0].lat;
    dadosCombinados.lon = dataLocalizacao[0].lon;
    atualizaMapa(dadosCombinados);
    atualizaCard(dadosCombinados);
    armazenaConsulta(dadosCombinados);
  } catch (error) {
    console.log(error);
  }
};

const armazenaConsulta = (dados) => {
  let storedData = localStorage.getItem("storedQueries");
  let jsonArray;

  if (storedData) {
    jsonArray = JSON.parse(storedData);
  } else {
    jsonArray = [];
  }

  jsonArray.push(dados);

  let updatedData = JSON.stringify(jsonArray);

  localStorage.setItem("storedQueries", updatedData);
  atualizaSelect();
};

 const atualizaSelect = () =>{
  const select = document.getElementById("storedQueries");
  let storedData = localStorage.getItem("storedQueries");

 
  let jsonArray = storedData ? JSON.parse(storedData) : [];

 
  select.innerHTML = "";


  jsonArray.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.city_name;
    select.appendChild(option);
  });
};



