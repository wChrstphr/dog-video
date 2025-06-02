FROM node:18

WORKDIR /app

# Copiar arquivos de dependências do backend
COPY backend/package*.json ./backend/
# Copiar arquivos de dependências do frontend
COPY frontend/package*.json ./frontend/

# Instalar dependências do backend
RUN cd backend && npm install

# Instalar dependências do frontend
RUN cd frontend && npm install

# Copiar o restante do código (backend e frontend)
COPY backend ./backend
COPY backend/.env ./backend/
COPY frontend ./frontend

# Expõe as portas
EXPOSE 3000
EXPOSE 3001

# Usar usuário não-root para maior segurança
RUN useradd -m appuser && chown -R appuser /app
USER appuser

# Rodar ambos os serviços com npx 
CMD ["npx", "concurrently", "npm --prefix backend start", "npm --prefix frontend start"]
