import wsPackage from "next/dist/compiled/ws/index.js"; const { WebSocket } = wsPackage;
import assert from "node:assert/strict";
import http from "node:http";
import { createHmac } from "node:crypto";
import { PrismaClient } from "@prisma/client";

const widths = [320, 360, 375, 390, 430, 768, 1024, 1280, 1440, 1920];
const get = (url) => new Promise((resolve, reject) => http.get(url, (response) => { let body = ""; response.on("data", (chunk) => body += chunk); response.on("end", () => resolve(JSON.parse(body))); }).on("error", reject));
const pages = await get("http://127.0.0.1:9222/json"); const page = pages.find((item) => item.type === "page");
if (!page) throw new Error("No Chrome debug page found.");
const ws = new WebSocket(page.webSocketDebuggerUrl); const pending = new Map(); let nextId = 1;
ws.onmessage = (event) => { const message = JSON.parse(event.data); if (message.id) { const entry = pending.get(message.id); pending.delete(message.id); message.error ? entry.reject(new Error(message.error.message)) : entry.resolve(message.result); } };
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
const call = (method, params = {}) => new Promise((resolve, reject) => { const id = nextId++; pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params })); });
const prisma = new PrismaClient(); const user = await prisma.user.findUniqueOrThrow({ where: { email: "owner@demo.gym" } }); const payload = Buffer.from(JSON.stringify({ userId: user.id, gymId: user.gymId, role: user.role, expiresAt: Date.now() + 3_600_000 })).toString("base64url"); const signature = createHmac("sha256", process.env.SESSION_SECRET).update(payload).digest("base64url");
await call("Network.enable"); await call("Network.setCookie", { name: "gym_demo_session", value: `${payload}.${signature}`, url: "http://127.0.0.1:3001", httpOnly: true, sameSite: "Lax" });
for (const width of widths) { await call("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 }); await call("Page.navigate", { url: "http://127.0.0.1:3001/community" }); await new Promise((resolve) => setTimeout(resolve, 1000)); const result = await call("Runtime.evaluate", { expression: "JSON.stringify({scrollWidth:document.documentElement.scrollWidth, clientWidth:document.documentElement.clientWidth, title:document.querySelector('h1')?.textContent})", returnByValue: true }); const metrics = JSON.parse(result.result.value); assert.equal(metrics.title, "Groups that support consistency"); assert.ok(metrics.scrollWidth <= metrics.clientWidth, `${width}px has horizontal overflow: ${metrics.scrollWidth}px > ${metrics.clientWidth}px`); console.log(`${width}px: ${metrics.clientWidth}px viewport, ${metrics.scrollWidth}px content`); }
await prisma.$disconnect(); ws.close();
