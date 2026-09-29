import wsPackage from "next/dist/compiled/ws/index.js";
import http from "node:http";
import { createHmac } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { PrismaClient } from "@prisma/client";

const { WebSocket } = wsPackage;
const get = (url) => new Promise((resolve, reject) => http.get(url, (response) => { let body = ""; response.on("data", (chunk) => body += chunk); response.on("end", () => resolve(JSON.parse(body))); }).on("error", reject));
const page = (await get("http://127.0.0.1:9222/json")).find((item) => item.type === "page");
const socket = new WebSocket(page.webSocketDebuggerUrl); const pending = new Map(); let nextId = 1;
socket.onmessage = (event) => { const message = JSON.parse(event.data); if (message.id) { const request = pending.get(message.id); pending.delete(message.id); message.error ? request.reject(new Error(message.error.message)) : request.resolve(message.result); } };
await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
const call = (method, params = {}) => new Promise((resolve, reject) => { const id = nextId++; pending.set(id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params })); });
const prisma = new PrismaClient(); const user = await prisma.user.findUniqueOrThrow({ where: { email: "owner@demo.gym" } }); const body = Buffer.from(JSON.stringify({ userId: user.id, gymId: user.gymId, role: user.role, expiresAt: Date.now() + 3_600_000 })).toString("base64url");
await call("Network.enable"); await call("Network.setCookie", { name: "gym_demo_session", value: `${body}.${createHmac("sha256", process.env.SESSION_SECRET).update(body).digest("base64url")}`, url: "http://127.0.0.1:3001", httpOnly: true, sameSite: "Lax" });
await call("Emulation.setDeviceMetricsOverride", { width: 1440, height: 920, deviceScaleFactor: 1, mobile: false }); await call("Page.navigate", { url: "http://127.0.0.1:3001/" }); await new Promise((resolve) => setTimeout(resolve, 1200));
const shot = await call("Page.captureScreenshot", { format: "png", captureBeyondViewport: false }); await writeFile("/tmp/gym-dashboard.png", Buffer.from(shot.data, "base64"));
await prisma.$disconnect(); socket.close();
