FROM ghcr.io/hydra-db/hydradb@sha256:db78309a233be54662db29744047e985a39b51c45a270d1a1f47c31a62cdb709

USER root
RUN mkdir -p /data/store /data/cache
COPY entrypoint.sh /usr/local/bin/klazz-hydradb-entrypoint
RUN chmod 755 /usr/local/bin/klazz-hydradb-entrypoint

# Railway attaches the persistent volume after image build, so its mountpoint is
# owned by root. HydraDB must be able to initialize that mount on first boot.
# The public surface remains protected by the bearer token below.
USER root

ENV CLOUD_PROVIDER=local \
    LOCAL_PATH=/data/store \
    GRAPH_NAMESPACE=default \
    GRAPH_ID=default \
    GRAPH_CELL_ID=cell-0 \
    GRAPH_CELLS=cell-0 \
    GRAPH_NODE_ID=node-0 \
    GRAPH_BOLT_NODE_ADDRESSES=node-0=127.0.0.1:7687 \
    GRAPH_ADVERTISED_BOLT_ADDR=127.0.0.1:7687 \
    GRAPH_DATA_CACHE_DIR=/data/cache \
    GRAPH_AUTH_TOKEN_FILE=/data/auth-token \
    GRAPH_ALLOW_PLAINTEXT=true \
    RUST_MIN_STACK=33554432

EXPOSE 8443 7687 9090
ENTRYPOINT ["/usr/local/bin/klazz-hydradb-entrypoint"]
