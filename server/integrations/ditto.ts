import axios from 'axios';

const DITTO_BASE_URL = process.env.DITTO_BASE_URL || 'http://localhost:8080';
const DITTO_AUTH = { username: 'ditto', password: 'ditto' };

export class DittoIntegration {
  private baseUrl: string;
  private auth: { username: string; password: string };

  constructor() {
    this.baseUrl = DITTO_BASE_URL;
    this.auth = DITTO_AUTH;
  }

  async createThing(thingId: string, thingData: any) {
    try {
      const response = await axios.put(
        `${this.baseUrl}/api/2/things/${thingId}`,
        thingData,
        {
          auth: this.auth,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating thing in Ditto:', error);
      throw error;
    }
  }

  async getThing(thingId: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/api/2/things/${thingId}`,
        {
          auth: this.auth,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching thing from Ditto:', error);
      throw error;
    }
  }

  async updateThingFeature(thingId: string, featureId: string, featureData: any) {
    try {
      const response = await axios.put(
        `${this.baseUrl}/api/2/things/${thingId}/features/${featureId}`,
        featureData,
        {
          auth: this.auth,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating thing feature in Ditto:', error);
      throw error;
    }
  }

  async subscribeToThingChanges(thingId: string, callback: (change: any) => void) {
    // WebSocket connection for real-time updates
    const wsUrl = `${this.baseUrl.replace('http', 'ws')}/ws/2`;
    
    // Implementation would require WebSocket client
    // This is a placeholder for the WebSocket subscription logic
    console.log(`Subscribing to changes for thing: ${thingId}`);
  }

  async searchThings(filter?: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/api/2/search/things`,
        {
          auth: this.auth,
          params: filter ? { filter } : {},
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error searching things in Ditto:', error);
      throw error;
    }
  }
}

export const dittoClient = new DittoIntegration();