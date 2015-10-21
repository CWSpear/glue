FROM node:latest

EXPOSE 3000
COPY . /src

WORKDIR /src

RUN npm install

ENTRYPOINT ["npm"]

CMD ["start"]
