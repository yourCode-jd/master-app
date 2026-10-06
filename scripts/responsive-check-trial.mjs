import wsPackage from "next/dist/compiled/ws/index.js";
import assert from "node:assert/strict";
import http from "node:http";
import { createHmac } from "node:crypto";
import { PrismaClient } from "@prisma/client";

const { WebSocket } = wsPackage;
const widths = [320, 360, 390, 430, 768, 1024, 1440, 1920];
const get = (url) => new Promise((resolve, reject) => http.get(url, (response) => { let body = ""; response.on("data", (chunk) => body += chunk); response.on("end", () => resolve(JSON.parse(body))); }).on("error", reject));
const page = (await get("http://127.0.0.1:9222/json")).find((item) => item.type === "page");
if (!page) throw new Error("No Chrome debug page found.");
const socket = new WebSocket(page.webSocketDebuggerUrl); const pending = new Map(); let nextId = 1;
socket.onmessage = (event) => { const message = JSON.parse(event.data); if (message.id) { const request = pending.get(message.id); pending.delete(message.id); message.error ? request.reject(new Error(message.error.message)) : request.resolve(message.result); } };
await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
const call = (method, params = {}) => new Promise((resolve, reject) => { const id = nextId++; pending.set(id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params })); });
const db = new PrismaClient(); const owner = await db.user.findUniqueOrThrow({ where: { email: "owner@demo.gym" } }); const body = Buffer.from(JSON.stringify({ userId: owner.id, gymId: owner.gymId, role: owner.role, expiresAt: Date.now() + 3_600_000 })).toString("base64url");
await call("Network.enable"); await call("Network.setCookie", { name: "gym_demo_session", value: `${body}.${createHmac("sha256", process.env.SESSION_SECRET).update(body).digest("base64url")}`, url: "http://127.0.0.1:3001", httpOnly: true, sameSite: "Lax" });
for (const route of ["/staff", "/reports"]) for (const width of widths) { await call("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 }); await call("Page.navigate", { url: `http://127.0.0.1:3001${route}` }); await new Promise((resolve) => setTimeout(resolve, 700)); const result = await call("Runtime.evaluate", { expression: "JSON.stringify({scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,title:document.querySelector('h1')?.textContent})", returnByValue: true }); const metrics = JSON.parse(result.result.value); assert.ok(["Staff management", "Action-focused reports"].includes(metrics.title)); assert.ok(metrics.scrollWidth <= metrics.clientWidth, `${route} at ${width}px overflows`); console.log(`${route} ${width}px: ${metrics.clientWidth}px viewport, ${metrics.scrollWidth}px content`); }
await db.$disconnect(); socket.close();
