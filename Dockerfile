FROM node:lts-alpine3.15

ARG PORT
ARG SECRET

ENV PORT ${PORT}
ENV SECRET ${SECRET?secretnotset}

WORKDIR /usr/src/app

COPY package.json ./

COPY yarn.lock ./

RUN yarn install

# Build for production
#RUN yarn install --frozen-lockfile

#Bundle app source
 COPY . .

 EXPOSE ${PORT}

 CMD ["yarn", "start"]