# Specify parent image. Please select a fixed tag here.
ARG BASE_IMAGE=jupyter/minimal-notebook
FROM ${BASE_IMAGE}

# Install packages via requirements.txt
ADD requirements.txt .
RUN pip install -r requirements.txt
