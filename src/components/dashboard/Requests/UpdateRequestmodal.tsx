import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

import { toast } from "sonner";
import { useUpdateRequestMutation } from "../../../redux/features/request/requestApi";

const TOPICS = [
  { label: "Select Topic", value: "" },
  { label: "Vacant Land", value: "Vacant Land" },
  { label: "Farms", value: "Farms" },
  { label: "Hotels", value: "Hotels" },
  { label: "Investment Portfolios", value: "Investment Portfolios" },
  { label: "Residential", value: "Residential" },
  { label: "Commercial", value: "Commercial" },
];

const URGENCY = [
  { label: "Select Urgency", value: "" },
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Urgent", value: "urgent" },
];

type RequestData = {
  _id: string;
  title: string;
  topic: string;
  urgency: string;
  budgetRange: string;
  location?: string;
  description: string;
};

type FormState = Omit<RequestData, "_id">;

export default function UpdateRequestModal({
  open,
  onClose,
  request,
}: {
  open: boolean;
  onClose: () => void;
  request: any;
}) {
  const [formdata, setFormdata] = useState<FormState>({
    title: "",
    topic: "",
    urgency: "",
    budgetRange: "",
    location: "",
    description: "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [updateRequest, { isLoading }] = useUpdateRequestMutation();
  
console.log("request update", request);


  useEffect(() => {
    if (request) {
      setFormdata({
        title: request.title ?? "",
        topic: request.topic ?? "",
        urgency: request.urgency ?? "",
        budgetRange: request.budgetRange ?? "",
        location: request.location ?? "",
        description: request.description ?? "",
      });
      setErrors({});
    }
  }, [request]);

  if (!open) return null;

  const validate = () => {
    const newErrors: Partial<FormState> = {};
    if (!formdata.title.trim()) newErrors.title = "Title is required";
    if (!formdata.topic) newErrors.topic = "Please select a topic";
    if (!formdata.urgency) newErrors.urgency = "Please select urgency";
    if (!formdata.budgetRange.trim()) newErrors.budgetRange = "Budget range is required";
    if (!formdata.description.trim()) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !request?._id) return;
    try {
      const response = await updateRequest({ id: request._id, ...formdata }).unwrap();
      if (response?.success) {
        toast.success(response?.message ?? "Request updated successfully");
        onClose();
      }
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Something went wrong");
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const inputClass = (field: keyof FormState) =>
    `w-full bg-[#0D0D0D] border px-4 py-2.5 text-sm rounded placeholder-gray-600 outline-none focus:border-primary/60 transition-colors ${
      errors[field] ? "border-red-500/60" : "border-white/10"
    }`;

  const selectClass = (field: keyof FormState) =>
    `w-full bg-[#0D0D0D] border text-sm px-4 py-2.5 rounded outline-none focus:border-primary/60 transition-colors ${
      errors[field] ? "border-red-500/60" : "border-white/10"
    } ${!formdata[field] ? "text-gray-600" : "text-white"}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg bg-[#111111] border border-primary rounded-md p-6 relative">
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-primary hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="text-lg font-semibold mb-1">Update Request</h2>
        <p className="text-xs text-gray-500 mb-5">Edit the details below to update your request.</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            {/* Title */}
            <div>
              <input
                onChange={handleChange}
                name="title"
                value={formdata.title}
                placeholder="Title"
                className={inputClass("title")}
              />
              {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
            </div>

            {/* Topic + Urgency */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <select
                  onChange={handleChange}
                  name="topic"
                  value={formdata.topic}
                  className={selectClass("topic")}
                >
                  {TOPICS.map((op) => (
                    <option key={op.value} value={op.value} disabled={op.value === ""}>
                      {op.label}
                    </option>
                  ))}
                </select>
                {errors.topic && <p className="text-xs text-red-400 mt-1">{errors.topic}</p>}
              </div>

              <div>
                <select
                  onChange={handleChange}
                  name="urgency"
                  value={formdata.urgency}
                  className={selectClass("urgency")}
                >
                  {URGENCY.map((op) => (
                    <option key={op.value} value={op.value} disabled={op.value === ""}>
                      {op.label}
                    </option>
                  ))}
                </select>
                {errors.urgency && <p className="text-xs text-red-400 mt-1">{errors.urgency}</p>}
              </div>
            </div>

            {/* Budget + Location */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  onChange={handleChange}
                  name="budgetRange"
                  value={formdata.budgetRange}
                  placeholder="Budget Range (e.g. R2M – R5M)"
                  className={inputClass("budgetRange")}
                />
                {errors.budgetRange && (
                  <p className="text-xs text-red-400 mt-1">{errors.budgetRange}</p>
                )}
              </div>

              <div>
                <input
                  onChange={handleChange}
                  name="location"
                  value={formdata.location}
                  placeholder="Location (e.g. Sandton, JHB)"
                  className="w-full bg-[#0D0D0D] border border-white/10 px-4 py-2.5 text-sm rounded placeholder-gray-600 outline-none focus:border-primary/60 transition-colors"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <textarea
                onChange={handleChange}
                name="description"
                value={formdata.description}
                rows={4}
                placeholder="Describe what you are looking for..."
                className={`${inputClass("description")} resize-none`}
              />
              {errors.description && (
                <p className="text-xs text-red-400 mt-1">{errors.description}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={handleClose}
                className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary text-black px-5 py-2 rounded text-sm font-medium hover:bg-[#F1D98A] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}