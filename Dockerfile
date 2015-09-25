FROM node:latest

EXPOSE 8888
COPY . /src

WORKDIR /src

RUN npm install


ENTRYPOINT ["npm"]

CMD ["start"]
