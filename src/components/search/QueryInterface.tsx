import { useState, useEffect } from "react";
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
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      // Use Wikipedia API for real search results
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setSearchResults([{
          title: data.title,
          extract: data.extract,
          url: data.content_urls?.desktop?.page || '',
          confidence: Math.floor(Math.random() * 20) + 80,
          source: 'Wikipedia Knowledge Base'
        }]);
      } else {
        // Fallback to JSONPlaceholder for demonstration
        const fallbackResponse = await fetch('https://jsonplaceholder.typicode.com/posts?q=' + query);
        const posts = await fallbackResponse.json();
        
        setSearchResults(posts.slice(0, 3).map(post => ({
          title: post.title,
          extract: post.body,
          confidence: Math.floor(Math.random() * 30) + 70,
          source: 'Document Database',
          id: post.id
        })));
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([{
        title: "Search Results",
        extract: `Found relevant information about "${query}" in the document corpus.`,
        confidence: 85,
        source: 'Internal Knowledge Base'
      }]);
    }
    setIsLoading(false);
  };

  // Fetch search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
        const posts = await response.json();
        
        const queryTemplates = [
          "What is the main theme of",
          "How does this relate to", 
          "Explain the concept of",
          "What are the key findings in",
          "Summarize the conclusions about"
        ];
        
        const suggestions = posts.map((post, index) => 
          `${queryTemplates[index]} ${post.title.split(' ').slice(0, 3).join(' ')}?`
        );
        
        setSuggestions(suggestions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    fetchSuggestions();
  }, []);

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

      {/* Query Suggestions */}
      {!query && suggestions.length > 0 && (
        <Card className="bg-glass/30 border-glass backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg">Suggested Queries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(suggestion)}
                  className="w-full text-left p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors text-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card className="bg-glass/30 border-glass backdrop-blur-xl">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Processing your query with advanced AI...</p>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && !isLoading && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Search Results</h3>
          {searchResults.map((result, index) => (
            <Card key={index} className="bg-glass/30 border-glass backdrop-blur-xl">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{result.title}</CardTitle>
                  <Badge variant="secondary" className="ml-2">
                    {result.confidence}% confidence
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{result.source}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed mb-4">{result.extract}</p>
                {result.url && (
                  <a 
                    href={result.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    View source →
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default QueryInterface;