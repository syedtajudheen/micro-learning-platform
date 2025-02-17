"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabaseClient } from "@/lib/supabaseClient";
import SideBar from "@/components/Layouts/Sidebar";

const CourseManagementPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [courseData, setCourseData] = useState({ title: "", description: "", category: "" });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const { data, error } = await supabaseClient.from("courses").select("*");
    if (error) console.error("Error fetching courses:", error);
    else setCourses(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCourseFormSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabaseClient.from("courses").insert([courseData]);
console.log('data>>', data);
    if (error) {
      console.error("Error creating course:", error);
      toast({ title: "Error", description: "Failed to create course", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Course created successfully!" });
      setIsDialogOpen(false);
      setCourseData({ title: "", description: "", category: "" });
      fetchCourses(); // Refresh list
    }
  };

  const handleCourseTitleClick = (courseId) => {
    router.push(`/editor/${courseId}`);
  };
  const renderCourseCards = () => {
    return (
      <div className="grid auto-rows-min gap-4 grid-cols-[repeat(auto-fill,200px)]">
        {courses.map((course) => (
          <Card
            key={course.id}
            className="w-[200px] h-[200px] cursor-pointer hover:bg-gray-100"
            onClick={() => handleCourseTitleClick(course.id)}
          >
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{course.description}</p>
              <p className="text-sm text-gray-500">Category: {course.category}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
  return (
    <SideBar>

      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Courses</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Create Course</Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Create a New Course</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCourseFormSubmit} className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input name="title" value={courseData.title} onChange={handleChange} required />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea name="description" value={courseData.description} onChange={handleChange} required />
                </div>
                <div>
                  <Label>Category</Label>
                  <Input name="category" value={courseData.category} onChange={handleChange} required />
                </div>
                <Button type="submit" className="w-full">Create Course</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Course List */}
        <div className="flex flex-1 flex-col gap-4">
          {courses.length === 0 ? (
            <p>No courses available.</p>
          ) : renderCourseCards()}
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />

        </div>
      </div>
    </SideBar>
  );
};

export default CourseManagementPage;
