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
const select = document.getElementById("storedQueries");
const botaoRetroceder = document.getElementById("botao-retroceder");
const botaoAvancar = document.getElementById("botao-avancar");

var dadosClimaPesquisaAtual;
var dia = 0;

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
  botaoRetroceder.style.display = "none";
  botaoAvancar.style.display = "none";
});

select.addEventListener("change", function (event) {
  var selectedCityId = event.target.value;
  carregaDados(selectedCityId);
  botaoAvancar.style.display = "block";
});

function atualizarVisibilidadeBotoes() {
  if (dia > 0) {
    botaoRetroceder.style.display = "block";
  } else {
    botaoRetroceder.style.display = "none";
  }

  if (dia < 3) {
    botaoAvancar.style.display = "block";
  } else {
    botaoAvancar.style.display = "none";
  }
}

// Adiciona um ouvinte de evento para o botão de retroceder
botaoRetroceder.addEventListener("click", function () {
  dia--;
  atualizaCard(dadosClimaPesquisaAtual, dia);
  atualizarVisibilidadeBotoes();
});

// Adiciona um ouvinte de evento para o botão de avançar
botaoAvancar.addEventListener("click", function () {
  dia++;
  atualizaCard(dadosClimaPesquisaAtual,dia);
  atualizarVisibilidadeBotoes();
});

const atualizaCard = (data, dia) => {
  cidade_nome.textContent =  data.city_name;
  date.textContent = data.forecast[dia].date;
  temperatura.textContent = "Temperatura:" + data.temp + "°C";
  temperatura_max.textContent = "Temperatura Máx.:" + data.forecast[dia].max + "°C";
  temperatura_min.textContent = "Temperatura Min.:" + data.forecast[dia].min + "°C";
  probabilidade_chuva.textContent ="Probabilidade de Chuva:" + data.forecast[dia].rain_probability + "%";
  clima_atual.innerHTML = `<img src="assets/conditions_slugs/${data.forecast[dia].condition}.svg" alt="Imagem Clima" width="50" height="50">`;
  fase_lua.innerHTML = `<img src="assets/moon_phases/${data.moon_phase}.png" alt="Imagem Lua" width="50" height="50">`;
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
    dadosClimaPesquisaAtual = dataClima;
    console.log("dadosClimaPesquisaAtual", dadosClimaPesquisaAtual);
    atualizaMapa(dadosCombinados);
    atualizaCard(dadosCombinados, 0);
    armazenaConsulta(dadosCombinados);
  } catch (error) {
    console.log(error);
  }
};

const armazenaConsulta = (dados) => {
  let storedData = JSON.parse(localStorage.getItem("storedQueries"));

  storedData.push(dados);

  let updatedData = JSON.stringify(storedData);

  localStorage.setItem("storedQueries", updatedData);
  atualizaSelect();
};

const atualizaSelect = () => {
  let storedData = JSON.parse(localStorage.getItem("storedQueries"));
  select.innerHTML = "";

  storedData.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.city_name;
    select.appendChild(option);
  });
};

const carregaDados = (id) => {
  let storedData = JSON.parse(localStorage.getItem("storedQueries"));
  let selectedCity = storedData.find((obj) => obj.id === id);
  dadosClimaPesquisaAtual = selectedCity;
  dia = 0
  console.log("dadosClimaPesquisaAtual LocalStorage", dadosClimaPesquisaAtual);
  atualizaMapa(selectedCity);
  atualizaCard(selectedCity, 0);
};
