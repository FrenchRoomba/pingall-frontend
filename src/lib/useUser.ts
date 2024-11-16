import { getCurrentUser, onAuthStateChanged } from "./firebase/auth";
import { useEffect, useState } from "react";

import { User } from "firebase/auth";
import { useRouter } from "next/navigation";

export function useUser() {
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((authUser) => {
      setUser(authUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { user, isLoading };
}
