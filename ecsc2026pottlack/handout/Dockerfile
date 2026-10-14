FROM debian@sha256:913f6706df59a68922d1dd08f78c2476560a8d367897200a6005b00e5f67c2d5

RUN set -x && \
  apt-get update -y && \
  apt-get install clang build-essential socat make -y && \
  mkdir /hive && chmod 666 /hive

COPY Makefile vuln.cc plf_hive.h /hive
COPY --chmod=666 flag /flag

WORKDIR /hive
RUN make && \
  rm Makefile vuln.cc

EXPOSE 1024
ENTRYPOINT [ "socat", "tcp-l:1024,reuseaddr,fork", "EXEC:'/hive/vuln'"]
