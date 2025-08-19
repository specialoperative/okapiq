# Enhanced Okapiq Platform - Production Docker Image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    git \
    redis-server \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements_enhanced.txt .
RUN pip install --no-cache-dir -r requirements_enhanced.txt

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p models logs data config

# Set environment variables
ENV PYTHONPATH=/app
ENV OKAPIQ_ENV=production
ENV FLASK_APP=enhanced_api_server.py

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/api/health || exit 1

# Start command
CMD ["python", "enhanced_api_server.py"]
