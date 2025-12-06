import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RouteAddCategory, RouteEditCategory } from "@/helpers/RouteName";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetch } from "@/hooks/useFetch";
import { getEnv } from "@/helpers/getEnv";
import Loading from "@/components/Loading";
import { FiEdit, FiTrash2, FiPlus, FiFolder } from "react-icons/fi";
import { BiCategory } from "react-icons/bi";
import { deleteData } from "@/helpers/handleDelete";
import { showToast } from "@/helpers/showToast";
import { Badge } from "@/components/ui/badge";

const CategoryDetails = () => {
  const [refreshData, setRefreshData] = useState(false);
  
  const {
    data: categoryData,
    loading,
    error,
  } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/category/all-category`,
    {
      method: "get",
      credentials: "include",
    },
    [refreshData]
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    
    const response = await deleteData(
      `${getEnv("VITE_API_BASE_URL")}/category/delete/${id}`
    );
    if (response) {
      setRefreshData(!refreshData);
      showToast("success", "Category deleted successfully");
    } else {
      showToast("error", "Failed to delete category");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="border-border/50 shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl font-display flex items-center gap-2">
              <BiCategory className="w-6 h-6 text-primary" />
              Categories
            </CardTitle>
            <CardDescription>
              Manage blog categories
            </CardDescription>
          </div>
          <Button asChild className="bg-gradient-primary hover:opacity-90 text-white">
            <Link to={RouteAddCategory}>
              <FiPlus className="w-4 h-4 mr-2" />
              Add Category
            </Link>
          </Button>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Slug</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryData && categoryData.category?.length > 0 ? (
                  categoryData.category.map((category) => (
                    <TableRow key={category._id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FiFolder className="w-4 h-4 text-primary" />
                          {category.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono text-xs">
                          {category.slug}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                            asChild
                          >
                            <Link to={RouteEditCategory(category._id)}>
                              <FiEdit className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleDelete(category._id)}
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <BiCategory className="w-10 h-10 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No categories yet</p>
                        <Button asChild variant="link" className="mt-2">
                          <Link to={RouteAddCategory}>Create your first category</Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryDetails;
