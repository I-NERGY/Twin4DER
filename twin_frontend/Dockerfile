# building stage
FROM node:16-alpine as builder

# create app folder and give user 'node' permissions
RUN mkdir /app && chown node:node /app

# set working directory
WORKDIR '/app'

# copy package.json to docker image from current directory
COPY --chown=node:node package.json .

# install build dependencies
RUN npm install

# copy project files
COPY --chown=node:node . .

# build project, will create build folder
RUN npm run build

# copy build results into second-stage container
# nginx starts up contents from /usr/share/nginx/html by default
FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html