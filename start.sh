#!/bin/bash
echo "=== Installing uv via pip ==="
if ! command -v uv &> /dev/null; then
    echo "Installing uv via pip..."
    python3 -m pip install uv
    
    # Add Python user bin to PATH
    export PATH="$HOME/.local/bin:$PATH"
    
    echo "PATH: $PATH"
    echo "uv location: $(command -v uv)"
    echo "uvx location: $(command -v uvx)"
fi

# Start your application
pnpm run start:app