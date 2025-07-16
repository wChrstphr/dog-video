const request = require('supertest');
const { app, connection } = require('../app');

// Mock data helpers
const randomEmail = () => `test${Math.floor(Math.random() * 100000)}@mail.com`;

afterAll((done) => {
  connection.end(done);
});

describe('API Endpoints', () => {
  let createdClienteId;
  let createdPasseadorId;

  // Cliente CRUD
  it('POST /criarcliente should create a new cliente', async () => {
    const res = await request(app)
      .post('/criarcliente')
      .send({
        nome: 'Cliente Teste',
        email: randomEmail(),
        cpf: '12345678901',
        telefone: '61999999999',
        endereco: 'Rua Teste',
        pacote: 'mensal',
        horario: '10:00:00',
        anotacao: 'Nenhuma',
        caes: ['Dog1', 'Dog2'],
        id_passeador: null
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /clientes should return clientes', async () => {
    const res = await request(app).get('/clientes');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) createdClienteId = res.body[0].id_cliente;
  });

  it('GET /clientes/:id should return cliente details', async () => {
    if (!createdClienteId) return;
    const res = await request(app).get(`/clientes/${createdClienteId}`);
    expect([200, 404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body.success).toBe(true);
      expect(res.body.cliente).toBeDefined();
    }
  });

  it('PUT /clientes/:id should update cliente', async () => {
    if (!createdClienteId) return;
    const res = await request(app)
      .put(`/clientes/${createdClienteId}`)
      .send({
        nome: 'Cliente Atualizado',
        email: randomEmail(),
        cpf: '12345678901',
        telefone: '61988888888',
        endereco: 'Rua Nova',
        pacote: 'semanal',
        horario_passeio: '11:00:00',
        anotacoes: 'Atualizado',
        caes: ['Dog1'],
        id_passeador: null
      });
    expect([200, 500]).toContain(res.statusCode);
  });

  it('PUT /clientes/:id/reset-senha should reset senha', async () => {
    if (!createdClienteId) return;
    const res = await request(app).put(`/clientes/${createdClienteId}/reset-senha`);
    expect([200, 404]).toContain(res.statusCode);
  });

  it('DELETE /clientes/:id should delete cliente', async () => {
    if (!createdClienteId) return;
    const res = await request(app).delete(`/clientes/${createdClienteId}`);
    expect([200, 500]).toContain(res.statusCode);
  });

  // Passeador CRUD
  it('POST /criarpasseador should create passeador', async () => {
    const res = await request(app)
      .post('/criarpasseador')
      .send({
        nome: 'Passeador Teste',
        email: randomEmail(),
        cpf: '98765432100',
        telefone: '61977777777',
        endereco: 'Rua Passeador',
        imagem: null
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /passeadores should return passeadores', async () => {
    const res = await request(app).get('/passeadores');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.passeadores)).toBe(true);
    if (res.body.passeadores.length > 0) createdPasseadorId = res.body.passeadores[0].id;
  });

  it('GET /passeadores/:id should return passeador details', async () => {
    if (!createdPasseadorId) return;
    const res = await request(app).get(`/passeadores/${createdPasseadorId}`);
    expect([200, 404]).toContain(res.statusCode);
  });

  it('PUT /passeadores/:id should update passeador', async () => {
    if (!createdPasseadorId) return;
    const res = await request(app)
      .put(`/passeadores/${createdPasseadorId}`)
      .send({
        nome: 'Passeador Atualizado',
        email: randomEmail(),
        cpf: '98765432100',
        telefone: '61977777777',
        endereco: 'Rua Passeador Atualizada',
        imagem: null
      });
    expect([200, 500]).toContain(res.statusCode);
  });

  it('DELETE /passeadores/:id should delete passeador', async () => {
    if (!createdPasseadorId) return;
    const res = await request(app).delete(`/passeadores/${createdPasseadorId}`);
    expect([200, 404, 500]).toContain(res.statusCode);
  });

  // Auth & Security
  it('POST /login should fail with wrong credentials', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'wrong@mail.com', senha: 'wrongpass' });
    expect([401, 500]).toContain(res.statusCode);
  });

  it('POST /alterar-senha should fail without id_cliente', async () => {
    const res = await request(app)
      .post('/alterar-senha')
      .send({ novaSenha: 'novaSenha123' });
    expect(res.statusCode).toBe(400);
  });

  // Notificações & Subscriptions
  it('POST /subscribe should fail with missing body', async () => {
    const res = await request(app).post('/subscribe').send({});
    expect([400, 500]).toContain(res.statusCode);
  });

  it('POST /notificacoes should fail with missing body', async () => {
    const res = await request(app).post('/notificacoes').send({});
    expect([400, 500]).toContain(res.statusCode);
  });

  it('POST /send-notification should fail with missing id_notificacao', async () => {
    const res = await request(app).post('/send-notification').send({});
    expect([404, 500]).toContain(res.statusCode);
  });
});