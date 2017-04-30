FROM node:7.9.0

# Copy files to app directory

RUN mkdir /app
COPY . /app
WORKDIR /app

# Install dependencies

RUN npm install 

EXPOSE 12345

ENTRYPOINT [ "npm", "start" ]