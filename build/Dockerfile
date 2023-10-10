FROM harbor.nancalcloud.com/tools/nginx:1.21
#download config
RUN rm -rf /usr/share/nginx/html/* && \
    mkdir  /usr/share/nginx/html/dist/ -p

COPY dist/ /usr/share/nginx/html/dist/

COPY build/nginx.conf /etc/nginx/nginx.conf


WORKDIR /usr/local/nginx
#espose
EXPOSE 80

