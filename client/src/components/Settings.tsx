import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Database, 
  Save,
  Eye,
  EyeOff,
  Key,
  Globe,
  Zap,
  Clock,
  Cloud
} from "lucide-react";

const Settings = () => {
  const { toast } = useToast();
  const [showApiKey, setShowApiKey] = useState(false);
  
  const [userSettings, setUserSettings] = useState({
    name: "John Doe",
    email: "john.doe@company.com",
    role: "Digital Twin Architect",
    timezone: "UTC-5",
    language: "en"
  });

  const [systemSettings, setSystemSettings] = useState({
    autoBackup: true,
    realTimeSync: true,
    darkMode: true,
    notifications: true,
    analyticsCollection: true,
    performanceMonitoring: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
    apiKeyVisible: false,
    auditLogging: true
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    });
  };

  const handleToggle = (category: string, setting: string) => {
    if (category === "system") {
      setSystemSettings(prev => ({
        ...prev,
        [setting]: !prev[setting as keyof typeof prev]
      }));
    } else if (category === "security") {
      setSecuritySettings(prev => ({
        ...prev,
        [setting]: !prev[setting as keyof typeof prev]
      }));
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="text-muted-foreground">
            Configure your Stahiki platform preferences and system settings
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                User Profile
              </CardTitle>
              <CardDescription>
                Manage your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={userSettings.name}
                      onChange={(e) => setUserSettings(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userSettings.email}
                      onChange={(e) => setUserSettings(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={userSettings.role}
                      onChange={(e) => setUserSettings(prev => ({ ...prev, role: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select 
                      value={userSettings.timezone} 
                      onValueChange={(value) => setUserSettings(prev => ({ ...prev, timezone: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                        <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                        <SelectItem value="UTC+0">GMT (UTC+0)</SelectItem>
                        <SelectItem value="UTC+1">Central European Time (UTC+1)</SelectItem>
                        <SelectItem value="UTC+9">Japan Standard Time (UTC+9)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select 
                      value={userSettings.language} 
                      onValueChange={(value) => setUserSettings(prev => ({ ...prev, language: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4">
                    <div className="p-4 bg-accent/50 rounded-lg">
                      <h4 className="font-medium mb-2">Account Status</h4>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-success/20 text-success">Enterprise Plan</Badge>
                        <Badge variant="outline">Verified</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5" />
                System Configuration
              </CardTitle>
              <CardDescription>
                Configure system-wide settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Auto Backup</Label>
                      <div className="text-sm text-muted-foreground">
                        Automatically backup digital twins daily
                      </div>
                    </div>
                    <Switch
                      checked={systemSettings.autoBackup}
                      onCheckedChange={() => handleToggle("system", "autoBackup")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Real-time Sync</Label>
                      <div className="text-sm text-muted-foreground">
                        Sync data in real-time across all twins
                      </div>
                    </div>
                    <Switch
                      checked={systemSettings.realTimeSync}
                      onCheckedChange={() => handleToggle("system", "realTimeSync")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Dark Mode</Label>
                      <div className="text-sm text-muted-foreground">
                        Use dark theme for the interface
                      </div>
                    </div>
                    <Switch
                      checked={systemSettings.darkMode}
                      onCheckedChange={() => handleToggle("system", "darkMode")}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Performance Monitoring</Label>
                      <div className="text-sm text-muted-foreground">
                        Monitor system performance metrics
                      </div>
                    </div>
                    <Switch
                      checked={systemSettings.performanceMonitoring}
                      onCheckedChange={() => handleToggle("system", "performanceMonitoring")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Analytics Collection</Label>
                      <div className="text-sm text-muted-foreground">
                        Collect usage analytics for insights
                      </div>
                    </div>
                    <Switch
                      checked={systemSettings.analyticsCollection}
                      onCheckedChange={() => handleToggle("system", "analyticsCollection")}
                    />
                  </div>

                  <div>
                    <Label htmlFor="cache-size">Cache Size (MB)</Label>
                    <Input
                      id="cache-size"
                      type="number"
                      defaultValue="512"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your account security and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Two-Factor Authentication</Label>
                    <div className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </div>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={() => handleToggle("security", "twoFactorAuth")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Audit Logging</Label>
                    <div className="text-sm text-muted-foreground">
                      Keep detailed logs of all system activities
                    </div>
                  </div>
                  <Switch
                    checked={securitySettings.auditLogging}
                    onCheckedChange={() => handleToggle("security", "auditLogging")}
                  />
                </div>

                <div>
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Select 
                    value={securitySettings.sessionTimeout} 
                    onValueChange={(value) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="480">8 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="api-key">API Key</Label>
                  <div className="flex mt-1">
                    <Input
                      id="api-key"
                      type={showApiKey ? "text" : "password"}
                      value="sk-1234567890abcdef1234567890abcdef"
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-2"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button variant="outline" size="sm" className="ml-2">
                      <Key className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                {[
                  {
                    title: "System Alerts",
                    description: "Critical system failures and errors",
                    email: true,
                    push: true,
                    sms: false
                  },
                  {
                    title: "Performance Warnings",
                    description: "Performance degradation and threshold alerts",
                    email: true,
                    push: true,
                    sms: false
                  },
                  {
                    title: "IoT Device Status",
                    description: "Device connections and disconnections",
                    email: false,
                    push: true,
                    sms: false
                  },
                  {
                    title: "Workflow Completion",
                    description: "Automation workflow status updates",
                    email: true,
                    push: false,
                    sms: false
                  },
                  {
                    title: "Maintenance Reminders",
                    description: "Scheduled maintenance and updates",
                    email: true,
                    push: false,
                    sms: false
                  }
                ].map((notification, index) => (
                  <div key={index} className="space-y-3">
                    <div>
                      <h4 className="font-medium">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground">{notification.description}</p>
                    </div>
                    <div className="flex gap-6">
                      <div className="flex items-center space-x-2">
                        <Switch defaultChecked={notification.email} />
                        <Label className="text-sm">Email</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch defaultChecked={notification.push} />
                        <Label className="text-sm">Push</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch defaultChecked={notification.sms} />
                        <Label className="text-sm">SMS</Label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                External Integrations
              </CardTitle>
              <CardDescription>
                Manage connections to external services and platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    name: "AWS IoT Core",
                    description: "Connect to AWS IoT services",
                    status: "connected",
                    icon: Cloud
                  },
                  {
                    name: "Microsoft Azure",
                    description: "Azure Digital Twins integration",
                    status: "disconnected",
                    icon: Database
                  },
                  {
                    name: "SAP Integration",
                    description: "Enterprise resource planning",
                    status: "connected",
                    icon: Database
                  },
                  {
                    name: "Slack Notifications",
                    description: "Team collaboration alerts",
                    status: "connected",
                    icon: Bell
                  }
                ].map((integration, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <integration.icon className="w-5 h-5" />
                        <div>
                          <h4 className="font-medium">{integration.name}</h4>
                          <p className="text-sm text-muted-foreground">{integration.description}</p>
                        </div>
                      </div>
                      <Badge 
                        variant={integration.status === "connected" ? "default" : "secondary"}
                      >
                        {integration.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        {integration.status === "connected" ? "Configure" : "Connect"}
                      </Button>
                      {integration.status === "connected" && (
                        <Button variant="outline" size="sm">
                          Test
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;