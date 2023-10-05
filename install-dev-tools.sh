#!/bin/bash 

# SPDX-FileCopyrightText: 2023, Institute for Automation of Complex Power Systems, EONERC, RWTH Aachen University
# SPDX-License-Identifier: MPL-2.0

apt-get update && \
	apt-get -y install \
		apt-transport-https ca-certificates \
		gnupg software-properties-common wget && \
	rm -rf /var/lib/apt/lists/*

wget -O - https://apt.kitware.com/keys/kitware-archive-latest.asc 2>/dev/null | sudo apt-key add - && \
	apt-add-repository 'deb https://apt.kitware.com/ubuntu/ bionic main'

# Install required libssl1.1
echo "deb http://security.ubuntu.com/ubuntu focal-security main" | sudo tee /etc/apt/sources.list.d/focal-security.list

# Toolchain
apt-get update && \
	apt-get -y install \
        libssl1.1 \
		g++ git make cmake \
		libeigen3-dev \
		libgraphviz-dev \
		libgsl-dev \
		pybind11-dev \
		libxml2-dev && \
	rm -rf /var/lib/apt/lists/*

# Build & Install fmtlib
cd /tmp && \
	git clone --recursive https://github.com/fmtlib/fmt.git && \
	mkdir -p fmt/build && cd fmt/build && \
	git checkout 6.1.2  && \
	cmake -DBUILD_SHARED_LIBS=ON .. && \
	make -j$(nproc) install

# Build & Install spdlog
cd /tmp && \
	git clone --recursive https://github.com/gabime/spdlog.git && \
	mkdir -p spdlog/build && cd spdlog/build && \
	git checkout v1.5.0 && \
	cmake -DSPDLOG_BUILD_SHARED=ON -DSPDLOG_BUILD_TESTS=OFF -DSPDLOG_BUILD_EXAMPLE=OFF .. && \
	make -j$(nproc) install

# Install Sundials
git clone https://github.com/LLNL/sundials.git && \
	git -C sundials checkout v3.1.1 && \
	mkdir build_sundials && \
	cd build_sundials && \
	cmake ../sundials \
		-DBUILD_SHARED_LIBS=ON \
		-DBUILD_STATIC_LIBS=OFF \
		-DEXAMPLES_ENABLE_C=OFF && \
	make -j$(nproc) install && \
	cd .. && \
	rm -rf build_sundials sundials

# Install CIM++
git clone --recursive https://github.com/cim-iec/libcimpp.git && \
	mkdir build_libcimpp && \
	cd build_libcimpp && \
	cmake ../libcimpp \
		-DUSE_CIM_VERSION=CGMES_2.4.15_16FEB2016 \
		-DBUILD_SHARED_LIBS=ON \
		-DCMAKE_POSITION_INDEPENDENT_CODE=ON && \
	make -j$(nproc) install && \
	cd .. && \
	rm -rf build_libcimpp libcimpp

echo /usr/local/lib/ > /etc/ld.so.conf.d/local.conf && \
	echo /opt/conda/lib/ >> /etc/ld.so.conf.d/local.conf

ldconfig