import { Button } from "@/components/ui/button";
import { CreditCard, Check, ArrowRight } from "lucide-react";

const packages = [
  { credits: 100, price: "$19", perCredit: "$0.19", popular: false },
  { credits: 500, price: "$49", perCredit: "$0.098", popular: true },
  { credits: 1000, price: "$89", perCredit: "$0.089", popular: false },
];

const transactions = [
  { date: "Feb 18", type: "Purchase", amount: "+500 credits", price: "$49.00" },
  { date: "Feb 15", type: "Usage", amount: "-87 credits", price: "Campaign: Follow-up Batch 3" },
  { date: "Feb 10", type: "Usage", amount: "-166 credits", price: "Campaign: Q1 Outreach" },
  { date: "Jan 30", type: "Purchase", amount: "+100 credits", price: "$19.00" },
];

const Billing = () => {
  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold">Billing & Credits</h1>
        <p className="text-muted-foreground mt-1">Manage your credit balance and purchases.</p>
      </div>

      <div className="p-6 rounded-2xl glass flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Balance</p>
            <p className="text-3xl font-bold">247 <span className="text-lg font-normal text-muted-foreground">credits</span></p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-4">Buy Credits</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {packages.map((pkg) => (
            <div key={pkg.credits} className={`p-6 rounded-2xl transition-all hover:-translate-y-1 ${pkg.popular ? "gradient-primary text-primary-foreground shadow-lg" : "glass hover:shadow-md"}`}>
              {pkg.popular && <p className="text-xs font-semibold mb-3 opacity-80">BEST VALUE</p>}
              <p className="text-3xl font-bold">{pkg.credits}</p>
              <p className={`text-sm ${pkg.popular ? "opacity-80" : "text-muted-foreground"}`}>credits</p>
              <p className="text-2xl font-bold mt-4">{pkg.price}</p>
              <p className={`text-xs mt-1 ${pkg.popular ? "opacity-70" : "text-muted-foreground"}`}>{pkg.perCredit}/credit</p>
              <Button className={`w-full mt-6 rounded-xl ${pkg.popular ? "bg-background text-foreground hover:bg-background/90" : "gradient-primary border-0"}`}>
                Buy Now <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-4">Transaction History</h3>
        <div className="rounded-2xl glass overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Details</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-4 text-sm">{t.date}</td>
                  <td className="p-4 text-sm">{t.type}</td>
                  <td className={`p-4 text-sm font-medium ${t.amount.startsWith("+") ? "text-success" : "text-destructive"}`}>{t.amount}</td>
                  <td className="p-4 text-sm text-muted-foreground">{t.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Billing;
