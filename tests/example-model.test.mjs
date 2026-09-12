import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { buildModel } from "../scripts/generate-example-model.mjs";
test("generates valid non-empty OBJ geometry",()=>{const model=buildModel();assert.equal(model.vertexCount,62);assert.equal(model.faceCount,47);assert.match(model.obj,/^v /m);assert.match(model.obj,/^f /m);for(const line of model.obj.split("\n").filter(x=>x.startsWith("f ")))for(const index of line.slice(2).split(" ").map(Number))assert.ok(index>=1&&index<=model.vertexCount)});
test("labels the asset as synthetic and photo-free",async()=>{const metadata=JSON.parse(await readFile("public/models/example-house.json","utf8"));assert.match(metadata.source,/no listing photographs used/i);assert.equal(metadata.permissionRequired,false);assert.equal(metadata.commercialListingUse,false)});
