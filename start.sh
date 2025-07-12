#!/bin/bash
echo "=== Checking for uv ==="
if ! command -v uv &> /dev/null; then
    echo "uv not found, installing..."
    curl -LsSf https://astral.sh/uv/install.sh | sh
    export PATH="$HOME/.cargo/bin:$PATH"
    echo "PATH after export: $PATH"
    echo "Checking uv again..."
    command -v uv
    command -v uvx
else
    echo "uv found at: $(command -v uv)"
fi

echo "=== Final PATH check ==="
echo "PATH: $PATH"
echo "uv location: $(command -v uv)"
echo "uvx location: $(command -v uvx)"

# Start your application
pnpm run start:app