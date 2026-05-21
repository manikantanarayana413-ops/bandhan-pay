#!/bin/bash
# ═══════════════════════════════════════════════════════════
#  BandhanPay — Auto GitHub Sync Script
#  Run this script every time Claude makes changes to push
#  them automatically to GitHub
#
#  Usage:  bash sync.sh "your commit message"
#  Example: bash sync.sh "Fixed phone validation"
# ═══════════════════════════════════════════════════════════

set -e

REPO_DIR="/tmp/bandhan-pay-push"
SOURCE_DIR="/mnt/user-data/outputs/bandhanpay"
GITHUB_USER="manikantanarayana413-ops"
REPO_NAME="bandhan-pay"

# ── Colors ───────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}  BandhanPay → GitHub Auto Sync${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"

# ── Step 1: Update token if provided ─────────────────────
if [ ! -z "$2" ]; then
  TOKEN="$2"
  git -C "$REPO_DIR" remote set-url origin \
    "https://${TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git"
  echo -e "${GREEN}✅ Token updated${NC}"
fi

# ── Step 2: Copy latest files from outputs ───────────────
echo -e "${YELLOW}📂 Copying latest files...${NC}"

cp "$SOURCE_DIR/BandhanPay.jsx"   "$REPO_DIR/BandhanPay.jsx"
cp "$SOURCE_DIR/Code.gs"          "$REPO_DIR/Code.gs"
cp "$SOURCE_DIR/package.json"     "$REPO_DIR/package.json"
cp "$SOURCE_DIR/index.html"       "$REPO_DIR/index.html"
cp "$SOURCE_DIR/vite.config.js"   "$REPO_DIR/vite.config.js"
cp "$SOURCE_DIR/render.yaml"      "$REPO_DIR/render.yaml"
cp "$SOURCE_DIR/netlify.toml"     "$REPO_DIR/netlify.toml"
cp "$SOURCE_DIR/vercel.json"      "$REPO_DIR/vercel.json"
cp "$SOURCE_DIR/SETUP_GUIDE.md"   "$REPO_DIR/SETUP_GUIDE.md"
cp "$SOURCE_DIR/src/main.jsx"     "$REPO_DIR/src/main.jsx"

echo -e "${GREEN}✅ Files copied${NC}"

# ── Step 3: Git add, commit, push ────────────────────────
cd "$REPO_DIR"

git add -A

# Check if there are actual changes
if git diff --staged --quiet; then
  echo -e "${YELLOW}⚠️  No changes detected — nothing to push${NC}"
  exit 0
fi

# Commit message
MSG="${1:-Auto-sync: $(date '+%Y-%m-%d %H:%M:%S')}"
git commit -m "$MSG"

echo -e "${YELLOW}🚀 Pushing to GitHub...${NC}"
git push origin main

echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}  ✅ PUSHED TO GITHUB SUCCESSFULLY!${NC}"
echo -e "${GREEN}  🔗 https://github.com/${GITHUB_USER}/${REPO_NAME}${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"
