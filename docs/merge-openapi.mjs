import { readFileSync, writeFileSync } from "node:fs";

const a = JSON.parse(readFileSync("docs/openapi.Admin.json", "utf-8"));
const g = JSON.parse(readFileSync("docs/openapi.Guest.json", "utf-8"));

const merged = {
  openapi: "3.0.0",
  info: { title: "CalClone API", version: "0.1.0" },
  servers: [{ url: "http://localhost:4010" }],
  tags: [],
  paths: { ...a.paths, ...g.paths },
  components: { schemas: { ...a.components.schemas, ...g.components.schemas } },
};

writeFileSync("docs/openapi.json", JSON.stringify(merged, null, 2));
