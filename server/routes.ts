import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateTwinModel, enhanceModelDetails } from "./gemini";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

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

  const httpServer = createServer(app);

  return httpServer;
}
