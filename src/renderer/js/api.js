// src/renderer/js/api.js

/**
 * Expõe a API do preload (window.api) para uma variável global 'api'
 * para ser usada por outros scripts na mesma página.
 */
const api = window.api;

if (!api) {
  console.error(
    'Erro fatal: A API do preload (window.api) não foi encontrada. ' +
    'Verifique se o preload.js está sendo carregado corretamente no main.js.'
  );
  alert('Erro de inicialização. A aplicação não pode continuar.');
}