import { useEffect, useState } from "react";
import { Network, Database, GitBranch, Search, Filter, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface GraphNode {
  id: string;
  label: string;
  type: 'document' | 'concept' | 'entity';
  connections: number;
  relevance: number;
}

interface GraphConnection {
  source: string;
  target: string;
  strength: number;
  type: string;
}

const KnowledgeGraph = () => {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [connections, setConnections] = useState<GraphConnection[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [graphStats, setGraphStats] = useState({
    totalNodes: 0,
    totalConnections: 0,
    avgConnectivity: 0,
    clusters: 0
  });

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        // Fetch GitHub repositories to create a knowledge graph
        const response = await fetch('https://api.github.com/search/repositories?q=artificial+intelligence&sort=stars&order=desc&per_page=20');
        const data = await response.json();
        
        const graphNodes: GraphNode[] = data.items?.map((repo: any, index: number) => ({
          id: repo.id.toString(),
          label: repo.name,
          type: index % 3 === 0 ? 'document' : index % 3 === 1 ? 'concept' : 'entity',
          connections: Math.floor(repo.stargazers_count / 1000) + 1,
          relevance: Math.min(100, repo.stargazers_count / 100)
        })) || [];

        // Create connections between related repositories
        const graphConnections: GraphConnection[] = [];
        for (let i = 0; i < graphNodes.length; i++) {
          for (let j = i + 1; j < Math.min(i + 3, graphNodes.length); j++) {
            graphConnections.push({
              source: graphNodes[i].id,
              target: graphNodes[j].id,
              strength: Math.random() * 100,
              type: Math.random() > 0.5 ? 'semantic' : 'contextual'
            });
          }
        }

        setNodes(graphNodes);
        setConnections(graphConnections);
        
        setGraphStats({
          totalNodes: graphNodes.length,
          totalConnections: graphConnections.length,
          avgConnectivity: graphNodes.reduce((sum, node) => sum + node.connections, 0) / graphNodes.length,
          clusters: Math.floor(graphNodes.length / 4)
        });

      } catch (error) {
        console.error('Error fetching graph data:', error);
      }
    };

    fetchGraphData();
    const interval = setInterval(fetchGraphData, 60000);
    return () => clearInterval(interval);
  }, []);

  const filteredNodes = nodes.filter(node => 
    node.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getNodeTypeColor = (type: string) => {
    switch (type) {
      case 'document': return 'bg-primary/20 text-primary border-primary/30';
      case 'concept': return 'bg-secondary/20 text-secondary border-secondary/30';
      case 'entity': return 'bg-accent/20 text-accent border-accent/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Knowledge Graph</h2>
          <p className="text-muted-foreground">Visualize document relationships and entity connections</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Graph Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-glass/30 border-glass backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Database className="w-4 h-4 mr-2" />
              Total Nodes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{graphStats.totalNodes}</div>
            <p className="text-xs text-muted-foreground">Active entities</p>
          </CardContent>
        </Card>

        <Card className="bg-glass/30 border-glass backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <GitBranch className="w-4 h-4 mr-2" />
              Connections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{graphStats.totalConnections}</div>
            <p className="text-xs text-muted-foreground">Relationship links</p>
          </CardContent>
        </Card>

        <Card className="bg-glass/30 border-glass backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Network className="w-4 h-4 mr-2" />
              Avg Connectivity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{graphStats.avgConnectivity.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Connections per node</p>
          </CardContent>
        </Card>

        <Card className="bg-glass/30 border-glass backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Clusters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{graphStats.clusters}</div>
            <p className="text-xs text-muted-foreground">Topic groups</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph Visualization */}
        <Card className="lg:col-span-2 bg-glass/30 border-glass backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Network className="w-5 h-5 mr-2" />
              Graph Visualization
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search nodes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="min-h-[400px] bg-background/50 rounded-lg p-4 relative overflow-hidden">
              {/* Simulated Graph Visualization */}
              <div className="grid grid-cols-6 gap-4 h-full">
                {filteredNodes.slice(0, 18).map((node, index) => (
                  <div
                    key={node.id}
                    className={`p-2 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${getNodeTypeColor(node.type)} ${
                      selectedNode?.id === node.id ? 'ring-2 ring-primary' : ''
                    }`}
                    style={{
                      transform: `translate(${(index % 3) * 10}px, ${Math.floor(index / 3) * 5}px)`
                    }}
                    onClick={() => setSelectedNode(node)}
                  >
                    <div className="text-xs font-medium truncate">{node.label}</div>
                    <div className="text-xs opacity-70">{node.connections} links</div>
                  </div>
                ))}
              </div>
              
              {/* Connection Lines */}
              <svg className="absolute inset-0 pointer-events-none">
                {connections.slice(0, 10).map((conn, index) => (
                  <line
                    key={index}
                    x1={`${(index % 6) * 16.67}%`}
                    y1={`${Math.floor(index / 6) * 25}%`}
                    x2={`${((index + 1) % 6) * 16.67}%`}
                    y2={`${Math.floor((index + 1) / 6) * 25}%`}
                    stroke="hsl(var(--primary))"
                    strokeWidth="1"
                    opacity="0.3"
                  />
                ))}
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Node Details */}
        <Card className="bg-glass/30 border-glass backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Node Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedNode ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">{selectedNode.label}</h3>
                  <Badge className={getNodeTypeColor(selectedNode.type)}>
                    {selectedNode.type}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Connections</span>
                    <span className="font-medium">{selectedNode.connections}</span>
                  </div>
                  <Progress value={selectedNode.connections * 5} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Relevance Score</span>
                    <span className="font-medium">{selectedNode.relevance.toFixed(1)}%</span>
                  </div>
                  <Progress value={selectedNode.relevance} className="h-2" />
                </div>

                <div className="pt-2">
                  <h4 className="text-sm font-medium mb-2">Connected Entities</h4>
                  <div className="space-y-1">
                    {nodes.slice(0, 3).map((node) => (
                      <div key={node.id} className="text-xs text-muted-foreground">
                        → {node.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Network className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Select a node to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KnowledgeGraph;