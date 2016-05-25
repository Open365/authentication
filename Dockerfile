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
    apk del openssl ca-certificates libssh2 curl binutils-libs binutils gmp isl \
    libgomp libatomic pkgconf pkgconfig mpfr3 mpc1 gcc musl-dev libc-dev g++ expat \
    pkgconf pkgconfig zlib-dev libpng-dev freetype-dev expat expat-dev fontconfig-dev \
    renderproto xproto libxau-dev xcb-proto libpthread-stubs libxdmcp-dev libxcb-dev \
    xextproto xf86bigfontproto-dev xtrans inputproto kbproto libx11-dev libxrender-dev \
    pixman-dev xcb-util xcb-util-dev perl libbz2 libffi gdbm sqlite-libs python ncurses-dev \
    libxml2 libxml2-dev libgomp libintl gettext gettext-dev bzip2-dev libffi-dev glib glib-dev \
    libxext-dev cairo-gobject cairo-dev pcre git make libbz2 libffi gdbm ncurses-terminfo-base \
    ncurses-terminfo ncurses-libs readline sqlite-libs python krb5-dev giflib-dev cairo-dev jpeg-dev && \
    rm -fr /etc/ssl /var/cache/apk/* /tmp/*
