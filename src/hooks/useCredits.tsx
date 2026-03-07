import { useState } from "react";

export const useCredits = () => {
  const [balance] = useState<number>(100);
  const [loading] = useState(false);

  return { balance, loading, refetch: () => {} };
};
