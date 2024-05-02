import { Environment } from "./Enviroments";

const getWeatherByName = async (city) => {
  try {
    const response = await fetch(
      Environment.URL_CORS + Environment.URL_HG_WEATHER + city
    );
    if (!response.ok) {
      throw new Error("Erro ao obter os dados da API");
    }

    // Converte a resposta para JSON e retorna os dados
    return await response.json();
  } catch (error) {
    // Captura e trata os erros que ocorrem durante a solicitação
    console.error("Erro:", error);
    // Retorna null em caso de erro
    return null;
  }
};

const getLongLatByName = async (city) => {
  try {
    const response = await fetch(
      Environment.URL_GEO + city
    );
    if (!response.ok) {
      throw new Error("Erro ao obter os dados da API");
    }

    // Converte a resposta para JSON e retorna os dados
    return await response.json();
  } catch (error) {
    // Captura e trata os erros que ocorrem durante a solicitação
    console.error("Erro:", error);
    // Retorna null em caso de erro
    return null;
  }
}

export const Service = {
  getWeatherByName,
  getLongLatByName,
};
