FROM docker-registry.eyeosbcn.com/eyeos-fedora21-node-base

ENV WHATAMI authentication

WORKDIR ${InstallationDir}

CMD eyeos-run-server --serf ${InstallationDir}/src/eyeos-authentication.js ${InstallationDir}/authentication_v2/src/eyeos-authentication_v2.js

COPY . ${InstallationDir}

RUN npm install -g eyeos-run-server && \
    npm install --verbose && \
    npm cache clean
