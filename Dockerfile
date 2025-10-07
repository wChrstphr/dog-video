# Usa a imagem oficial do Node.js versão 18 como base
FROM node:18

# Cria um usuário não-root chamado 'appuser' para rodar a aplicação com mais segurança
RUN useradd -m appuser

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências do backend e frontend, garantindo as permissões corretas
COPY --chown=appuser:appuser backend/package*.json ./backend/
COPY --chown=appuser:appuser frontend/package*.json ./frontend/

# Copia o restante dos arquivos do backend e frontend para o container, com as permissões corretas
COPY --chown=appuser:appuser backend ./backend
COPY --chown=appuser:appuser frontend ./frontend

# Troca para o usuário 'appuser' para executar os próximos comandos e a aplicação
USER appuser

# Instala as dependências do backend
RUN cd backend && npm install
# Instala as dependências do frontend
RUN cd frontend && npm install

# Expõe as portas 3000 (frontend) e 3001 (backend) para acesso externo
EXPOSE 3000
EXPOSE 3001

# Comando padrão: inicia backend e frontend em paralelo usando concurrently
CMD ["npx", "concurrently", "npm --prefix backend start", "npm --prefix frontend start"]
