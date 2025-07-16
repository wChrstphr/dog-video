module.exports = {
    testEnvironment: 'node', // Define o ambiente de teste como Node.js
    testMatch: ['**/tests/**/*.test.js'], // Padrão para encontrar arquivos de teste
    collectCoverage: true, // Habilita a cobertura de código
    coverageDirectory: 'coverage', // Pasta onde os relatórios de cobertura serão salvos
  };