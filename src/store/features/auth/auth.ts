import { supabaseClient } from "@/lib/supabaseClient";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const checkAuth = createAsyncThunk("auth/checkAuth", async () => {
  const { data: { session } } = await supabaseClient.auth.getSession();
  return session ? session.user : null;
});

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

      if (error) {
        throw new Error(error.message);
      }

      return data.user; // Return user data to store
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);