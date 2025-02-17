import { supabaseClient } from "@/lib/supabaseClient";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Slide } from "./types";

export const fetchSlides = createAsyncThunk(
  "editor/fetchSlides",
  async (courseId: string, { rejectWithValue }) => {
    try {
      const { data, error } = await supabaseClient
        .from('slides')
        .select('*')
        .order('created_at', { ascending: true })
        .eq('course_id', courseId);

      if (error) {
        throw new Error(error.message);
      }

      return data; // Return user data to store
    } catch (error) {
      return rejectWithValue((error as { message: string }).message);
    }
  }
);

export const updateSlide = createAsyncThunk(
  "editor/updateSlide",
  async (payload: Slide, { rejectWithValue, getState }: { getState: any, rejectWithValue: any }) => {
    console.log('payload', payload);
    try {
      const { data, error } = await supabaseClient
        .from('slides')
        .upsert([{
          course_id: getState().editor.courseId,
          ...payload
        }])
        .select();

      if (error) {
        throw new Error(error.message);
      }

      return data?.[0]; // Returns the updated slide data
    } catch (error) {
      return rejectWithValue((error as { message: string }).message);
    }
  }
);


export const addSlide = createAsyncThunk(
  "editor/addSlide",
  async (slide: Slide, { getState, rejectWithValue }: { getState: any, rejectWithValue: any }) => {
    try {
      const { data, error } = await supabaseClient
        .from('slides')
        .insert([{
          course_id: getState()?.editor?.courseId,
          ...slide
        }])
        .select();

      if (error) {
        throw new Error(error.message);
      }

      return data; // Return user data to store
    } catch (error) {
      return rejectWithValue((error as { message: string }).message);
    }
  }
);

export const deleteSlide = createAsyncThunk(
  "editor/deleteSlide",
  async (slideId: string, { rejectWithValue }) => {
    try {
      const { data, error } = await supabaseClient
        .from('slides')
        .delete({ count: 'exact' })
        .eq('id', slideId)
        .select('id, updated_at');

      if (error) {
        throw new Error(error.message);
      }

      return data?.[0]; // Return user data to store
    } catch (error) {
      return rejectWithValue((error as { message: string }).message);
    }
  }
);

