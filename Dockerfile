# Intentionally broken Dockerfile: the COPY instruction is misspelled.
# No remote base-image download is needed for this diagnostic scenario.
FROM scratch
WORKDIR /site
COPYY index.html /site/index.html
