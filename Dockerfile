FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
RUN npm install express
RUN npm install mysql
RUN npm install node.js
RUN npm install require
RUN npm install stat
RUN npm install ejs
RUN npm install googleapis
RUN npm install google-auth-library

# Bundle app source
COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]