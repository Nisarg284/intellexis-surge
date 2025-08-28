import { useEffect, useState } from "react";
import { Shield, Users, Eye, AlertTriangle, Lock, Key, Activity, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SecurityEvent {
  id: string;
  type: 'login' | 'access' | 'alert' | 'permission';
  user: string;
  action: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  lastAccess: Date;
  permissions: string[];
  status: 'active' | 'inactive' | 'suspended';
}

const SecurityCenter = () => {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [securityScore, setSecurityScore] = useState(87);
  const [alerts, setAlerts] = useState(3);

  useEffect(() => {
    const fetchSecurityData = async () => {
      try {
        // Fetch user data
        const usersResponse = await fetch('https://jsonplaceholder.typicode.com/users');
        const usersData = await usersResponse.json();
        
        // Fetch posts for security events
        const eventsResponse = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10');
        const eventsData = await eventsResponse.json();
        
        const mockUsers: User[] = usersData.slice(0, 8).map((user: any) => ({
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: ['Admin', 'Analyst', 'Viewer', 'Editor'][Math.floor(Math.random() * 4)],
          lastAccess: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          permissions: ['read', 'write', 'delete'].slice(0, Math.floor(Math.random() * 3) + 1),
          status: ['active', 'inactive', 'suspended'][Math.floor(Math.random() * 3)] as any
        }));

        const mockEvents: SecurityEvent[] = eventsData.map((post: any) => ({
          id: post.id.toString(),
          type: ['login', 'access', 'alert', 'permission'][Math.floor(Math.random() * 4)] as any,
          user: mockUsers[Math.floor(Math.random() * mockUsers.length)].name,
          action: post.title.substring(0, 50) + '...',
          timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
          severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
          location: ['New York', 'London', 'Tokyo', 'Sydney'][Math.floor(Math.random() * 4)]
        }));

        setUsers(mockUsers);
        setSecurityEvents(mockEvents);

      } catch (error) {
        console.error('Error fetching security data:', error);
      }
    };

    fetchSecurityData();
    const interval = setInterval(fetchSecurityData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-500 border-orange-500/30';
      case 'critical': return 'bg-red-500/20 text-red-500 border-red-500/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/20 text-success';
      case 'inactive': return 'bg-muted/20 text-muted-foreground';
      case 'suspended': return 'bg-destructive/20 text-destructive';
      default: return 'bg-muted/20 text-muted-foreground';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login': return <UserCheck className="w-4 h-4" />;
      case 'access': return <Eye className="w-4 h-4" />;
      case 'alert': return <AlertTriangle className="w-4 h-4" />;
      case 'permission': return <Key className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Security Center</h2>
          <p className="text-muted-foreground">Monitor access control, audit logs, and security events</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Activity className="w-4 h-4 mr-2" />
            Audit Log
          </Button>
          <Button size="sm">
            <Shield className="w-4 h-4 mr-2" />
            Security Scan
          </Button>
        </div>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-glass/30 border-glass backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Security Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{securityScore}%</div>
            <Progress value={securityScore} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-1">Overall security health</p>
          </CardContent>
        </Card>

        <Card className="bg-glass/30 border-glass backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => u.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">Currently online</p>
          </CardContent>
        </Card>

        <Card className="bg-glass/30 border-glass backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Security Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{alerts}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card className="bg-glass/30 border-glass backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Lock className="w-4 h-4 mr-2" />
              Failed Logins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Alerts */}
      {alerts > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>
                <strong>{alerts} security alerts</strong> require immediate attention
              </span>
              <Button variant="outline" size="sm">
                Review Alerts
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Security Events */}
        <Card className="bg-glass/30 border-glass backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Recent Security Events
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {securityEvents.slice(0, 6).map((event) => (
              <div key={event.id} className="flex items-start space-x-3 p-3 rounded-lg border border-glass bg-background/30">
                <div className="flex items-center space-x-2">
                  {getEventIcon(event.type)}
                  <Badge className={getSeverityColor(event.severity)}>
                    {event.severity}
                  </Badge>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{event.user}</div>
                  <div className="text-sm text-muted-foreground truncate">
                    {event.action}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {event.timestamp.toLocaleString()} • {event.location}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* User Access Management */}
        <Card className="bg-glass/30 border-glass backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                User Access
              </span>
              <Button variant="outline" size="sm">
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {users.slice(0, 6).map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border border-glass bg-background/30">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                    <div className="text-xs text-muted-foreground">
                      Last access: {user.lastAccess.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(user.status)}>
                    {user.status}
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1">{user.role}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Security Metrics */}
      <Card className="bg-glass/30 border-glass backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Security Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Authentication Success Rate</span>
                <span className="font-medium">98.7%</span>
              </div>
              <Progress value={98.7} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Data Encryption Coverage</span>
                <span className="font-medium">100%</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Access Control Compliance</span>
                <span className="font-medium">94.2%</span>
              </div>
              <Progress value={94.2} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityCenter;