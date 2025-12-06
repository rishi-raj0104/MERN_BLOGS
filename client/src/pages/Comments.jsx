import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetch } from "@/hooks/useFetch";
import { getEvn } from "@/helpers/getEnv";
import Loading from "@/components/Loading";
import { FaRegTrashAlt } from "react-icons/fa";
import { deleteData } from "@/helpers/handleDelete";
import { showToast } from "@/helpers/showToast";

const Comments = () => {
  const [refreshData, setRefreshData] = useState(false);
  const { data, loading, error } = useFetch(
    `${getEvn("VITE_API_BASE_URL")}/comment/get-all-comment`,
    {
      method: "get",
      credentials: "include",
    },
    [refreshData]
  );

  const handleDelete = async (id) => {
    const response = await deleteData(
      `${getEvn("VITE_API_BASE_URL")}/comment/delete/${id}`
    );
    if (response) {
      setRefreshData(!refreshData);
      showToast("success", "Data deleted.");
    } else {
      showToast("error", "Data not deleted.");
    }
  };

  if (loading) return <Loading />;
  return (
    <div className="max-w-3xl mx-auto mt-10 px-2 sm:px-4">
      <Card>
        <CardContent className="p-2 md:p-6">
          {/* Responsive table container */}
          <div className="overflow-x-auto">
            <Table className="min-w-[500px] w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-36 min-w-[120px]">Blog</TableHead>
                  <TableHead className="w-32 min-w-[100px]">Commented By</TableHead>
                  <TableHead className="min-w-[180px]">Comment</TableHead>
                  <TableHead className="w-20 text-center min-w-[76px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data && data.comments.length > 0 ? (
                  data.comments.map((comment) => (
                    <TableRow key={comment._id}>
                      <TableCell className="break-words">{comment?.blogid?.title}</TableCell>
                      <TableCell className="break-words">{comment?.user?.name}</TableCell>
                      <TableCell className="break-words">{comment?.comment}</TableCell>
                      <TableCell className="flex gap-3 justify-center items-center">
                        <Button
                          onClick={() => handleDelete(comment._id)}
                          variant="outline"
                          className="hover:bg-violet-500 hover:text-white p-2 h-8 w-8 flex items-center justify-center"
                        >
                          <FaRegTrashAlt />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="4" className="text-center">
                      Data not found.
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

export default Comments;
