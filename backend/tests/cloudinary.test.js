import test from "node:test";
import assert from "node:assert/strict";
import { firmarParametrosCloudinary } from "../src/services/cloudinaryService.js";

test("firma los parámetros de Cloudinary en orden alfabético con SHA-256", () => {
  const firma = firmarParametrosCloudinary({ timestamp: 1700000000, folder: "iglesia/miembros/123456", public_id: "foto-1" }, "secreto");
  assert.equal(firma, "5b3f82107b87aa80345885ce1351bc39e7f0413be77b91813619df3c78219448");
});
