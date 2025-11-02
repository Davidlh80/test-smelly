/* eslint-disable no-undef */
const { UserService } = require('../src/userService');

describe('UserService – Testes limpos (AAA, sem smells)', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    userService._clearDB();
  });

  function criarUsuarioValido(overrides = {}) {
    const nome = overrides.nome || 'Fulano de Tal';
    const email = overrides.email || 'fulano@teste.com';
    const idade = overrides.idade ?? 25;
    const isAdmin = overrides.isAdmin || false;
    return userService.createUser(nome, email, idade, isAdmin);
  }

  test('cria usuário válido e recupera por ID', () => {
    const nome = 'Alice';
    const email = 'alice@email.com';
    const idade = 28;
    const created = userService.createUser(nome, email, idade);
    const fetched = userService.getUserById(created.id);

    expect(created.id).toBeDefined();
    expect(fetched).toBeDefined();
    expect(fetched.nome).toBe(nome);
    expect(fetched.status).toBe('ativo');
  });

  test('lança erro quando campos obrigatórios estão ausentes', () => {
    const nome = undefined, email = 'x@x.com', idade = 20;

    expect(() => userService.createUser(nome, email, idade))
      .toThrow('Nome, email e idade são obrigatórios.');
  });

  test('lança erro quando idade < 18', () => {
    const nome = 'Menor', email = 'menor@email.com', idade = 17;

    expect(() => userService.createUser(nome, email, idade))
      .toThrow('O usuário deve ser maior de idade.');
  });

  test('desativa usuário comum com sucesso', () => {
    const comum = criarUsuarioValido({ nome: 'Comum', email: 'comum@t.com', idade: 30 });
    const result = userService.deactivateUser(comum.id);
    const atualizado = userService.getUserById(comum.id);

    expect(result).toBe(true);
    expect(atualizado.status).toBe('inativo');
  });

  test('não desativa administrador', () => {
    const admin = criarUsuarioValido({ nome: 'Admin', email: 'admin@t.com', idade: 40, isAdmin: true });
    const result = userService.deactivateUser(admin.id);
    const atualizado = userService.getUserById(admin.id);

    expect(result).toBe(false);
    expect(atualizado.status).toBe('ativo');
  });

  test('relatório vazio quando não há usuários', () => {
    const report = userService.generateUserReport();

    expect(report.startsWith('--- Relatório de Usuários ---')).toBe(true);
    expect(report).toContain('Nenhum usuário cadastrado.');
  });

  test('relatório contém usuários cadastrados (sem depender de formatação exata de linhas)', () => {
    const u1 = criarUsuarioValido({ nome: 'Alice', email: 'alice@email.com', idade: 28 });
    const u2 = criarUsuarioValido({ nome: 'Bob', email: 'bob@email.com', idade: 32 });
    const report = userService.generateUserReport();

    expect(report.startsWith('--- Relatório de Usuários ---')).toBe(true);
    expect(report).toContain(u1.id);
    expect(report).toContain('Nome: Alice');
    expect(report).toContain('Status: ativo');
    expect(report).toContain(u2.id);
    expect(report).toContain('Nome: Bob');
  });
});
