# Usa uma imagem base oficial do Node.js
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instala as dependências da aplicação
RUN npm install

# Copia o restante dos arquivos para o container
COPY . .

# Compila o código TypeScript
RUN npm run build

# Expõe a porta 80 para acessar a aplicação
EXPOSE 80

# Define a variável de ambiente para a porta
ENV PORT=80

# Executa a aplicação
CMD ["npm", "run", "start"]
