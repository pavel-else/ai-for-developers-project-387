#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

if [ ! -d node_modules ]; then
  echo "Installing TypeSpec dependencies..."
  npm install
fi

if [ ! -f openapi.json ]; then
  echo "Generating OpenAPI spec from TypeSpec..."
  npx tsp compile api.tsp
  node -e "
    const fs = require('fs');
    const a = JSON.parse(fs.readFileSync('openapi.Admin.json'));
    const g = JSON.parse(fs.readFileSync('openapi.Guest.json'));
    const m = { openapi: '3.0.0', info: { title: 'CalClone API', version: '0.1.0' }, servers: [{ url: 'http://localhost:4010' }], tags: [], paths: {...a.paths, ...g.paths}, components: { schemas: {...a.components.schemas, ...g.components.schemas} } };
    fs.writeFileSync('openapi.json', JSON.stringify(m, null, 2));
  "
fi

echo "Starting Prism mock server on http://localhost:4010"
npx @stoplight/prism-cli mock openapi.json --port 4010
