import { X } from "lucide-react";
import React, { useState } from "react";

import { toast } from "sonner";
import { useCreateRequestMutation } from "../../../redux/features/request/requestApi";

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

const initialState = {
  title: "",
  topic: "",
  urgency: "",
  budgetRange: "",
  location: "",
  description: "",
};

export default function NewRequestModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [formdata, setFormdata] = useState(initialState);
  const [errors, setErrors] = useState<Partial<typeof initialState>>({});
  const [createRequest, { isLoading }] = useCreateRequestMutation();

  if (!open) return null;

  const validate = () => {
    const newErrors: Partial<typeof initialState> = {};
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
    // clear error on change
    if (errors[name as keyof typeof initialState]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const response = await createRequest(formdata).unwrap();
      if (response?.success) {
        toast.success(response?.message ?? "Request posted successfully");
        setFormdata(initialState);
        onClose();
      }
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Something went wrong");
    }
  };

  const handleClose = () => {
    setFormdata(initialState);
    setErrors({});
    onClose();
  };

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

        <h2 className="text-lg font-semibold mb-1">Add Request</h2>
        <p className="text-xs text-gray-500 mb-5">Fill in the details to post a new property request.</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            {/* Title */}
            <div>
              <input
                onChange={handleChange}
                name="title"
                value={formdata.title}
                placeholder="Title"
                className={`w-full bg-[#0D0D0D] border px-4 py-2.5 text-sm rounded placeholder-gray-600 outline-none focus:border-primary/60 transition-colors ${
                  errors.title ? "border-red-500/60" : "border-white/10"
                }`}
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
                  className={`w-full bg-[#0D0D0D] border text-sm px-4 py-2.5 rounded outline-none focus:border-primary/60 transition-colors ${
                    errors.topic ? "border-red-500/60" : "border-white/10"
                  } ${!formdata.topic ? "text-gray-600" : "text-white"}`}
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
                  className={`w-full bg-[#0D0D0D] border text-sm px-4 py-2.5 rounded outline-none focus:border-primary/60 transition-colors ${
                    errors.urgency ? "border-red-500/60" : "border-white/10"
                  } ${!formdata.urgency ? "text-gray-600" : "text-white"}`}
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
                  className={`w-full bg-[#0D0D0D] border px-4 py-2.5 text-sm rounded placeholder-gray-600 outline-none focus:border-primary/60 transition-colors ${
                    errors.budgetRange ? "border-red-500/60" : "border-white/10"
                  }`}
                />
                {errors.budgetRange && <p className="text-xs text-red-400 mt-1">{errors.budgetRange}</p>}
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
                className={`w-full bg-[#0D0D0D] border px-4 py-2.5 text-sm rounded placeholder-gray-600 outline-none focus:border-primary/60 transition-colors resize-none ${
                  errors.description ? "border-red-500/60" : "border-white/10"
                }`}
              />
              {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
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
                {isLoading ? "Posting..." : "Post Request"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}