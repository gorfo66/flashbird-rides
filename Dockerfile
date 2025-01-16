FROM node:22
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install
RUN npm run build
RUN npm install -g @angular/cli
CMD ["ng", "serve", "--host", "0.0.0.0"]

