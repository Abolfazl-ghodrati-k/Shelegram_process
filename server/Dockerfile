# FROM alpine:3.16
# RUN nvm install node:18.14.0
FROM node:18.14.0
 
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
