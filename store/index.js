import { Service } from "../service/service";
import View from "ol/View.js";

const cidade = document.querySelector("#cidade");
document
  .getElementById("consulta")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    consultarClima();
    consultarLocalizacao();

    console.log(cidade.value);
  });


const consultarClima = () => {
  Service.getWeatherByName(cidade.value).then((data) => {
      let jsonString = JSON.stringify(data);

      localStorage.setItem("Clima", jsonString);
 
  });
};

const consultarLocalizacao = () => {
  Service.getLongLatByName(cidade.value).then((data) => {
       let jsonString = JSON.stringify(data);

       localStorage.setItem("cachedLocalJson", jsonString);
  
  });
};
