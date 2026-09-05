import { Route, Router as WouterRouter, Switch } from "wouter";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Home from "@/pages/home";
import Insights from "@/pages/insights";
import KoreaSupplierReviewBeforeCommitment from "@/pages/korea-supplier-review-before-commitment";
import NotFound from "@/pages/not-found";
import Privacy from "@/pages/privacy";
import Report from "@/pages/report";
import Terms from "@/pages/terms";
import TrustAssurance from "@/pages/trust-assurance";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/report" component={Report} />
      <Route path="/trust-assurance" component={TrustAssurance} />
      <Route
        path="/insights/korea-supplier-review-before-commitment"
        component={KoreaSupplierReviewBeforeCommitment}
      />
      <Route path="/insights" component={Insights} />
      <Route path="/contact" component={Contact} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
    </WouterRouter>
  );
}
