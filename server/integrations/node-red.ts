import axios from 'axios';

const NODE_RED_BASE_URL = process.env.NODE_RED_URL || 'http://localhost:1880';

export class NodeRedIntegration {
  private baseUrl: string;

  constructor() {
    this.baseUrl = NODE_RED_BASE_URL;
  }

  async deployFlow(flowData: any) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/flows`,
        flowData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error deploying flow to Node-RED:', error);
      throw error;
    }
  }

  async getFlows() {
    try {
      const response = await axios.get(`${this.baseUrl}/flows`);
      return response.data;
    } catch (error) {
      console.error('Error fetching flows from Node-RED:', error);
      throw error;
    }
  }

  async updateFlow(flowId: string, flowData: any) {
    try {
      const response = await axios.put(
        `${this.baseUrl}/flow/${flowId}`,
        flowData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating flow in Node-RED:', error);
      throw error;
    }
  }

  async deleteFlow(flowId: string) {
    try {
      const response = await axios.delete(`${this.baseUrl}/flow/${flowId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting flow from Node-RED:', error);
      throw error;
    }
  }

  async injectMessage(nodeId: string, message: any) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/inject/${nodeId}`,
        message,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error injecting message to Node-RED:', error);
      throw error;
    }
  }

  // Digital Twin specific methods
  async createTwinWorkflow(twinId: string, workflowConfig: any) {
    const flowData = {
      id: `twin-${twinId}`,
      label: `Twin ${twinId} Workflow`,
      nodes: this.generateWorkflowNodes(twinId, workflowConfig),
      configs: [],
      subflows: [],
      env: []
    };

    return await this.deployFlow(flowData);
  }

  private generateWorkflowNodes(twinId: string, config: any) {
    // Generate Node-RED nodes based on twin configuration
    const nodes = [
      {
        id: `mqtt-in-${twinId}`,
        type: 'mqtt in',
        topic: `stahiki/twins/${twinId}/+/+`,
        broker: 'mqtt-broker',
        x: 100,
        y: 100,
        wires: [[`process-${twinId}`]]
      },
      {
        id: `process-${twinId}`,
        type: 'function',
        name: 'Process Twin Data',
        func: `
          // Process incoming twin data
          const data = msg.payload;
          const topic = msg.topic;
          
          // Add processing logic here
          msg.payload = {
            ...data,
            processed: true,
            timestamp: new Date().toISOString()
          };
          
          return msg;
        `,
        x: 300,
        y: 100,
        wires: [[`mqtt-out-${twinId}`]]
      },
      {
        id: `mqtt-out-${twinId}`,
        type: 'mqtt out',
        topic: `stahiki/twins/${twinId}/processed`,
        broker: 'mqtt-broker',
        x: 500,
        y: 100
      }
    ];

    return nodes;
  }
}

export const nodeRedClient = new NodeRedIntegration();