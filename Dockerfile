FROM alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

ADD ./docker-start.sh /
CMD /docker-start.sh
