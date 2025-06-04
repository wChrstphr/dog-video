FROM node:18

# Cria usuário não-root antes de copiar arquivos
RUN useradd -m appuser

WORKDIR /app

# Copia arquivos de dependências do backend e frontend com permissão correta
COPY --chown=appuser:appuser backend/package*.json ./backend/
COPY --chown=appuser:appuser frontend/package*.json ./frontend/

# Copia o restante do código (backend e frontend) com permissão correta
COPY --chown=appuser:appuser backend ./backend
COPY --chown=appuser:appuser frontend ./frontend

USER appuser

# Instala dependências
RUN cd backend && npm install
RUN cd frontend && npm install



EXPOSE 3000
EXPOSE 3001

CMD ["npx", "concurrently", "npm --prefix backend start", "npm --prefix frontend start"]
