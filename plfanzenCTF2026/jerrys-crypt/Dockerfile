FROM ubuntu:noble-20251001@sha256:66460d557b25769b102175144d538d88219c077c678a49af4afca6fbfc1b5252

RUN apt update -y && \
    apt install socat -y && \
    useradd --create-home jerry

WORKDIR /home/jerry
# libraries are default from this image, only provided to make local exploitation easier
COPY ld-linux-x86-64.so.2 libc.so.6 jerry jerry-wrapper.sh entrypoint.sh .

EXPOSE 1024
USER jerry
CMD ["./entrypoint.sh"]

