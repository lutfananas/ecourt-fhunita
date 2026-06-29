#!/bin/bash
# Deploy e-Court FH UNTA ke Vercel
# ============================================
# 
# CARA PAKAI:
# 1. Buat Vercel Token BARU dengan scope lengkap di:
#    https://vercel.com/account/tokens
#    (Pilih scope: Full Account / atau minimal "Deployments" + "Projects")
#
# 2. Set token sebagai env var:
#    export VERCEL_TOKEN="token_baru_anda"
#
# 3. Jalankan script ini:
#    bash deploy-vercel.sh
#
# 4. Setelah deploy, akses website di:
#    https://ecourt-fhunita.vercel.app

set -e

PROJECT_NAME="ecourt-fhunita"
REPO_URL="https://github.com/lutfananas/ecourt-fhunita"

echo "=========================================="
echo "  Deploy e-Court FH UNTA ke Vercel"
echo "=========================================="
echo ""

# Cek token
if [ -z "$VERCEL_TOKEN" ]; then
  echo "❌ VERCEL_TOKEN belum di-set."
  echo ""
  echo "Buat token di: https://vercel.com/account/tokens"
  echo "Lalu jalankan:"
  echo "  export VERCEL_TOKEN='token_baru_anda'"
  echo "  bash deploy-vercel.sh"
  exit 1
fi

echo "✅ Token terdeteksi (panjang: ${#VERCEL_TOKEN} karakter)"

# Cek Vercel CLI
if ! command -v vercel &> /dev/null; then
  echo "⚠️  Vercel CLI belum terinstall. Installing..."
  npm install -g vercel
fi

echo "✅ Vercel CLI siap"
echo ""

# Verify token
echo "[1/4] Verifikasi token..."
if ! vercel whoami --token="$VERCEL_TOKEN" &> /dev/null; then
  echo "❌ Token tidak valid atau scope terbatas."
  echo ""
  echo "Pastikan token Anda memiliki scope:"
  echo "  - View user info"
  echo "  - Create deployments"
  echo "  - Create projects"
  echo ""
  echo "Buat ulang di: https://vercel.com/account/tokens"
  exit 1
fi
echo "✅ Token valid"
echo ""

# Link project
echo "[2/4] Link project ke Vercel..."
cd "$(dirname "$0")"
vercel link --yes --token="$VERCEL_TOKEN" || {
  echo "⚠️  Link gagal, mencoba deploy langsung..."
}
echo ""

# Deploy ke production
echo "[3/4] Deploy ke production..."
DEPLOY_URL=$(vercel deploy --prod --yes --token="$VERCEL_TOKEN" 2>&1 | tail -1)
echo "✅ Deploy berhasil!"
echo ""
echo "🌐 URL Preview : $DEPLOY_URL"
echo ""

# Coba set custom name
echo "[4/4] Set nama project: $PROJECT_NAME"
vercel alias set "$DEPLOY_URL" "$PROJECT_NAME" --token="$VERCEL_TOKEN" 2>&1 || true

echo ""
echo "=========================================="
echo "  DEPLOY SELESAI!"
echo "=========================================="
echo ""
echo "GitHub Repo : $REPO_URL"
echo "Vercel URL  : https://$PROJECT_NAME.vercel.app"
echo ""
echo "Login demo (5 akun dosen FH UNTA):"
echo "  Admin Banding : retno.sari / admin123"
echo "  Admin Pertama : surjanti / admin123"
echo "  Hakim         : aulia.hakim / hakim123"
echo "  Advokat       : rudi.advokat / advokat123"
echo "  Insidentil    : khoirul.insidentil / user123"
echo ""
