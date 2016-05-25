FROM docker-registry.eyeosbcn.com/alpine6-node-base

ENV WHATAMI authentication

ENV InstallationDir /var/service/

WORKDIR ${InstallationDir}

CMD eyeos-run-server --serf ${InstallationDir}/src/eyeos-authentication.js ${InstallationDir}/authentication_v2/src/eyeos-authentication_v2.js

COPY . ${InstallationDir}

RUN apk update && apk add --no-cache curl make gcc g++ git python cairo pango \
    libjpeg jpeg-dev giflib giflib-dev ttf-liberation krb5-dev cairo-dev && \
    npm install --verbose --production && \
    npm cache clean && \
    apk del curl make gcc g++ git python jpeg-dev giflib-dev krb5-dev cairo-dev && \
    rm -fr /etc/ssl /var/cache/apk/* /tmp/*
