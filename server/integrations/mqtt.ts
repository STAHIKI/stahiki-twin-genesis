import mqtt from 'mqtt';
import { EventEmitter } from 'events';

const MQTT_BROKER_URL = process.env.MQTT_BROKER || 'mqtt://localhost:1883';

export class MQTTIntegration extends EventEmitter {
  private client: mqtt.MqttClient;
  private subscriptions: Map<string, (message: Buffer) => void> = new Map();

  constructor() {
    super();
    this.client = mqtt.connect(MQTT_BROKER_URL);
    
    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
      this.emit('connected');
    });

    this.client.on('message', (topic, message) => {
      const handler = this.subscriptions.get(topic);
      if (handler) {
        handler(message);
      }
      this.emit('message', { topic, message: message.toString() });
    });

    this.client.on('error', (error) => {
      console.error('MQTT connection error:', error);
      this.emit('error', error);
    });
  }

  async publish(topic: string, message: string | Buffer, options?: mqtt.IClientPublishOptions) {
    return new Promise<void>((resolve, reject) => {
      this.client.publish(topic, message, options || {}, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  async subscribe(topic: string, handler?: (message: Buffer) => void) {
    return new Promise<void>((resolve, reject) => {
      this.client.subscribe(topic, (error) => {
        if (error) {
          reject(error);
        } else {
          if (handler) {
            this.subscriptions.set(topic, handler);
          }
          resolve();
        }
      });
    });
  }

  async unsubscribe(topic: string) {
    return new Promise<void>((resolve, reject) => {
      this.client.unsubscribe(topic, (error) => {
        if (error) {
          reject(error);
        } else {
          this.subscriptions.delete(topic);
          resolve();
        }
      });
    });
  }

  // Digital Twin specific methods
  async publishSensorData(twinId: string, sensorType: string, data: any) {
    const topic = `stahiki/twins/${twinId}/sensors/${sensorType}`;
    await this.publish(topic, JSON.stringify(data));
  }

  async subscribeToTwinData(twinId: string, callback: (data: any) => void) {
    const topic = `stahiki/twins/${twinId}/+/+`;
    await this.subscribe(topic, (message) => {
      try {
        const data = JSON.parse(message.toString());
        callback(data);
      } catch (error) {
        console.error('Error parsing MQTT message:', error);
      }
    });
  }

  async publishWorkflowTrigger(workflowId: string, payload: any) {
    const topic = `stahiki/workflows/${workflowId}/trigger`;
    await this.publish(topic, JSON.stringify(payload));
  }

  disconnect() {
    this.client.end();
  }
}

export const mqttClient = new MQTTIntegration();