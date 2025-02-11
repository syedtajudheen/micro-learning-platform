"use client"
import { useRouter } from "next/navigation";
import LoginForm from "./LoginForm";
import { Toaster } from "@/components/ui/toaster";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { checkAuth } from "@/store/features/auth/auth";

export default function LoginPage() {
 const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth)

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex w-full h-full items-center justify-center text-lg">
        Loading...
      </div>
    );
  }

  if (user) {
    router.replace("/editor");
    return null;
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center ">
      <div className="w-1/3 ">
        <LoginForm />
      </div>
      <Toaster />
    </div>
  );
};
