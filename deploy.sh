#!/usr/bin/env bash
set -e

# Deploy via SSH to remote server and run the same steps as restart.sh (lines 4-8)
# Host and user can be overridden with env vars: SSH_HOST, SSH_USER

SSH_HOST="75.101.230.185"
SSH_USER="dog"

ssh "${SSH_USER}@${SSH_HOST}" 'cd /data/www/chatgpt-app-quiz-generator && git pull origin main && docker-compose down && docker-compose up -d --build'