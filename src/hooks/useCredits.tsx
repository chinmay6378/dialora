import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useCredits = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBalance = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("credits_balance")
      .select("balance")
      .eq("user_id", user.id)
      .single();
    setBalance(data?.balance ?? 0);
    setLoading(false);
  };

  useEffect(() => {
    fetchBalance();

    if (!user) return;

    const channel = supabase
      .channel("credits-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "credits_balance", filter: `user_id=eq.${user.id}` },
        (payload: any) => {
          if (payload.new?.balance !== undefined) {
            setBalance(payload.new.balance);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  return { balance, loading, refetch: fetchBalance };
};
