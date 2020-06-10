FROM nginx:stable
COPY ./dist/ /var/www
COPY ./certificates/ /var/certificates
COPY ./nginx.conf /etc/nginx/conf.d/default.conf