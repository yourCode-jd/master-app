export type SimulatedMessage = { recipient: string; template: string; body: string; status: "SIMULATED"; queuedAt: Date };
export interface MessagingProvider { send(message: Omit<SimulatedMessage, "status" | "queuedAt">): Promise<SimulatedMessage>; }
export interface EmailProvider { send(input: { to: string; subject: string; body: string }): Promise<{ status: "SIMULATED" }>; }
export interface PaymentProvider { record(input: { amount: number; method: string }): Promise<{ status: "RECORDED" }>; }
export interface StorageProvider { save(fileName: string, contents: Uint8Array): Promise<{ path: string }>; }
export interface IntelligenceProvider { run(gymId: string): Promise<{ mode: "RULE_BASED"; gymId: string }>; }
export interface EquipmentProvider { occupancy(): Promise<"QUIET" | "NORMAL" | "BUSY" | "VERY_BUSY">; }
export const simulatorMessagingProvider: MessagingProvider = { async send(message) { return { ...message, status: "SIMULATED", queuedAt: new Date() }; } };
export const simulatorEmailProvider: EmailProvider = { async send() { return { status: "SIMULATED" }; } };
export const manualPaymentProvider: PaymentProvider = { async record() { return { status: "RECORDED" }; } };
export const localStorageProvider: StorageProvider = { async save(fileName) { return { path: `uploads/${fileName}` }; } };
export const ruleBasedIntelligenceProvider: IntelligenceProvider = { async run(gymId) { return { mode: "RULE_BASED", gymId }; } };
export const simulatorEquipmentProvider: EquipmentProvider = { async occupancy() { return "NORMAL"; } };
