.PHONY: install openapi mock dev dev_backend dev_frontend gen-api start check test-e2e test-e2e-ui test-e2e-debug docker-build docker-run docker-stop all

install:
	npm --prefix docs install
	npm --prefix frontend install
	npm --prefix backend install

docs/openapi.json: docs/api.tsp
	npx --prefix docs tsp compile docs/api.tsp
	node docs/merge-openapi.mjs

openapi: docs/openapi.json

mock: openapi
	npx @stoplight/prism-cli mock docs/openapi.json --port 4010

dev: dev_frontend

dev_backend:
	npm --prefix backend run dev

dev_frontend:
	npm --prefix frontend run dev

gen-api: openapi
	npm --prefix frontend run gen:api

start:
	@trap 'kill 0' EXIT; \
	npm --prefix backend run dev & \
	npx @stoplight/prism-cli mock docs/openapi.json --port 4010 & \
	npm --prefix frontend run dev

check:
	npm --prefix backend run typecheck

test-e2e:
	npx playwright test

test-e2e-ui:
	npx playwright test --ui

test-e2e-debug:
	npx playwright test --debug

docker-build:
	docker build -t calcom .

docker-run:
	docker run -e PORT=3001 -p 3001:3001 calcom

docker-stop:
	docker stop calcom 2>/dev/null; true

all: install openapi gen-api
	@echo "All set. Run 'make start' to launch the project."
