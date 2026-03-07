import { Button } from "@/components/ui/button";
import { CreditCard, ArrowRight, IndianRupee, Check, Shield, Zap, Clock, Receipt } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const packages = [
  { credits: 100, price: 1599, perCredit: "₹15.99", popular: false, savings: null },
  { credits: 500, price: 3999, perCredit: "₹7.99", popular: true, savings: "50% OFF" },
  { credits: 1000, price: 6999, perCredit: "₹6.99", popular: false, savings: "56% OFF" },
];

interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  date: string;
  status: "success" | "pending" | "failed";
}

const mockTransactions: Transaction[] = [
  { id: "tx1", amount: 500, type: "credit", description: "Purchased 500 credits (Razorpay)", date: "2026-03-05", status: "success" },
  { id: "tx2", amount: -25, type: "debit", description: "Campaign: Q1 Outreach — 25 calls", date: "2026-03-04", status: "success" },
  { id: "tx3", amount: -18, type: "debit", description: "Campaign: Product Launch — 18 calls", date: "2026-03-03", status: "success" },
  { id: "tx4", amount: 100, type: "credit", description: "Welcome bonus — Free trial credits", date: "2026-02-28", status: "success" },
  { id: "tx5", amount: -7, type: "debit", description: "Campaign: Follow-up Batch — 7 calls", date: "2026-02-27", status: "success" },
];

const Billing = () => {
  const [balance] = useState(100);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<typeof packages[0] | null>(null);
  const [processing, setProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"details" | "processing" | "success">("details");

  const initiatePayment = (pkg: typeof packages[0]) => {
    setSelectedPkg(pkg);
    setPaymentStep("details");
    setShowPayment(true);
  };

  const handlePayment = async () => {
    setProcessing(true);
    setPaymentStep("processing");
    
    // Simulate Razorpay payment processing
    await new Promise((r) => setTimeout(r, 2500));
    
    setPaymentStep("success");
    setProcessing(false);
    toast.success(`${selectedPkg?.credits} credits added to your account!`);
    
    // Auto close after success
    setTimeout(() => {
      setShowPayment(false);
      setPaymentStep("details");
    }, 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Billing & Credits</h1>
        <p className="text-muted-foreground mt-1">Manage your credit balance and purchases.</p>
      </div>

      {/* Balance Card */}
      <div className="p-6 rounded-2xl glass-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
              <CreditCard className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-4xl font-bold text-foreground">{balance} <span className="text-lg font-normal text-muted-foreground">credits</span></p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-success/10 text-success">
              <Zap className="w-3.5 h-3.5" />
              <span>1 credit = 1 AI call</span>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Packages */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg text-foreground">Buy Credits</h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="w-3.5 h-3.5" />
            Secured by Razorpay
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.credits}
              className={`relative p-6 rounded-2xl transition-all duration-300 ${
                pkg.popular
                  ? "gradient-primary text-primary-foreground shadow-2xl scale-105 btn-glow"
                  : "glass-card"
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-background text-foreground text-xs font-semibold border border-border">
                  Best Value
                </div>
              )}
              {pkg.savings && !pkg.popular && (
                <Badge className="absolute -top-2 right-4 bg-success text-success-foreground border-0 text-xs">
                  {pkg.savings}
                </Badge>
              )}
              {pkg.savings && pkg.popular && (
                <Badge className="absolute -top-2 right-4 bg-background text-foreground border-0 text-xs">
                  {pkg.savings}
                </Badge>
              )}
              <div className="space-y-4 pt-2">
                <div>
                  <p className="text-4xl font-bold">{pkg.credits}</p>
                  <p className={`text-sm ${pkg.popular ? "opacity-80" : "text-muted-foreground"}`}>credits</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <IndianRupee className="w-5 h-5" />
                  <span className="text-3xl font-bold">{pkg.price.toLocaleString()}</span>
                </div>
                <p className={`text-xs ${pkg.popular ? "opacity-70" : "text-muted-foreground"}`}>{pkg.perCredit} per credit</p>
                <Button
                  onClick={() => initiatePayment(pkg)}
                  className={`w-full rounded-xl py-5 ${
                    pkg.popular
                      ? "bg-background text-foreground hover:bg-background/90"
                      : "gradient-primary border-0 btn-glow"
                  }`}
                >
                  Buy Now <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Receipt className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold text-lg text-foreground">Transaction History</h3>
        </div>
        <div className="rounded-2xl glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Description</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">Amount</th>
              </tr>
            </thead>
            <tbody>
              {mockTransactions.map((t) => (
                <tr key={t.id} className="border-b border-border/20 last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="p-4 text-sm text-foreground">{t.date}</td>
                  <td className="p-4 text-sm text-muted-foreground">{t.description}</td>
                  <td className="p-4">
                    <Badge className={`rounded-lg border-0 ${
                      t.status === "success" ? "bg-success/10 text-success" :
                      t.status === "pending" ? "bg-warning/10 text-warning" :
                      "bg-destructive/10 text-destructive"
                    }`}>{t.status}</Badge>
                  </td>
                  <td className={`p-4 text-sm font-medium text-right ${t.amount > 0 ? "text-success" : "text-destructive"}`}>
                    {t.amount > 0 ? "+" : ""}{t.amount} credits
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Razorpay Payment Dialog */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="rounded-2xl glass-card border-border/50 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {paymentStep === "success" ? "Payment Successful!" : "Complete Payment"}
            </DialogTitle>
          </DialogHeader>

          {paymentStep === "details" && selectedPkg && (
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="p-4 rounded-xl bg-muted/30 border border-border/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Package</span>
                  <span className="text-sm font-medium text-foreground">{selectedPkg.credits} Credits</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Rate</span>
                  <span className="text-sm text-foreground">{selectedPkg.perCredit}/credit</span>
                </div>
                <Separator className="bg-border/30" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">Total</span>
                  <span className="text-lg font-bold text-foreground flex items-center gap-0.5">
                    <IndianRupee className="w-4 h-4" />
                    {selectedPkg.price.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Payment Method</Label>
                <div className="grid grid-cols-2 gap-3">
                  {["UPI", "Card", "Net Banking", "Wallet"].map((method) => (
                    <button
                      key={method}
                      className="p-3 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all text-sm text-foreground text-center"
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* UPI Input */}
              <div className="space-y-2">
                <Label>UPI ID</Label>
                <Input placeholder="yourname@upi" className="rounded-xl bg-background/50 border-border/50" />
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="w-3.5 h-3.5 text-success" />
                <span>256-bit SSL encrypted • Secured by Razorpay</span>
              </div>

              <Button onClick={handlePayment} className="w-full gradient-primary border-0 rounded-xl py-5 btn-glow">
                Pay ₹{selectedPkg.price.toLocaleString()}
              </Button>
            </div>
          )}

          {paymentStep === "processing" && (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full gradient-primary mx-auto flex items-center justify-center animate-pulse">
                <Clock className="w-8 h-8 text-primary-foreground" />
              </div>
              <p className="text-foreground font-medium">Processing payment...</p>
              <p className="text-sm text-muted-foreground">Please don't close this window</p>
            </div>
          )}

          {paymentStep === "success" && selectedPkg && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-success/20 mx-auto flex items-center justify-center">
                <Check className="w-8 h-8 text-success" />
              </div>
              <div>
                <p className="text-foreground font-semibold text-lg">{selectedPkg.credits} credits added!</p>
                <p className="text-sm text-muted-foreground mt-1">Payment ID: pay_mock_{Date.now().toString(36)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Billing;
