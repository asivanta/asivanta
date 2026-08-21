import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SiteChatAssistant from "@/components/SiteChatAssistant";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home-apple";
import Contact from "@/pages/contact";
import InstantQuote from "@/pages/instant-quote";
import Insights from "@/pages/insights";
import About from "@/pages/about";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import TrustAssurance from "@/pages/trust-assurance";
import Report from "@/pages/report";
import Kes2026BuyerGuide from "@/pages/kes-2026-buyer-guide";
import KoreanManufacturerVsTradingCompany from "@/pages/korean-manufacturer-vs-trading-company";
import KoreaPhysicalAiRdPartnerChecklist from "@/pages/korea-physical-ai-rd-partner-checklist";
import KoreanAutomotiveSupplierReviewChecklist from "@/pages/korean-automotive-supplier-review-checklist";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/insights" component={Insights} />
      <Route
        path="/insights/kes-2026-overseas-buyer-checklist"
        component={Kes2026BuyerGuide}
      />
      <Route
        path="/insights/korean-manufacturer-vs-trading-company"
        component={KoreanManufacturerVsTradingCompany}
      />
      <Route
        path="/insights/korea-physical-ai-rd-partner-checklist"
        component={KoreaPhysicalAiRdPartnerChecklist}
      />
      <Route
        path="/insights/korean-automotive-supplier-review-checklist"
        component={KoreanAutomotiveSupplierReviewChecklist}
      />
      <Route path="/contact" component={Contact} />
      <Route path="/quote-now" component={InstantQuote} />
      <Route path="/instant-quote" component={InstantQuote} />
      <Route path="/about" component={About} />
      <Route path="/trust-assurance" component={TrustAssurance} />
      <Route path="/report" component={Report} />
      <Route path="/shortlist-report" component={Report} />
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
        <SiteChatAssistant />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
