#!/bin/bash

# Configuration
LOGOS_FILE="logos.txt"
ENV_FILE=".env.local"
# Default bucket as per src/lib/storage.ts
BUCKET_NAME="assets"
TARGET_FOLDER="Brands"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "Starting Logo Downloader & Uploader..."

# 1. Load Environment Variables
if [ -f "$ENV_FILE" ]; then
    echo "Loading environment variables from $ENV_FILE..."
    # Export variables from .env.local
    # We use grep to avoid comments and empty lines, then loop to export
    # This is safer than just sourcing if there are complex lines, but sourcing is standard for .env
    set -a
    source "$ENV_FILE"
    set +a
else
    echo -e "${RED}Error: $ENV_FILE not found.${NC}"
    exit 1
fi

# 2. Determine Credentials
SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL"
# Prefer Service Role Key for Admin tasks if available, otherwise Anon Key
SUPABASE_KEY="$SUPABASE_SERVICE_ROLE_KEY"
if [ -z "$SUPABASE_KEY" ]; then
    echo "SUPABASE_SERVICE_ROLE_KEY not found, trying NEXT_PUBLIC_SUPABASE_ANON_KEY..."
    SUPABASE_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY"
fi

# Check if we have what we need
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_KEY" ]; then
    echo -e "${RED}Error: Supabase credentials missing (URL or KEY).${NC}"
    echo "Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) are set in $ENV_FILE."
    exit 1
fi

echo "Supabase URL: $SUPABASE_URL"
echo "Target Bucket: $BUCKET_NAME"
echo "Target Folder: $TARGET_FOLDER"

# 3. Create Temp Directory
TEMP_DIR="temp_logos_download"
mkdir -p "$TEMP_DIR"

# 4. Process Logos
while IFS='|' read -r name url; do
    # Trim whitespace
    name=$(echo "$name" | xargs)
    url=$(echo "$url" | xargs)

    if [ -z "$name" ] || [ -z "$url" ]; then
        continue
    fi

    # Format filename: lowercase, spaces to hyphens
    clean_name=$(echo "$name" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
    
    # Extract extension or default
    # Looking at URLs like .../image.png?updatedAt...
    # Remove query string
    url_no_query="${url%%\?*}"
    extension="${url_no_query##*.}"
    
    # Basic validation of extension
    if [[ "$extension" != "png" && "$extension" != "jpg" && "$extension" != "jpeg" && "$extension" != "webp" && "$extension" != "svg" ]]; then
        extension="png" # Default fallback
    fi
    
    filename="${clean_name}.${extension}"
    filepath="$TEMP_DIR/$filename"
    
    echo -n "Downloading $name... "
    
    # Download
    curl -s -o "$filepath" "$url"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Done${NC}"
        
        # Mime Type
        mime_type="application/octet-stream"
        case "$extension" in
            png) mime_type="image/png" ;;
            jpg|jpeg) mime_type="image/jpeg" ;;
            webp) mime_type="image/webp" ;;
            svg) mime_type="image/svg+xml" ;;
        esac

        # Upload path
        storage_path="${TARGET_FOLDER}/${filename}"
        
        echo -n "  Uploading to $storage_path... "
        
        # Upload using Supabase Storage API
        # POST /storage/v1/object/{bucket}/{path}
        # Note: If file exists, we might want to update. Use x-upsert header or different method?
        # The API usually is POST. For upsert, we might need to overwrite.
        # Supabase Storage API supports upsert in header: x-upsert: true
        
        response=$(curl -s -w "%{http_code}" -o /dev/null -X POST \
            "${SUPABASE_URL}/storage/v1/object/${BUCKET_NAME}/${storage_path}" \
            -H "Authorization: Bearer ${SUPABASE_KEY}" \
            -H "apikey: ${SUPABASE_KEY}" \
            -H "Content-Type: ${mime_type}" \
            -H "x-upsert: true" \
            --data-binary "@${filepath}")
            
        if [ "$response" -eq 200 ]; then
            echo -e "${GREEN}Success${NC}"
        else
            echo -e "${RED}Failed (HTTP $response)${NC}"
        fi
        
    else
        echo -e "${RED}Download Failed${NC}"
    fi

done < "$LOGOS_FILE"

# 5. Cleanup
echo "Cleaning up..."
rm -rf "$TEMP_DIR"

echo "Operation complete."
