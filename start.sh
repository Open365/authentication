#!/bin/sh

exec eyeos-run-server \
	--serf \
	"${InstallationDir}/src/eyeos-authentication.js" \
	"${InstallationDir}/authentication_v2/src/eyeos-authentication_v2.js"
