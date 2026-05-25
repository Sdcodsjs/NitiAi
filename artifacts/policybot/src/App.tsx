import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/layout";
import { Home } from "@/pages/home";
import { Compare } from "@/pages/compare";
import { Recommend } from "@/pages/recommend";
import { Schemes } from "@/pages/schemes";
import { Audit } from "@/pages/audit";
import { Verify } from "@/pages/verify";
import { Analytics } from "@/pages/analytics";
import { Impact } from "@/pages/impact";
import { Bookmarks } from "@/pages/bookmarks";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/compare" component={Compare} />
        <Route path="/recommend" component={Recommend} />
        <Route path="/schemes" component={Schemes} />
        <Route path="/audit" component={Audit} />
        <Route path="/verify" component={Verify} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/impact" component={Impact} />
        <Route path="/bookmarks" component={Bookmarks} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
