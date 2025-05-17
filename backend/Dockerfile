FROM php:8.2-fpm

# Cài đặt dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Cài đặt Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy code Laravel
WORKDIR /var/www
COPY . .

# Cài đặt dependencies
RUN composer install

#Cấp quyền cho thư mục storage và bootstrap/cache
# RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Cấp quyền
RUN chown -R www-data:www-data /var/www/storage

EXPOSE 9000
CMD ["apache2-foreground"]