# SPDX-FileCopyrightText: 2023, Institute for Automation of Complex Power Systems, EONERC, RWTH Aachen University
# SPDX-License-Identifier: MPL-2.0

# Specify parent image. Please select a fixed tag here.
ARG BASE_IMAGE=jupyter/minimal-notebook:python-3.10
FROM ${BASE_IMAGE}

# Install toolchain to build dpsim
USER root
ADD install-dev-tools.sh .
RUN ./install-dev-tools.sh

# Install packages via requirements.txt
USER ${NB_USER}
WORKDIR /home/${NB_USER}
ADD requirements.txt .
RUN pip install -r requirements.txt