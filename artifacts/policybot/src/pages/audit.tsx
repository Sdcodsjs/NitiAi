import { useGetPolicyStats, useHealthCheck } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, Database, BrainCircuit, CheckCircle2, XCircle, Search, ServerCog } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function StatusItem({ label, active, description }: { label: string, active: boolean, description: string }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
      {active ? (
        <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
      ) : (
        <XCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
      )}
      <div>
        <h4 className="font-medium text-foreground">{label}</h4>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );
}

export function Audit() {
  const { data: stats, isLoading: statsLoading } = useGetPolicyStats();
  const { data: health, isLoading: healthLoading } = useHealthCheck();

  const isHealthy = health?.status === "ok";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">System Audit & Health</h1>
        <p className="text-muted-foreground max-w-3xl text-lg">
          Technical dashboard showing the operational status of the PolicyBot RAG (Retrieval-Augmented Generation) engine and knowledge base metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Schemes</CardTitle>
            <Database className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-3xl font-bold">{stats?.totalSchemes || 0}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Indexed in database</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sectors Covered</CardTitle>
            <Activity className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-3xl font-bold">{stats?.sectors?.length || 0}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Across all ministries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Vector Chunks</CardTitle>
            <Search className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-3xl font-bold">{(stats?.totalChunks || 0).toLocaleString()}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Embeddings for retrieval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last Updated</CardTitle>
            <ServerCog className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-xl font-bold truncate">
                {stats?.lastUpdated ? new Date(stats.lastUpdated).toLocaleDateString() : 'Unknown'}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Knowledge base sync</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>System Status Checklist</CardTitle>
            <CardDescription>Real-time operational status of core AI components</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <StatusItem 
              label="API Gateway" 
              active={!healthLoading && isHealthy} 
              description="Main server responding to requests"
            />
            <StatusItem 
              label="Vector Database" 
              active={!statsLoading && !!stats} 
              description="PgVector extensions and connections active"
            />
            <StatusItem 
              label="Gemini LLM Integration" 
              active={!healthLoading && isHealthy} 
              description="Google Gemini models accessible for generation"
            />
            <StatusItem 
              label="Retrieval Engine" 
              active={!statsLoading && !!stats} 
              description="Semantic search and ranking algorithms ready"
            />
          </CardContent>
        </Card>

        <Card className="col-span-1 bg-primary text-primary-foreground border-primary-foreground/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="w-6 h-6" />
              Civic Intelligence Architecture
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-primary-foreground/90">
            <p>
              PolicyBot operates on a strict <strong>Retrieval-Augmented Generation (RAG)</strong> pipeline designed for high-stakes civic information.
            </p>
            <ul className="space-y-3 list-disc pl-5">
              <li><strong>Zero-Shot Grounding:</strong> The LLM is restricted from using its internal training data to answer policy questions. Every assertion must be grounded in a retrieved chunk from the database.</li>
              <li><strong>Semantic Chunking:</strong> Long policy documents are split into logical paragraphs (chunks) and embedded using dense vector representations to capture meaning over keywords.</li>
              <li><strong>Confidence Scoring:</strong> The system evaluates the semantic similarity between the user's query and the retrieved documents. A low confidence score triggers a fallback rather than a hallucination.</li>
              <li><strong>Verifiable Citations:</strong> Every answer includes direct quotes and source references to the original scheme documents.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
