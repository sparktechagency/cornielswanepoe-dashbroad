"use client";

import React, { useState, useEffect } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

// ShadCN imports
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "../../ui/dialog";

import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import { Switch } from "../../ui/switch";
import { Label } from "../../ui/label";
import { Card } from "../../ui/card";
import { Input } from "../../ui/input";
import { useUpdateStockMutation } from "../../../redux/features/stock/stockApi";
import ImagesUpload from "../../Shared/ImagesUploader";

interface UpdateStockModalProps {
  open: boolean;
  onClose: () => void;
  stock: any | null;
}

export default function UpdateStockModal({
  open,
  onClose,
  stock,
}: UpdateStockModalProps) {
  if (!open || !stock) return null;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    size: "",
    location: "",
    features: [""] as string[],
    newImages: [] as File[],
    removedImageIds: [] as string[],
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBlur, setIsBlur] = useState(false);

  const [updateStock] = useUpdateStockMutation();

  const handleClose = () => {
    setImageFiles([]);
    setExistingImages([]);
    onClose();
  };

  useEffect(() => {
    if (stock) {
      setFormData({
        title: stock.title || "",
        description: stock.description || "",
        price: stock.price || "",
        size: stock.size || "",
        location: stock.location || "",
        features: stock.features?.length > 0 ? stock.features : [""],
        newImages: [],
        removedImageIds: [],
      });
      setExistingImages(stock?.images?.map((img: any) => img.url) || []);
      setIsBlur(stock?.isBlur || false);
    }
  }, [stock]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updated = [...formData.features];
    updated[index] = value;
    setFormData({ ...formData, features: updated });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ""] });
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = new FormData();
    const data = {
      title: formData.title,
      price: formData.price,
      location: formData.location,
      size: formData.size,
      description: formData.description,
      features: formData.features.filter((f) => f.trim() !== ""),
      isBlur,
    };
    payload.append("data", JSON.stringify(data));

    if (imageFiles?.length) {
      imageFiles.forEach((file) => payload.append("images", file));
    }

    try {
      const response = await updateStock({
        id: stock._id,
        payload,
      }).unwrap();

      if (response?.success) {
        toast.success(response?.message || "Stock updated successfully");
        handleClose();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update stock");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl w-full h-[80vh] overflow-auto bg-[#0D0D0D] rounded-2xl border border-primary/30 shadow-2xl shadow-black/60 p-0">
        <DialogHeader className="sticky top-0 bg-[#0D0D0D] border-b border-primary/20 rounded-t-2xl px-8 py-6 flex items-start justify-between">
          <div>
            <DialogTitle className="text-3xl font-serif text-white">
              Update Stock Listing
            </DialogTitle>
            <DialogDescription className="text-gray-400 mt-1 text-sm">
              Edit the details of this property listing
            </DialogDescription>
          </div>
          <Button
            variant="ghost"
            className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg"
            onClick={handleClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Basic Info */}
          <Card className="bg-[#111111] border border-primary/20 rounded-xl p-8">
            <h2 className="text-xl font-serif text-white mb-6">
              Basic Information
            </h2>
            <div className="space-y-6">
              <div>
                <Label className="text-gray-400 mb-2">Property Title *</Label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Exclusive Beachfront Villa"
                  className="bg-[#0A0A0A] border-primary/40 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-400 mb-2">
                  Property Description *
                </Label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Describe the property in detail..."
                  className="bg-[#0A0A0A] border-primary/40 text-white resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Minimum 100 characters recommended
                </p>
              </div>
            </div>
          </Card>

          {/* Financial Details */}
          <Card className="bg-[#111111] border border-primary/20 rounded-xl p-8">
            <h2 className="text-xl font-serif text-white mb-6">
              Financial Details
            </h2>
            <div className="space-y-6">
              <div>
                <Label className="text-gray-400 mb-2">Price Range *</Label>
                <Input
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  placeholder="e.g., R 5M - R 7M or $5M - $7M"
                  className="bg-[#0A0A0A] border-primary/40 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-400 mb-2">Size *</Label>
                <Input
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 50 - 100 hectares"
                  className="bg-[#0A0A0A] border-primary/40 text-white"
                />
              </div>
            </div>
          </Card>

          {/* Location */}
          <Card className="bg-[#111111] border border-primary/20 rounded-xl p-8">
            <h2 className="text-xl font-serif text-white mb-6">Location</h2>
            <div>
              <Label className="text-gray-400 mb-2">Location (General Area) *</Label>
              <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="e.g., Coastal Region, Western Cape"
                className="bg-[#0A0A0A] border-primary/40 text-white"
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 Tip: Keep location vague for privacy. Exact address will be shared after NDA.
              </p>
            </div>
          </Card>

          {/* Features */}
          <Card className="bg-[#111111] border border-primary/20 rounded-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif text-white">Key Features</h2>
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2 text-sm"
                onClick={addFeature}
              >
                <Plus className="w-4 h-4" /> Add Feature
              </Button>
            </div>
            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Input
                    value={feature}
                    onChange={(e:any) => handleFeatureChange(index, e.target.value)}
                    placeholder="e.g., 5 Bedrooms, Infinity Pool"
                    className="flex-1 bg-[#0A0A0A] border-primary/40 text-white"
                  />
                  {formData.features.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-gray-500 hover:text-red-400"
                      onClick={() => removeFeature(index)}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Add key features like bedrooms, bathrooms, special amenities, etc.
            </p>
          </Card>

          {/* Gallery & Blur */}
          <Card className="bg-[#111111] border border-primary/20 rounded-xl p-8">
            <h2 className="text-xl font-serif text-white mb-2">Gallery Images</h2>
            <p className="text-xs text-gray-500 mb-6">
              Existing images are shown below. Remove any you'd like to replace and upload new ones.
            </p>

            <ImagesUpload
              files={imageFiles}
              onChange={setImageFiles}
              existingImages={existingImages}
              onRemoveExisting={(index:any) =>
                setExistingImages(existingImages.filter((_, i) => i !== index))
              }
            />

            <div className="flex items-center gap-2 mt-4">
              <Switch checked={isBlur} onCheckedChange={setIsBlur} />
              <Label className="text-gray-200">Blur Image</Label>
            </div>
          </Card>

          {/* Footer Buttons */}
          <DialogFooter className="flex flex-col md:flex-row gap-4 pt-6 border-t border-primary/20">
            <Button
              type="submit"
              className="w-full md:flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full md:flex-1"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}