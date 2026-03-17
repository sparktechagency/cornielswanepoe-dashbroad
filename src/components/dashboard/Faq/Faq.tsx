
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Textarea } from "../../ui/textarea";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { toast } from "sonner";
import {
  useAddFAQMutation,
  useDeleteFAQMutation,
  useGetFAQQuery,
} from "../../../redux/features/setting/settingApi";
import Swal from "sweetalert2";


const FAQPage = () => {
  const { data: faqs, refetch,} = useGetFAQQuery({});
  const [createFAQ, { isLoading: creating }] = useAddFAQMutation();
  const [deleteFAQ, { isLoading: deleting }] = useDeleteFAQMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ question: "", answer: "" });

  const openAddDialog = () => {
    setFormData({ question: "", answer: "" });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.question || !formData.answer) {
      toast.error("Question and Answer are required");
      return;
    }
    try {
      await createFAQ(formData).unwrap();
      toast.success("FAQ added successfully");
      setIsDialogOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add FAQ");
    }
  };

const handleDelete = async (id: string) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this FAQ!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });

  if (!result.isConfirmed) return;

  try {
    await deleteFAQ(id).unwrap();
    toast.success("FAQ deleted successfully");

    Swal.fire({
      title: "Deleted!",
      text: "Your FAQ has been deleted.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });

    refetch();
  } catch (err: any) {
    toast.error(err?.data?.message || "Failed to delete FAQ");

    Swal.fire({
      title: "Error!",
      text: err?.data?.message || "Failed to delete FAQ",
      icon: "error",
    });
  }
};

  return (
    <div className="p-6 min-h-screen  text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">FAQ Management</h2>
        <Button onClick={openAddDialog} className="bg-blue-600 hover:bg-blue-700">
          Add FAQ
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <Table className="min-w-full divide-y divide-gray-700">
          <TableHeader className="bg-gray-800">
            <TableRow>
              <TableHead className="text-gray-300 uppercase font-medium">Question</TableHead>
              <TableHead className="text-gray-300 uppercase font-medium">Answer</TableHead>
              <TableHead className="text-gray-300 uppercase font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faqs?.map((faq: any, index: number) => (
              <TableRow
                key={faq._id}
                className={index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"}
              >
                <TableCell>{faq.question}</TableCell>
                <TableCell>{faq.answer}</TableCell>
                <TableCell width={150}>
                  <div className="flex gap-2">
                    <Button                      
                      size="lg"
                      onClick={() => {setFormData(faq); setIsDialogOpen(true)}}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="lg"
                      onClick={() => handleDelete(faq._id)}
                      disabled={deleting}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle>{formData ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Question</label>
              <Input
                value={formData.question}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, question: e.target.value }))
                }
                placeholder="Enter question"
                className="bg-gray-700 text-gray-100 placeholder-gray-400"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Answer</label>
              <Textarea
                value={formData.answer}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, answer: e.target.value }))
                }
                placeholder="Enter answer"
                rows={4}
                className="bg-gray-700 text-gray-100 placeholder-gray-400"
              />
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button
              size="lg"
              onClick={() => setIsDialogOpen(false)}
              className="border-gray-600 text-gray-200 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={creating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FAQPage;