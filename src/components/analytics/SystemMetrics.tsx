import { Activity, Clock, Target, Zap, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const SystemMetrics = () => {
  const metrics = [
    {
      title: "Query Response Time",
      value: "1.2s",
      target: "< 2s",
      progress: 85,
      icon: Clock,
      status: "excellent"
    },
    {
      title: "Accuracy Score",
      value: "94.7%",
      target: "> 90%",
      progress: 95,
      icon: Target,
      status: "excellent"
    },
    {
      title: "System Uptime",
      value: "99.9%",
      target: "> 99.5%",
      progress: 99,
      icon: Activity,
      status: "excellent"
    },
    {
      title: "Cost Per Query",
      value: "$0.003",
      target: "< $0.005",
      progress: 78,
      icon: Zap,
      status: "good"
    }
  ];

  const recentActivity = [
    { action: "Document processed", document: "Financial_Report_Q4.pdf", time: "2 min ago" },
    { action: "Query executed", query: "What are the revenue trends?", time: "5 min ago" },
    { action: "Model hot-swapped", model: "GPT-4 → Claude-3", time: "15 min ago" },
    { action: "New user registered", user: "analyst@company.com", time: "32 min ago" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title} className="bg-glass/30 border-glass backdrop-blur-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-muted-foreground">Target: {metric.target}</p>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    metric.status === 'excellent' ? 'bg-success/20 text-success' : 
                    'bg-warning/20 text-warning'
                  }`}>
                    {metric.status}
                  </div>
                </div>
                <Progress value={metric.progress} className="mt-2 h-2" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-glass/30 border-glass backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Queries/Hour</span>
                <span className="font-semibold">1,247 ↑ 12%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Documents Processed</span>
                <span className="font-semibold">89 ↑ 23%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Average Confidence</span>
                <span className="font-semibold">91.3% ↑ 3%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Error Rate</span>
                <span className="font-semibold">0.12% ↓ 45%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-glass/30 border-glass backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.document || activity.query || activity.model || activity.user}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemMetrics;