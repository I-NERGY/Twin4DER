#!/bin/bash 

# SPDX-FileCopyrightText: 2023, Institute for Automation of Complex Power Systems, EONERC, RWTH Aachen University
# SPDX-License-Identifier: MPL-2.0

python -m venv venv
pip install -r requirements-api.txt
flask --app twin_api.py run -p 31032 -h 0.0.0.0