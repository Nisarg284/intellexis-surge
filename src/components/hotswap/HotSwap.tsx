import { useEffect, useState } from "react";
import { Zap, Upload, Download, CheckCircle, AlertTriangle, Clock, GitBranch, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Deployment {
  id: string;
  component: string;
  version: string;
  status: 'pending' | 'deploying' | 'success' | 'failed' | 'rollback';
  progress: number;
  timestamp: Date;
  metrics: {
    responseTime: number;
    errorRate: number;
    throughput: number;
  };
}

interface SystemHealth {
  overall: number;
  components: {
    database: number;
    api: number;
    cache: number;
    ml: number;
  };
}

const HotSwap = () => {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    overall: 98.5,
    components: { database: 99.2, api: 97.8, cache: 98.9, ml: 96.5 }
  });
  const [activeDeployment, setActiveDeployment] = useState<Deployment | null>(null);

  useEffect(() => {
    const fetchDeployments = async () => {
      try {
        // Fetch deployment data from GitHub commits API
        const response = await fetch('https://api.github.com/repos/microsoft/vscode/commits?per_page=6');
        const commits = await response.json();
        
        const mockDeployments: Deployment[] = commits.map((commit: any, index: number) => ({
          id: commit.sha.substring(0, 8),
          component: ['ML Pipeline', 'Vector DB', 'API Gateway', 'Cache Layer', 'Search Engine', 'Auth Service'][index],
          version: `v${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
          status: ['success', 'deploying', 'pending', 'failed', 'rollback'][Math.floor(Math.random() * 5)] as any,
          progress: Math.floor(Math.random() * 100),
          timestamp: new Date(commit.commit.author.date),
          metrics: {
            responseTime: Math.floor(Math.random() * 200) + 50,
            errorRate: Math.random() * 2,
            throughput: Math.floor(Math.random() * 1000) + 500
          }
        }));

        setDeployments(mockDeployments);
        
        // Find active deployment
        const active = mockDeployments.find(d => d.status === 'deploying');
        setActiveDeployment(active || null);

      } catch (error) {
        console.error('Error fetching deployment data:', error);
      }
    };

    fetchDeployments();
    const interval = setInterval(fetchDeployments, 10000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-success/20 text-success border-success/30';
      case 'deploying': return 'bg-warning/20 text-warning border-warning/30';
      case 'pending': return 'bg-muted/20 text-muted-foreground border-muted/30';
      case 'failed': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'rollback': return 'bg-orange-500/20 text-orange-500 border-orange-500/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'deploying': return <Clock className="w-4 h-4 animate-spin" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <AlertTriangle className="w-4 h-4" />;
      case 'rollback': return <GitBranch className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const initiateDeployment = () => {
    const newDeployment: Deployment = {
      id: Math.random().toString(36).substring(2, 10),
      component: 'ML Pipeline',
      version: 'v2.1.0',
      status: 'deploying',
      progress: 0,
      timestamp: new Date(),
      metrics: {
        responseTime: 0,
        errorRate: 0,
        throughput: 0
      }
    };
    
    setDeployments(prev => [newDeployment, ...prev]);
    setActiveDeployment(newDeployment);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Hot Swap Deployment</h2>
          <p className="text-muted-foreground">Zero-downtime component updates and rollbacks</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <GitBranch className="w-4 h-4 mr-2" />
            Rollback
          </Button>
          <Button size="sm" onClick={initiateDeployment}>
            <Zap className="w-4 h-4 mr-2" />
            Deploy
          </Button>
        </div>
      </div>

      {/* System Health */}
      <Card className="bg-glass/30 border-glass backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-success" />
            System Health Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{systemHealth.overall}%</div>
              <p className="text-sm text-muted-foreground">Overall Health</p>
              <Progress value={systemHealth.overall} className="mt-2 h-2" />
            </div>
            {Object.entries(systemHealth.components).map(([component, health]) => (
              <div key={component} className="text-center">
                <div className="text-lg font-semibold">{health}%</div>
                <p className="text-sm text-muted-foreground capitalize">{component}</p>
                <Progress value={health} className="mt-2 h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Deployment */}
      {activeDeployment && (
        <Alert>
          <Zap className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>
                Deploying <strong>{activeDeployment.component}</strong> {activeDeployment.version}
              </span>
              <div className="flex items-center space-x-2">
                <Progress value={activeDeployment.progress} className="w-32 h-2" />
                <span className="text-sm">{activeDeployment.progress}%</span>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deployment History */}
        <Card className="bg-glass/30 border-glass backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <GitBranch className="w-5 h-5 mr-2" />
                Recent Deployments
              </span>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                New Deploy
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {deployments.map((deployment) => (
              <div key={deployment.id} className="flex items-center justify-between p-3 rounded-lg border border-glass bg-background/30">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(deployment.status)}
                    <Badge className={getStatusColor(deployment.status)}>
                      {deployment.status}
                    </Badge>
                  </div>
                  <div>
                    <div className="font-medium">{deployment.component}</div>
                    <div className="text-sm text-muted-foreground">{deployment.version}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{deployment.id}</div>
                  <div className="text-xs text-muted-foreground">
                    {deployment.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Deployment Metrics */}
        <Card className="bg-glass/30 border-glass backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ArrowRight className="w-5 h-5 mr-2" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {deployments.slice(0, 4).map((deployment) => (
              <div key={deployment.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{deployment.component}</span>
                  <Badge variant="outline">{deployment.version}</Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Response Time</div>
                    <div className="font-medium">{deployment.metrics.responseTime}ms</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Error Rate</div>
                    <div className="font-medium">{deployment.metrics.errorRate.toFixed(2)}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Throughput</div>
                    <div className="font-medium">{deployment.metrics.throughput}/s</div>
                  </div>
                </div>
                
                {deployment.status === 'deploying' && (
                  <Progress value={deployment.progress} className="h-2" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Deployment Pipeline */}
      <Card className="bg-glass/30 border-glass backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Download className="w-5 h-5 mr-2" />
            Deployment Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
            <div className="flex items-center space-x-8">
              {['Build', 'Test', 'Stage', 'Deploy', 'Verify'].map((stage, index) => (
                <div key={stage} className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index < 3 ? 'bg-success text-success-foreground' : 
                    index === 3 ? 'bg-warning text-warning-foreground' : 
                    'bg-muted text-muted-foreground'
                  }`}>
                    {index < 3 ? <CheckCircle className="w-4 h-4" /> : 
                     index === 3 ? <Clock className="w-4 h-4 animate-spin" /> : 
                     <Clock className="w-4 h-4" />}
                  </div>
                  <span className="text-sm font-medium">{stage}</span>
                  {index < 4 && <ArrowRight className="w-4 h-4 text-muted-foreground ml-4" />}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HotSwap;