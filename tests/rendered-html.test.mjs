import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("server-renders the ORBIT fleet dashboard", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>إنجاز \| إدارة الأسطول<\/title>/i);
  assert.match(html, /ORBIT/);
  assert.match(html, /الخريطة الحية/);
  assert.match(html, /المركبات/);
  assert.match(html, /dir="rtl"/);
  assert.doesNotMatch(html, /codex-preview|Building your site/);
});

test("keeps API integration isolated from UI components", async () => {
  const [page, service, client, environment] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/services/vehicles.service.ts", import.meta.url), "utf8"),
    readFile(new URL("../src/lib/api/client.ts", import.meta.url), "utf8"),
    readFile(new URL("../.env.example", import.meta.url), "utf8"),
  ]);
  assert.match(page, /LiveMapPage/);
  assert.doesNotMatch(page, /fetch\(|mockVehicles|NEXT_PUBLIC_API_URL/);
  assert.match(service, /apiClient<ApiListResponse<Vehicle>>/);
  assert.match(client, /class ApiError/);
  assert.match(environment, /NEXT_PUBLIC_USE_MOCK_API=true/);
  await access(new URL("../src/types/vehicle.ts", import.meta.url));
  await access(new URL("../src/hooks/use-vehicles.ts", import.meta.url));
});
