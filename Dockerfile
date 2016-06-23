FROM docker-registry.eyeosbcn.com/alpine6-node-base

ENV WHATAMI authentication

ENV InstallationDir /var/service/

WORKDIR ${InstallationDir}

CMD ["./start.sh"]

COPY . ${InstallationDir}

RUN /scripts-base/buildDependencies.sh --production --install && \
    npm install --verbose --production && \
    npm cache clean && \
    /scripts-base/buildDependencies.sh --production --purgue && \
    rm -fr /etc/ssl /var/cache/apk/* /tmp/*
