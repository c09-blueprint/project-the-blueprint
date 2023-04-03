FROM node:16 as build

WORKDIR /frontend

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Serve these static files with NGINX.
FROM nginx:1.21.6-alpine

COPY --from=build /frontend/build /usr/share/nginx/html

COPY --from=build /frontend/nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]