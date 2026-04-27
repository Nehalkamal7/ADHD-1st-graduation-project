FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    git \
    wget \
    unzip \
    libopenblas-dev \
    liblapack-dev \
    libx11-dev \
    libjpeg-dev \
    libpng-dev \
    libtiff-dev \
    libavcodec-dev \
    libavformat-dev \
    libswscale-dev \
    libv4l-dev \
    libatlas-base-dev \
    gfortran \
    && rm -rf /var/lib/apt/lists/*

# Install specific version of CMake
RUN wget https://github.com/Kitware/CMake/releases/download/v3.22.1/cmake-3.22.1-linux-x86_64.sh \
    && chmod +x cmake-3.22.1-linux-x86_64.sh \
    && ./cmake-3.22.1-linux-x86_64.sh --skip-license --prefix=/usr/local \
    && rm cmake-3.22.1-linux-x86_64.sh

# Install Python dependencies one by one
# Base packages first
RUN pip install --no-cache-dir numpy==1.26.2
RUN pip install --no-cache-dir pandas==2.1.3

# Computer Vision packages
RUN pip install --no-cache-dir opencv-python==4.8.1.78

# Install dlib with specific environment variables and CMake policy
ENV CFLAGS="-I/usr/include"
ENV LDFLAGS="-L/usr/lib"
ENV CMAKE_ARGS="-DCMAKE_POLICY_VERSION_MINIMUM=3.5"
RUN pip install --no-cache-dir dlib==19.22.0

# Machine Learning packages
RUN pip install --no-cache-dir scikit-learn==1.3.2
RUN pip install --no-cache-dir tensorflow==2.18.0

# FastAPI and related packages
RUN pip install --no-cache-dir fastapi==0.109.2
RUN pip install --no-cache-dir uvicorn[standard]==0.27.1
RUN pip install --no-cache-dir python-multipart==0.0.7
RUN pip install --no-cache-dir gunicorn==20.1.0
RUN pip install --no-cache-dir pydantic==2.5.2

# Utility packages
RUN pip install --no-cache-dir python-dotenv==1.0.0

# Verify versions
RUN python -c "import numpy; import cv2; import tensorflow as tf; print(f'NumPy version: {numpy.__version__}, OpenCV version: {cv2.__version__}, TensorFlow version: {tf.__version__}')"

# Copy the rest of the application
COPY . .

# Create necessary directories
RUN mkdir -p uploads models data/features

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"] 