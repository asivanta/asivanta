import { Link } from "wouter";
import { motion } from "framer-motion";
import { LogOut, FileText, Package, Truck, Warehouse, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

type BadgeVariant = "blue" | "green" | "gray" | "yellow" | "red";

function StatusBadge({ label, variant }: { label: string; variant: BadgeVariant }) {
  const styles: Record<BadgeVariant, string> = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    gray: "bg-gray-50 text-gray-600 border-gray-200",
    yellow: "bg-amber-50 text-amber-700 border-amber-100",
    red: "bg-red-50 text-red-700 border-red-100",
  };
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border ${styles[variant]}`}>
      {label}
    </span>
  );
}

const rfqData = [
  { id: "RFQ-2026-0041", supplier: "Daesung Industrial", status: "Quoted", updated: "Apr 04, 2026", variant: "green" as BadgeVariant },
  { id: "RFQ-2026-0039", supplier: "Jabil Inc.", status: "Negotiation", updated: "Apr 03, 2026", variant: "yellow" as BadgeVariant },
  { id: "RFQ-2026-0037", supplier: "K-Tech Components", status: "Reviewing", updated: "Apr 01, 2026", variant: "blue" as BadgeVariant },
  { id: "RFQ-2026-0035", supplier: "Arrow Electronics", status: "Quoted", updated: "Mar 29, 2026", variant: "green" as BadgeVariant },
  { id: "RFQ-2026-0032", supplier: "Hanmi Electronics", status: "Reviewing", updated: "Mar 27, 2026", variant: "blue" as BadgeVariant },
];

const orderData = [
  { id: "ORD-8821", supplier: "Sanmina Corp.", qty: "12,000 units", status: "In Production", variant: "blue" as BadgeVariant },
  { id: "ORD-8819", supplier: "Celestica Inc.", qty: "5,400 units", status: "Pending", variant: "gray" as BadgeVariant },
  { id: "ORD-8815", supplier: "Jabil Inc.", qty: "28,000 kg", status: "In Production", variant: "blue" as BadgeVariant },
  { id: "ORD-8812", supplier: "Sanmina Corp.", qty: "3,200 units", status: "Delayed", variant: "red" as BadgeVariant },
];

const deliveryData = [
  { id: "SHP-44201", eta: "Apr 12, 2026", carrier: "Maersk Line", status: "In Transit", variant: "blue" as BadgeVariant },
  { id: "SHP-44198", eta: "Apr 08, 2026", carrier: "CMA CGM", status: "Customs", variant: "yellow" as BadgeVariant },
  { id: "SHP-44192", eta: "Mar 30, 2026", carrier: "HMM Co.", status: "Delivered", variant: "green" as BadgeVariant },
  { id: "SHP-44187", eta: "Apr 18, 2026", carrier: "Evergreen Marine", status: "In Transit", variant: "blue" as BadgeVariant },
];

const inventoryData = [
  { part: "STL-CR-440", qty: "14,200", location: "Busan Warehouse", status: "In Stock", variant: "green" as BadgeVariant },
  { part: "ELC-HM-220", qty: "3,800", location: "Incheon FTZ", status: "In Stock", variant: "green" as BadgeVariant },
  { part: "PRC-KP-115", qty: "960", location: "Ulsan Plant", status: "Low Stock", variant: "yellow" as BadgeVariant },
  { part: "CMP-KT-300", qty: "7,500", location: "Gyeonggi Hub", status: "In Stock", variant: "green" as BadgeVariant },
  { part: "DST-AV-650", qty: "0", location: "Busan Warehouse", status: "Out of Stock", variant: "red" as BadgeVariant },
];

function DashboardCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <motion.div variants={fadeIn} className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
          <Icon className="h-[18px] w-[18px] text-[#3B82F6] stroke-[1.5]" />
        </div>
        <h2 className="text-base font-semibold text-[#0F172A]">{title}</h2>
      </div>
      <div className="overflow-x-auto">{children}</div>
    </motion.div>
  );
}

function TableHead({ columns }: { columns: string[] }) {
  return (
    <thead>
      <tr className="border-b border-gray-100">
        {columns.map((col) => (
          <th key={col} className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-3 whitespace-nowrap">{col}</th>
        ))}
      </tr>
    </thead>
  );
}

function TableCell({ children, mono }: { children: React.ReactNode; mono?: boolean }) {
  return <td className={`px-6 py-3.5 text-sm whitespace-nowrap ${mono ? "font-mono text-[#0F172A]" : "text-gray-700"}`}>{children}</td>;
}

export default function Portal() {
  return (
    <div className="min-h-screen bg-[#f4f5f7] font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" />
              Home
            </Link>
            <div className="h-5 w-px bg-gray-200" />
            <span className="text-sm font-semibold text-[#0F172A] tracking-tight">ASIVANTA Client Portal</span>
          </div>
          <div className="flex items-center gap-5">
            <span className="text-sm text-gray-600">Welcome, <span className="font-medium text-[#0F172A]">Client</span></span>
            <Button variant="outline" size="sm" className="rounded-full h-8 px-4 text-xs gap-1.5">
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.div variants={fadeIn} className="mb-10">
            <h1 className="text-3xl md:text-4xl font-light text-[#0F172A] tracking-tight mb-2">Client Portal</h1>
            <p className="text-gray-500 font-light">Access your sourcing activity, RFQs, and order status.</p>
          </motion.div>

          <div className="grid gap-8">
            <DashboardCard title="RFQ Status" icon={FileText}>
              <table className="w-full">
                <TableHead columns={["RFQ ID", "Supplier", "Status", "Last Updated"]} />
                <tbody>
                  {rfqData.map((row) => (
                    <tr key={row.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <TableCell mono>{row.id}</TableCell>
                      <TableCell>{row.supplier}</TableCell>
                      <TableCell><StatusBadge label={row.status} variant={row.variant} /></TableCell>
                      <TableCell>{row.updated}</TableCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            </DashboardCard>

            <div className="grid lg:grid-cols-2 gap-8">
              <DashboardCard title="Backlog Orders" icon={Package}>
                <table className="w-full">
                  <TableHead columns={["Order ID", "Supplier", "Quantity", "Status"]} />
                  <tbody>
                    {orderData.map((row) => (
                      <tr key={row.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                        <TableCell mono>{row.id}</TableCell>
                        <TableCell>{row.supplier}</TableCell>
                        <TableCell>{row.qty}</TableCell>
                        <TableCell><StatusBadge label={row.status} variant={row.variant} /></TableCell>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </DashboardCard>

              <DashboardCard title="Delivery Status" icon={Truck}>
                <table className="w-full">
                  <TableHead columns={["Shipment ID", "ETA", "Carrier", "Status"]} />
                  <tbody>
                    {deliveryData.map((row) => (
                      <tr key={row.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                        <TableCell mono>{row.id}</TableCell>
                        <TableCell>{row.eta}</TableCell>
                        <TableCell>{row.carrier}</TableCell>
                        <TableCell><StatusBadge label={row.status} variant={row.variant} /></TableCell>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </DashboardCard>
            </div>

            <DashboardCard title="Inventory Overview" icon={Warehouse}>
              <table className="w-full">
                <TableHead columns={["Part Number", "Available Qty", "Location", "Status"]} />
                <tbody>
                  {inventoryData.map((row) => (
                    <tr key={row.part} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <TableCell mono>{row.part}</TableCell>
                      <TableCell>{row.qty}</TableCell>
                      <TableCell>{row.location}</TableCell>
                      <TableCell><StatusBadge label={row.status} variant={row.variant} /></TableCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            </DashboardCard>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
