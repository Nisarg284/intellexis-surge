import { useState } from "react";
import { Settings as SettingsIcon, Save, RotateCcw, Database, Zap, Shield, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";

const Settings = () => {
  const [settings, setSettings] = useState({
    // General Settings
    systemName: "IntelliRAG",
    apiTimeout: 30,
    maxConcurrentQueries: 10,
    debugMode: false,
    
    // Performance Settings
    cacheEnabled: true,
    cacheSize: 1024,
    vectorDimensions: 1536,
    chunkSize: 512,
    chunkOverlap: 50,
    
    // Security Settings
    authRequired: true,
    sessionTimeout: 60,
    maxLoginAttempts: 3,
    encryptionEnabled: true,
    
    // Notification Settings
    emailNotifications: true,
    slackNotifications: false,
    webhookUrl: "",
    alertThreshold: 95
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    console.log('Saving settings:', settings);
    // In a real app, this would save to the backend
  };

  const resetSettings = () => {
    setSettings({
      systemName: "IntelliRAG",
      apiTimeout: 30,
      maxConcurrentQueries: 10,
      debugMode: false,
      cacheEnabled: true,
      cacheSize: 1024,
      vectorDimensions: 1536,
      chunkSize: 512,
      chunkOverlap: 50,
      authRequired: true,
      sessionTimeout: 60,
      maxLoginAttempts: 3,
      encryptionEnabled: true,
      emailNotifications: true,
      slackNotifications: false,
      webhookUrl: "",
      alertThreshold: 95
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">System Settings</h2>
          <p className="text-muted-foreground">Configure system behavior and preferences</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={resetSettings}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button size="sm" onClick={saveSettings}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="bg-glass/30 border-glass backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <SettingsIcon className="w-5 h-5 mr-2" />
                General Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="systemName">System Name</Label>
                  <Input
                    id="systemName"
                    value={settings.systemName}
                    onChange={(e) => handleSettingChange('systemName', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="apiTimeout">API Timeout (seconds)</Label>
                  <Input
                    id="apiTimeout"
                    type="number"
                    value={settings.apiTimeout}
                    onChange={(e) => handleSettingChange('apiTimeout', parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxQueries">Max Concurrent Queries</Label>
                  <Input
                    id="maxQueries"
                    type="number"
                    value={settings.maxConcurrentQueries}
                    onChange={(e) => handleSettingChange('maxConcurrentQueries', parseInt(e.target.value))}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="debugMode"
                    checked={settings.debugMode}
                    onCheckedChange={(checked) => handleSettingChange('debugMode', checked)}
                  />
                  <Label htmlFor="debugMode">Enable Debug Mode</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="bg-glass/30 border-glass backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Performance Optimization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="cacheEnabled"
                    checked={settings.cacheEnabled}
                    onCheckedChange={(checked) => handleSettingChange('cacheEnabled', checked)}
                  />
                  <Label htmlFor="cacheEnabled">Enable Caching</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cacheSize">Cache Size (MB)</Label>
                  <Input
                    id="cacheSize"
                    type="number"
                    value={settings.cacheSize}
                    onChange={(e) => handleSettingChange('cacheSize', parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vectorDims">Vector Dimensions</Label>
                  <Select
                    value={settings.vectorDimensions.toString()}
                    onValueChange={(value) => handleSettingChange('vectorDimensions', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="384">384</SelectItem>
                      <SelectItem value="768">768</SelectItem>
                      <SelectItem value="1536">1536</SelectItem>
                      <SelectItem value="3072">3072</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Chunk Size: {settings.chunkSize} tokens</Label>
                  <Slider
                    value={[settings.chunkSize]}
                    onValueChange={(value) => handleSettingChange('chunkSize', value[0])}
                    min={128}
                    max={2048}
                    step={64}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Chunk Overlap: {settings.chunkOverlap} tokens</Label>
                  <Slider
                    value={[settings.chunkOverlap]}
                    onValueChange={(value) => handleSettingChange('chunkOverlap', value[0])}
                    min={0}
                    max={200}
                    step={10}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="bg-glass/30 border-glass backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Security Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="authRequired"
                    checked={settings.authRequired}
                    onCheckedChange={(checked) => handleSettingChange('authRequired', checked)}
                  />
                  <Label htmlFor="authRequired">Require Authentication</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="encryptionEnabled"
                    checked={settings.encryptionEnabled}
                    onCheckedChange={(checked) => handleSettingChange('encryptionEnabled', checked)}
                  />
                  <Label htmlFor="encryptionEnabled">Enable Encryption</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-glass/30 border-glass backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="emailNotifs"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                  />
                  <Label htmlFor="emailNotifs">Email Notifications</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="slackNotifs"
                    checked={settings.slackNotifications}
                    onCheckedChange={(checked) => handleSettingChange('slackNotifications', checked)}
                  />
                  <Label htmlFor="slackNotifs">Slack Notifications</Label>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    placeholder="https://hooks.slack.com/services/..."
                    value={settings.webhookUrl}
                    onChange={(e) => handleSettingChange('webhookUrl', e.target.value)}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Alert Threshold: {settings.alertThreshold}%</Label>
                  <Slider
                    value={[settings.alertThreshold]}
                    onValueChange={(value) => handleSettingChange('alertThreshold', value[0])}
                    min={80}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;