#############################################################
# DOCKERFILE FOR AUTHENTICATION SERVICE
#############################################################
# DEPENDENCIES
# * NodeJS (provided)
#############################################################
# BUILD FLOW
# 3. Copy the service to the docker at /var/service
# 4. Run the default installatoin
# 5. Add the docker-startup.sh file which knows how to start
#    the service
#############################################################

FROM docker-registry.eyeosbcn.com/eyeos-fedora21-node-base

ENV WHATAMI authentication

WORKDIR ${InstallationDir}

RUN mkdir -p ${InstallationDir}/src/ && touch ${InstallationDir}/src/authentication-installed.js

CMD eyeos-run-server --serf ${InstallationDir}/src/eyeos-authentication.js ${InstallationDir}/authentication_v2/src/eyeos-authentication_v2.js

COPY . ${InstallationDir}

RUN npm install -g eyeos-run-server && \
    npm install --verbose && \
    npm cache clean
