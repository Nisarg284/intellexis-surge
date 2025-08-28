import { useEffect, useState } from "react";
import { Brain, Zap, TrendingUp, Settings, Play, Pause, RotateCcw, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";

interface AIModel {
  id: string;
  name: string;
  type: 'embedding' | 'llm' | 'reranker';
  status: 'active' | 'inactive' | 'loading';
  performance: number;
  cost: number;
  latency: number;
  accuracy: number;
  version: string;
}

const AIModels = () => {
  const [models, setModels] = useState<AIModel[]>([]);
  const [systemStats, setSystemStats] = useState({
    totalModels: 0,
    activeModels: 0,
    avgLatency: 0,
    totalCost: 0
  });

  useEffect(() => {
    const fetchModelData = async () => {
      try {
        // Fetch real data from OpenAI models API (using jsonplaceholder as mock)
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const users = await response.json();
        
        const mockModels: AIModel[] = users.slice(0, 8).map((user: any, index: number) => ({
          id: user.id.toString(),
          name: [
            'GPT-4-Turbo', 'Claude-3-Opus', 'Gemini-Pro', 'LLaMA-2-70B',
            'BERT-Large', 'RoBERTa-Base', 'T5-11B', 'PaLM-2'
          ][index],
          type: index < 3 ? 'llm' : index < 6 ? 'embedding' : 'reranker',
          status: index % 3 === 0 ? 'active' : index % 3 === 1 ? 'inactive' : 'loading',
          performance: Math.floor(Math.random() * 40) + 70,
          cost: Math.random() * 0.01 + 0.001,
          latency: Math.floor(Math.random() * 500) + 100,
          accuracy: Math.floor(Math.random() * 20) + 85,
          version: `v${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}`
        }));

        setModels(mockModels);
        
        setSystemStats({
          totalModels: mockModels.length,
          activeModels: mockModels.filter(m => m.status === 'active').length,
          avgLatency: mockModels.reduce((sum, m) => sum + m.latency, 0) / mockModels.length,
          totalCost: mockModels.reduce((sum, m) => sum + m.cost, 0)
        });

      } catch (error) {
        console.error('Error fetching model data:', error);
      }
    };

    fetchModelData();
    const interval = setInterval(fetchModelData, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleModelStatus = (modelId: string) => {
    setModels(prev => prev.map(model => 
      model.id === modelId 
        ? { ...model, status: model.status === 'active' ? 'inactive' : 'active' }
        : model
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/20 text-success border-success/30';
      case 'inactive': return 'bg-muted/20 text-muted-foreground border-muted/30';
      case 'loading': return 'bg-warning/20 text-warning border-warning/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'llm': return 'bg-primary/20 text-primary';
      case 'embedding': return 'bg-secondary/20 text-secondary';
      case 'reranker': return 'bg-accent/20 text-accent';
      default: return 'bg-muted/20 text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Model Management</h2>
          <p className="text-muted-foreground">Monitor and configure AI models for optimal performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Metrics
          </Button>
          <Button size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-glass/30 border-glass backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Brain className="w-4 h-4 mr-2" />
              Total Models
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalModels}</div>
            <p className="text-xs text-muted-foreground">Deployed models</p>
          </CardContent>
        </Card>

        <Card className="bg-glass/30 border-glass backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Active Models
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{systemStats.activeModels}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card className="bg-glass/30 border-glass backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.avgLatency.toFixed(0)}ms</div>
            <p className="text-xs text-muted-foreground">Response time</p>
          </CardContent>
        </Card>

        <Card className="bg-glass/30 border-glass backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${systemStats.totalCost.toFixed(4)}</div>
            <p className="text-xs text-muted-foreground">Per query</p>
          </CardContent>
        </Card>
      </div>

      {/* Model Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {models.map((model) => (
          <Card key={model.id} className="bg-glass/30 border-glass backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-lg">{model.name}</CardTitle>
                  <Badge className={getTypeColor(model.type)}>
                    {model.type.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(model.status)}>
                    {model.status}
                  </Badge>
                  <Switch
                    checked={model.status === 'active'}
                    onCheckedChange={() => toggleModelStatus(model.id)}
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Version {model.version}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Performance</span>
                    <span className="text-sm font-medium">{model.performance}%</span>
                  </div>
                  <Progress value={model.performance} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Accuracy</span>
                    <span className="text-sm font-medium">{model.accuracy}%</span>
                  </div>
                  <Progress value={model.accuracy} className="h-2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Latency</span>
                  <span className="font-medium">{model.latency}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cost</span>
                  <span className="font-medium">${model.cost.toFixed(4)}</span>
                </div>
              </div>

              <div className="flex justify-between pt-2 border-t border-glass">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    {model.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button variant="outline" size="sm">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Chart */}
      <Card className="bg-glass/30 border-glass backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Performance Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-background/50 rounded-lg p-4 flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">Performance chart visualization</p>
              <p className="text-sm text-muted-foreground mt-1">Real-time model metrics and trends</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIModels;