import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import TelegramChatButton from "@/components/TelegramChatButton";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Contact from "@/pages/contact";
import Portal from "@/pages/portal";
import Insights from "@/pages/insights";
import About from "@/pages/about";
import Login from "@/pages/login";
import Admin from "@/pages/admin";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/portal" component={Portal} />
      <Route path="/login" component={Login} />
      <Route path="/insights" component={Insights} />
      <Route path="/contact" component={Contact} />
      <Route path="/about" component={About} />
      <Route path="/admin" component={Admin} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route component={NotFound} />
    </Switch>
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
        <TelegramChatButton />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
