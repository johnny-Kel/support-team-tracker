# Use PHP 8.2
FROM php:8.2-cli

# 1. Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql

# 2. Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 3. Set working directory
WORKDIR /app

# 4. Copy all files
COPY . .

# 5. Install Dependencies
RUN composer install --no-dev --optimize-autoloader

# --- THE FIX: PERMISSIONS ---
# Allow the server to write to storage and cache folders
RUN chown -R www-data:www-data /app/storage /app/bootstrap/cache
RUN chmod -R 775 /app/storage /app/bootstrap/cache

# 6. Run the server
CMD php artisan serve --host=0.0.0.0 --port=$PORT