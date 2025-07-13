import { pgTable, text, serial, integer, boolean, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const digitalTwins = pgTable("digital_twins", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // building, manufacturing, agriculture, smart-city
  description: text("description"),
  userId: integer("user_id").references(() => users.id),
  model3D: json("model_3d"), // 3D model data
  iotDevices: json("iot_devices").default([]), // connected IoT devices
  workflows: json("workflows").default([]), // Node-RED style workflows
  status: text("status").notNull().default("active"), // active, paused, error
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const iotDevices = pgTable("iot_devices", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // sensor, actuator, gateway
  protocol: text("protocol").notNull(), // mqtt, http, websocket
  twinId: integer("twin_id").references(() => digitalTwins.id),
  config: json("config").default({}), // device configuration
  lastValue: json("last_value"), // last sensor reading
  status: text("status").notNull().default("connected"), // connected, disconnected, error
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const workflows = pgTable("workflows", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  twinId: integer("twin_id").references(() => digitalTwins.id),
  nodes: json("nodes").default([]), // Node-RED style nodes
  connections: json("connections").default([]), // Node connections
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const apiConnections = pgTable("api_connections", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  method: text("method").notNull().default("GET"),
  headers: json("headers").default({}),
  twinId: integer("twin_id").references(() => digitalTwins.id),
  status: text("status").notNull().default("connected"), // connected, error, testing
  lastTest: timestamp("last_test"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertDigitalTwinSchema = createInsertSchema(digitalTwins).pick({
  name: true,
  type: true,
  description: true,
  userId: true,
  model3D: true,
  iotDevices: true,
  workflows: true,
});

export const insertIoTDeviceSchema = createInsertSchema(iotDevices).pick({
  name: true,
  type: true,
  protocol: true,
  twinId: true,
  config: true,
});

export const insertWorkflowSchema = createInsertSchema(workflows).pick({
  name: true,
  twinId: true,
  nodes: true,
  connections: true,
});

export const insertApiConnectionSchema = createInsertSchema(apiConnections).pick({
  name: true,
  url: true,
  method: true,
  headers: true,
  twinId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type DigitalTwin = typeof digitalTwins.$inferSelect;
export type InsertDigitalTwin = z.infer<typeof insertDigitalTwinSchema>;
export type IoTDevice = typeof iotDevices.$inferSelect;
export type InsertIoTDevice = z.infer<typeof insertIoTDeviceSchema>;
export type Workflow = typeof workflows.$inferSelect;
export type InsertWorkflow = z.infer<typeof insertWorkflowSchema>;
export type ApiConnection = typeof apiConnections.$inferSelect;
export type InsertApiConnection = z.infer<typeof insertApiConnectionSchema>;
