# Stage "build-stage"
FROM node:12.15.0 as build-stage
WORKDIR /app
COPY ./ /app/
RUN npm install
RUN npm run build

# Stage "Coy to Nginx"
FROM nginx:1.17
COPY --from=build-stag /app/dist /usr/share/nginx/html
