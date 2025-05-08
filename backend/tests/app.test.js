const request = require('supertest');
const { app, connection } = require('../app'); // Ajuste o caminho conforme necessário

describe('Database Connection', () => {
  it('should connect to the database', (done) => {
    connection.connect((err) => {
      expect(err).toBeNull();
      done();
    });
  });
});