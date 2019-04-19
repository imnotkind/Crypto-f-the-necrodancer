FROM node:latest
WORKDIR /app
EXPOSE 80



ADD . /app
RUN npm install express
RUN npm install nconf
RUN npm install -g forever
RUN npm install mustache
RUN npm install ws

CMD ["forever", "server.js"]