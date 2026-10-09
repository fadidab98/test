FROM scratch
# Intentionally wrong source filename: build creates dist/index.html.
COPY dist/order-dashboard.html /index.html
