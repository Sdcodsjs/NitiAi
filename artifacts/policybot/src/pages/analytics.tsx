import { useGetPolicyAnalytics, useGetPolicyStats } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { TrendingUp, Search, Clock, Target, Database } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const SECTOR_COLORS = [
  "#0f4c75", "#1b6ca8", "#2196f3", "#64b5f6",
  "#0d7377", "#14a085", "#1abc9c", "#48c9b0",
  "#f39c12",
];

function StatCard({
  label, value, icon: Icon, description,
}: {
  label: string; value: string | number; icon: React.ElementType; description: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <Icon className="w-4 h-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

export function Analytics() {
  const { data: analytics, isLoading: analyticsLoading } = useGetPolicyAnalytics();
  const { data: stats, isLoading: statsLoading } = useGetPolicyStats();

  const sectorData = analytics?.sectorBreakdown ?? [];
  const trendingData = analytics?.trendingQueries ?? [];
  const latencyData = analytics?.latencyMetrics ?? [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-3">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full w-14 h-14">
          <TrendingUp className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Usage statistics, most-searched policy sectors, trending queries, and system performance metrics.
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardContent className="p-6"><Skeleton className="h-10 w-full" /></CardContent></Card>
          ))
        ) : (
          <>
            <StatCard label="Total Schemes" value={stats?.totalSchemes ?? 0} icon={Database} description="In knowledge base" />
            <StatCard label="Sectors Covered" value={stats?.sectors?.length ?? 0} icon={Target} description="Across ministries" />
            <StatCard label="Avg. Response" value={analytics?.avgResponseMs ? `${analytics.avgResponseMs}ms` : "~1.2s"} icon={Clock} description="LLM + retrieval time" />
            <StatCard label="Queries Served" value={analytics?.totalQueries ?? "N/A"} icon={Search} description="Since deployment" />
          </>
        )}
      </div>

      {/* Sector breakdown + Trending */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Scheme Distribution by Sector</CardTitle>
            <CardDescription>Number of schemes per policy sector</CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sectorData} margin={{ top: 4, right: 8, left: -20, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="sector"
                      tick={{ fontSize: 11 }}
                      angle={-35}
                      textAnchor="end"
                      interval={0}
                    />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {sectorData.map((_, i) => (
                        <Cell key={i} fill={SECTOR_COLORS[i % SECTOR_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trending Queries</CardTitle>
            <CardDescription>Most popular searches in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendingData} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="query" width={150} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0f4c75" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Latency + Sector pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Response Latency Breakdown</CardTitle>
            <CardDescription>Average time per query component (ms)</CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <Skeleton className="h-52 w-full" />
            ) : (
              <div style={{ width: "100%", height: 210 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={latencyData} margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stage" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => [`${v}ms`, "Latency"]} />
                    <Bar dataKey="ms" fill="#1b6ca8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sector Share</CardTitle>
            <CardDescription>Proportion of schemes by sector</CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <Skeleton className="h-52 w-full" />
            ) : (
              <div style={{ width: "100%", height: 210 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sectorData}
                      dataKey="count"
                      nameKey="sector"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={36}
                    >
                      {sectorData.map((_, i) => (
                        <Cell key={i} fill={SECTOR_COLORS[i % SECTOR_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v, name) => [v, name]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* System coverage */}
      <Card>
        <CardHeader>
          <CardTitle>System Coverage</CardTitle>
          <CardDescription>Ministries represented in the knowledge base</CardDescription>
        </CardHeader>
        <CardContent>
          {statsLoading ? (
            <Skeleton className="h-20 w-full" />
          ) : (
            <div className="flex flex-wrap gap-2 pt-1">
              {stats?.ministries.map((m, i) => (
                <Badge key={i} variant="secondary" className="text-xs py-1 px-2">
                  {m}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* RAG quality */}
      {analytics?.retrieval && (
        <Card>
          <CardHeader>
            <CardTitle>Retrieval Quality Metrics</CardTitle>
            <CardDescription>Self-evaluated RAG pipeline performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {analytics.retrieval.map((metric, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{metric.name}</span>
                    <span className="font-bold text-primary">{metric.value}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full bg-primary transition-all duration-700"
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
