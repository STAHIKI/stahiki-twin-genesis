import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateTwinModel, enhanceModelDetails } from "./gemini";
import { 
  insertDigitalTwinSchema, 
  insertIoTDeviceSchema, 
  insertWorkflowSchema, 
  insertApiConnectionSchema 
} from "@shared/schema";
import { dittoClient } from "./integrations/ditto";
import { mqttClient } from "./integrations/mqtt";
import { nodeRedClient } from "./integrations/node-red";

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate 3D twin model from prompt
  app.post("/api/generate-twin", async (req, res) => {
    try {
      const { prompt } = req.body;
      
      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const model = await generateTwinModel(prompt);
      res.json({ success: true, model });
    } catch (error) {
      console.error("Error generating twin:", error);
      res.status(500).json({ 
        error: "Failed to generate twin model",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Enhance existing model
  app.post("/api/enhance-model/:modelId", async (req, res) => {
    try {
      const { modelId } = req.params;
      const { prompt } = req.body;
      
      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: "Enhancement prompt is required" });
      }

      const enhancements = await enhanceModelDetails(modelId, prompt);
      res.json({ success: true, enhancements });
    } catch (error) {
      console.error("Error enhancing model:", error);
      res.status(500).json({ 
        error: "Failed to enhance model",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Digital Twin Routes
  app.get("/api/digital-twins", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
      
      const twins = await storage.getDigitalTwinsByUser(parseInt(userId));
      res.json({ success: true, twins });
    } catch (error) {
      console.error("Error fetching digital twins:", error);
      res.status(500).json({ error: "Failed to fetch digital twins" });
    }
  });

  app.get("/api/digital-twins/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const twin = await storage.getDigitalTwin(parseInt(id));
      
      if (!twin) {
        return res.status(404).json({ error: "Digital twin not found" });
      }
      
      res.json({ success: true, twin });
    } catch (error) {
      console.error("Error fetching digital twin:", error);
      res.status(500).json({ error: "Failed to fetch digital twin" });
    }
  });

  app.post("/api/digital-twins", async (req, res) => {
    try {
      const validatedData = insertDigitalTwinSchema.parse(req.body);
      const twin = await storage.createDigitalTwin(validatedData);
      res.json({ success: true, twin });
    } catch (error) {
      console.error("Error creating digital twin:", error);
      res.status(500).json({ error: "Failed to create digital twin" });
    }
  });

  app.put("/api/digital-twins/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const twin = await storage.updateDigitalTwin(parseInt(id), updates);
      
      if (!twin) {
        return res.status(404).json({ error: "Digital twin not found" });
      }
      
      res.json({ success: true, twin });
    } catch (error) {
      console.error("Error updating digital twin:", error);
      res.status(500).json({ error: "Failed to update digital twin" });
    }
  });

  app.delete("/api/digital-twins/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteDigitalTwin(parseInt(id));
      
      if (!deleted) {
        return res.status(404).json({ error: "Digital twin not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting digital twin:", error);
      res.status(500).json({ error: "Failed to delete digital twin" });
    }
  });

  // IoT Device Routes
  app.get("/api/iot-devices", async (req, res) => {
    try {
      const twinId = req.query.twinId as string;
      if (!twinId) {
        return res.status(400).json({ error: "Twin ID is required" });
      }
      
      const devices = await storage.getIoTDevicesByTwin(parseInt(twinId));
      res.json({ success: true, devices });
    } catch (error) {
      console.error("Error fetching IoT devices:", error);
      res.status(500).json({ error: "Failed to fetch IoT devices" });
    }
  });

  app.post("/api/iot-devices", async (req, res) => {
    try {
      const validatedData = insertIoTDeviceSchema.parse(req.body);
      const device = await storage.createIoTDevice(validatedData);
      res.json({ success: true, device });
    } catch (error) {
      console.error("Error creating IoT device:", error);
      res.status(500).json({ error: "Failed to create IoT device" });
    }
  });

  app.put("/api/iot-devices/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const device = await storage.updateIoTDevice(parseInt(id), updates);
      
      if (!device) {
        return res.status(404).json({ error: "IoT device not found" });
      }
      
      res.json({ success: true, device });
    } catch (error) {
      console.error("Error updating IoT device:", error);
      res.status(500).json({ error: "Failed to update IoT device" });
    }
  });

  app.delete("/api/iot-devices/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteIoTDevice(parseInt(id));
      
      if (!deleted) {
        return res.status(404).json({ error: "IoT device not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting IoT device:", error);
      res.status(500).json({ error: "Failed to delete IoT device" });
    }
  });

  // Workflow Routes
  app.get("/api/workflows", async (req, res) => {
    try {
      const twinId = req.query.twinId as string;
      if (!twinId) {
        return res.status(400).json({ error: "Twin ID is required" });
      }
      
      const workflows = await storage.getWorkflowsByTwin(parseInt(twinId));
      res.json({ success: true, workflows });
    } catch (error) {
      console.error("Error fetching workflows:", error);
      res.status(500).json({ error: "Failed to fetch workflows" });
    }
  });

  app.post("/api/workflows", async (req, res) => {
    try {
      const validatedData = insertWorkflowSchema.parse(req.body);
      const workflow = await storage.createWorkflow(validatedData);
      res.json({ success: true, workflow });
    } catch (error) {
      console.error("Error creating workflow:", error);
      res.status(500).json({ error: "Failed to create workflow" });
    }
  });

  app.put("/api/workflows/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const workflow = await storage.updateWorkflow(parseInt(id), updates);
      
      if (!workflow) {
        return res.status(404).json({ error: "Workflow not found" });
      }
      
      res.json({ success: true, workflow });
    } catch (error) {
      console.error("Error updating workflow:", error);
      res.status(500).json({ error: "Failed to update workflow" });
    }
  });

  app.delete("/api/workflows/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteWorkflow(parseInt(id));
      
      if (!deleted) {
        return res.status(404).json({ error: "Workflow not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting workflow:", error);
      res.status(500).json({ error: "Failed to delete workflow" });
    }
  });

  // API Connection Routes
  app.get("/api/api-connections", async (req, res) => {
    try {
      const twinId = req.query.twinId as string;
      if (!twinId) {
        return res.status(400).json({ error: "Twin ID is required" });
      }
      
      const connections = await storage.getApiConnectionsByTwin(parseInt(twinId));
      res.json({ success: true, connections });
    } catch (error) {
      console.error("Error fetching API connections:", error);
      res.status(500).json({ error: "Failed to fetch API connections" });
    }
  });

  app.post("/api/api-connections", async (req, res) => {
    try {
      const validatedData = insertApiConnectionSchema.parse(req.body);
      const connection = await storage.createApiConnection(validatedData);
      res.json({ success: true, connection });
    } catch (error) {
      console.error("Error creating API connection:", error);
      res.status(500).json({ error: "Failed to create API connection" });
    }
  });

  app.put("/api/api-connections/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const connection = await storage.updateApiConnection(parseInt(id), updates);
      
      if (!connection) {
        return res.status(404).json({ error: "API connection not found" });
      }
      
      res.json({ success: true, connection });
    } catch (error) {
      console.error("Error updating API connection:", error);
      res.status(500).json({ error: "Failed to update API connection" });
    }
  });

  app.delete("/api/api-connections/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteApiConnection(parseInt(id));
      
      if (!deleted) {
        return res.status(404).json({ error: "API connection not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting API connection:", error);
      res.status(500).json({ error: "Failed to delete API connection" });
    }
  });

  // Test API connection
  app.post("/api/api-connections/:id/test", async (req, res) => {
    try {
      const { id } = req.params;
      const connection = await storage.getApiConnection(parseInt(id));
      
      if (!connection) {
        return res.status(404).json({ error: "API connection not found" });
      }

      // Test the API connection
      const response = await fetch(connection.url, {
        method: connection.method,
        headers: {
          ...connection.headers,
          'Content-Type': 'application/json'
        }
      });

      const isSuccess = response.ok;
      const status = isSuccess ? "connected" : "error";
      
      // Update connection status
      await storage.updateApiConnection(parseInt(id), { 
        status, 
        lastTest: new Date() 
      });

      res.json({ 
        success: true, 
        status, 
        statusCode: response.status,
        message: isSuccess ? "Connection successful" : "Connection failed"
      });
    } catch (error) {
      console.error("Error testing API connection:", error);
      
      // Update connection status to error
      await storage.updateApiConnection(parseInt(req.params.id), { 
        status: "error", 
        lastTest: new Date() 
      });
      
      res.status(500).json({ 
        error: "Failed to test API connection",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
