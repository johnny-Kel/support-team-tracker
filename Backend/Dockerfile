# Use PHP 8.2
FROM php:8.2-cli

# 1. Install system dependencies and PHP extensions
# We need 'libpq-dev' and 'pdo_pgsql' because Render uses PostgreSQL
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql

# 2. Install Composer (The PHP package manager)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 3. Set working directory inside the container
WORKDIR /app

# 4. Copy all your backend files into the container
COPY . .

# 5. Install Laravel dependencies
RUN composer install --no-dev --optimize-autoloader

# 6. Default command to run the server
# Render provides a $PORT variable automatically
CMD php artisan serve --host=0.0.0.0 --port=$PORT