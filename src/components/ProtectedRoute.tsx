import { checkAuth } from "@/store/features/auth/auth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);
  
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex w-full h-full items-center justify-center text-lg">
        <LoaderCircle className="w-10 h-10 animate-spin" />
      </div>
    );
  }
  
  if (!user) {
    router.replace("/login");
    return null;
  }

  return children;
};
