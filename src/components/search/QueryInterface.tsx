import { useState } from "react";
import { Search, Filter, Sparkles, Database, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const QueryInterface = () => {
  const [query, setQuery] = useState("");
  const [searchMode, setSearchMode] = useState("hybrid");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    // Simulate search delay
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-glass/30 border-glass backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Advanced Query Engine
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                placeholder="Ask anything about your documents..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pr-12 h-12 text-lg bg-background/50"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>
            <Button 
              onClick={handleSearch} 
              className="h-12 px-8"
              disabled={isLoading || !query.trim()}
            >
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>

          <Tabs value={searchMode} onValueChange={setSearchMode} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="semantic" className="gap-2">
                <Sparkles className="w-4 h-4" />
                Semantic
              </TabsTrigger>
              <TabsTrigger value="hybrid" className="gap-2">
                <Database className="w-4 h-4" />
                Hybrid
              </TabsTrigger>
              <TabsTrigger value="graph" className="gap-2">
                <FileText className="w-4 h-4" />
                Graph
              </TabsTrigger>
            </TabsList>
            <TabsContent value="semantic" className="mt-4">
              <p className="text-sm text-muted-foreground">
                AI-powered semantic understanding for contextual matches
              </p>
            </TabsContent>
            <TabsContent value="hybrid" className="mt-4">
              <p className="text-sm text-muted-foreground">
                Combines semantic, keyword, and graph-based search for optimal results
              </p>
            </TabsContent>
            <TabsContent value="graph" className="mt-4">
              <p className="text-sm text-muted-foreground">
                Relationship-based search through document knowledge graphs
              </p>
            </TabsContent>
          </Tabs>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Document Type: All</Badge>
            <Badge variant="secondary">Date Range: Any</Badge>
            <Badge variant="secondary">Confidence: &gt;85%</Badge>
            <Button variant="ghost" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Advanced Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results would go here */}
      {isLoading && (
        <Card className="bg-glass/30 border-glass backdrop-blur-xl">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Processing your query with advanced AI...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QueryInterface;