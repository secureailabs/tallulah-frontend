#  Production stage
FROM nginx:alpine

# Remove the default Nginx configuration file
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copy the custom Nginx configuration file to the container
COPY docker/nginx.conf /etc/nginx/conf.d/

# Copy the production build files to the Nginx document root directory
COPY ./build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]