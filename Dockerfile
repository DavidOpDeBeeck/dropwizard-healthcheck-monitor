FROM node:7.9.0

# Python

RUN apt-get update && \
    apt-get install -y python2.7-dev

# Copy files to app directory

RUN mkdir /app
COPY . /app
WORKDIR /app

# Install dependencies and build app

RUN npm install && \ 
    npm install -g @angular/cli && \ 
    ng build --prod -aot

EXPOSE 8000

WORKDIR dist

ENTRYPOINT [ "python", "-m", "SimpleHTTPServer" ]