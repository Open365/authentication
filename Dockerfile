FROM docker-registry.eyeosbcn.com/alpine6-node-base

ENV WHATAMI authentication

ENV InstallationDir /var/service/

WORKDIR ${InstallationDir}

CMD eyeos-run-server --serf ${InstallationDir}/src/eyeos-authentication.js ${InstallationDir}/authentication_v2/src/eyeos-authentication_v2.js

COPY . ${InstallationDir}

RUN apk update && \
    /scripts-base/buildDependencies.sh --production --install && \
    npm install --verbose --production && \
    npm cache clean && \
    /scripts-base/buildDependencies.sh --production --purgue && \
    rm -fr /etc/ssl /var/cache/apk/* /tmp/*
