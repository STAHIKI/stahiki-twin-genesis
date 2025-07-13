import { 
  users, 
  type User, 
  type InsertUser, 
  type DigitalTwin, 
  type InsertDigitalTwin, 
  type IoTDevice, 
  type InsertIoTDevice, 
  type Workflow, 
  type InsertWorkflow, 
  type ApiConnection, 
  type InsertApiConnection 
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Digital Twin operations
  getDigitalTwin(id: number): Promise<DigitalTwin | undefined>;
  getDigitalTwinsByUser(userId: number): Promise<DigitalTwin[]>;
  createDigitalTwin(twin: InsertDigitalTwin): Promise<DigitalTwin>;
  updateDigitalTwin(id: number, updates: Partial<DigitalTwin>): Promise<DigitalTwin | undefined>;
  deleteDigitalTwin(id: number): Promise<boolean>;
  
  // IoT Device operations
  getIoTDevice(id: number): Promise<IoTDevice | undefined>;
  getIoTDevicesByTwin(twinId: number): Promise<IoTDevice[]>;
  createIoTDevice(device: InsertIoTDevice): Promise<IoTDevice>;
  updateIoTDevice(id: number, updates: Partial<IoTDevice>): Promise<IoTDevice | undefined>;
  deleteIoTDevice(id: number): Promise<boolean>;
  
  // Workflow operations
  getWorkflow(id: number): Promise<Workflow | undefined>;
  getWorkflowsByTwin(twinId: number): Promise<Workflow[]>;
  createWorkflow(workflow: InsertWorkflow): Promise<Workflow>;
  updateWorkflow(id: number, updates: Partial<Workflow>): Promise<Workflow | undefined>;
  deleteWorkflow(id: number): Promise<boolean>;
  
  // API Connection operations
  getApiConnection(id: number): Promise<ApiConnection | undefined>;
  getApiConnectionsByTwin(twinId: number): Promise<ApiConnection[]>;
  createApiConnection(connection: InsertApiConnection): Promise<ApiConnection>;
  updateApiConnection(id: number, updates: Partial<ApiConnection>): Promise<ApiConnection | undefined>;
  deleteApiConnection(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private digitalTwins: Map<number, DigitalTwin>;
  private iotDevices: Map<number, IoTDevice>;
  private workflows: Map<number, Workflow>;
  private apiConnections: Map<number, ApiConnection>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.digitalTwins = new Map();
    this.iotDevices = new Map();
    this.workflows = new Map();
    this.apiConnections = new Map();
    this.currentId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Digital Twin operations
  async getDigitalTwin(id: number): Promise<DigitalTwin | undefined> {
    return this.digitalTwins.get(id);
  }

  async getDigitalTwinsByUser(userId: number): Promise<DigitalTwin[]> {
    return Array.from(this.digitalTwins.values()).filter(
      (twin) => twin.userId === userId,
    );
  }

  async createDigitalTwin(insertTwin: InsertDigitalTwin): Promise<DigitalTwin> {
    const id = this.currentId++;
    const now = new Date();
    const twin: DigitalTwin = { 
      ...insertTwin, 
      id, 
      status: "active",
      createdAt: now,
      updatedAt: now 
    };
    this.digitalTwins.set(id, twin);
    return twin;
  }

  async updateDigitalTwin(id: number, updates: Partial<DigitalTwin>): Promise<DigitalTwin | undefined> {
    const twin = this.digitalTwins.get(id);
    if (!twin) return undefined;
    
    const updatedTwin = { ...twin, ...updates, updatedAt: new Date() };
    this.digitalTwins.set(id, updatedTwin);
    return updatedTwin;
  }

  async deleteDigitalTwin(id: number): Promise<boolean> {
    return this.digitalTwins.delete(id);
  }

  // IoT Device operations
  async getIoTDevice(id: number): Promise<IoTDevice | undefined> {
    return this.iotDevices.get(id);
  }

  async getIoTDevicesByTwin(twinId: number): Promise<IoTDevice[]> {
    return Array.from(this.iotDevices.values()).filter(
      (device) => device.twinId === twinId,
    );
  }

  async createIoTDevice(insertDevice: InsertIoTDevice): Promise<IoTDevice> {
    const id = this.currentId++;
    const now = new Date();
    const device: IoTDevice = { 
      ...insertDevice, 
      id, 
      status: "connected",
      createdAt: now,
      updatedAt: now 
    };
    this.iotDevices.set(id, device);
    return device;
  }

  async updateIoTDevice(id: number, updates: Partial<IoTDevice>): Promise<IoTDevice | undefined> {
    const device = this.iotDevices.get(id);
    if (!device) return undefined;
    
    const updatedDevice = { ...device, ...updates, updatedAt: new Date() };
    this.iotDevices.set(id, updatedDevice);
    return updatedDevice;
  }

  async deleteIoTDevice(id: number): Promise<boolean> {
    return this.iotDevices.delete(id);
  }

  // Workflow operations
  async getWorkflow(id: number): Promise<Workflow | undefined> {
    return this.workflows.get(id);
  }

  async getWorkflowsByTwin(twinId: number): Promise<Workflow[]> {
    return Array.from(this.workflows.values()).filter(
      (workflow) => workflow.twinId === twinId,
    );
  }

  async createWorkflow(insertWorkflow: InsertWorkflow): Promise<Workflow> {
    const id = this.currentId++;
    const now = new Date();
    const workflow: Workflow = { 
      ...insertWorkflow, 
      id, 
      isActive: true,
      createdAt: now,
      updatedAt: now 
    };
    this.workflows.set(id, workflow);
    return workflow;
  }

  async updateWorkflow(id: number, updates: Partial<Workflow>): Promise<Workflow | undefined> {
    const workflow = this.workflows.get(id);
    if (!workflow) return undefined;
    
    const updatedWorkflow = { ...workflow, ...updates, updatedAt: new Date() };
    this.workflows.set(id, updatedWorkflow);
    return updatedWorkflow;
  }

  async deleteWorkflow(id: number): Promise<boolean> {
    return this.workflows.delete(id);
  }

  // API Connection operations
  async getApiConnection(id: number): Promise<ApiConnection | undefined> {
    return this.apiConnections.get(id);
  }

  async getApiConnectionsByTwin(twinId: number): Promise<ApiConnection[]> {
    return Array.from(this.apiConnections.values()).filter(
      (connection) => connection.twinId === twinId,
    );
  }

  async createApiConnection(insertConnection: InsertApiConnection): Promise<ApiConnection> {
    const id = this.currentId++;
    const now = new Date();
    const connection: ApiConnection = { 
      ...insertConnection, 
      id, 
      status: "connected",
      lastTest: null,
      createdAt: now 
    };
    this.apiConnections.set(id, connection);
    return connection;
  }

  async updateApiConnection(id: number, updates: Partial<ApiConnection>): Promise<ApiConnection | undefined> {
    const connection = this.apiConnections.get(id);
    if (!connection) return undefined;
    
    const updatedConnection = { ...connection, ...updates };
    this.apiConnections.set(id, updatedConnection);
    return updatedConnection;
  }

  async deleteApiConnection(id: number): Promise<boolean> {
    return this.apiConnections.delete(id);
  }
}

export const storage = new MemStorage();
