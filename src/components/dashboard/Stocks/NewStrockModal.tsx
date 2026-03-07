
import React, { useState } from "react";

import { ArrowLeft, Plus, X, ImageIcon } from "lucide-react";

import { toast } from "sonner";
import { useCreateStockMutation } from "../../../redux/features/stock/stockApi";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";

// const CATEGORIES = [
//   "Residential",
//   "Commercial",
//   "Agricultural",
//   "Industrial",
//   "Mixed-Use",
//   "Land",
// ];


const initState = {
    category: "Residential",
    title: "",
    description: "",
    price: "",        // renamed from priceRange
    size: "",         // new field
    location: "",
    features: [""],
    galleryImages: [] as File[],
}
export default function CreateNewStrockModal({ open, onClose }: { open: boolean, onClose: () => void }) {

    // Add "size" to formData state
    const [formData, setFormData] = useState(initState);
    const [isBlur, setIsBlur] = useState(false);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
    const [createStock] = useCreateStockMutation()

    if (!open) return null;

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
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

    const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        setFormData({
            ...formData,
            galleryImages: [...formData.galleryImages, ...files],
        });

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setGalleryPreviews((prev) => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeGalleryImage = (index: number) => {
        setFormData({
            ...formData,
            galleryImages: formData.galleryImages.filter((_, i) => i !== index),
        });
        setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    // Corrected handleSubmit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = new FormData();

        // Build the "data" JSON object matching expected schema
        const data = {
            title: formData.title,
            price: formData.price,
            location: formData.location,
            size: formData.size,
            description: formData.description,
            isBlur,
            features: formData.features.filter((f) => f.trim() !== ""),
        };

        payload.append("data", JSON.stringify(data));

        // Append each image under key "images"
        formData.galleryImages.forEach((file) => {
            payload.append("images", file);
        });

        try {
            const response = await createStock(payload)?.unwrap();
            console.log("response", response);

            if (response?.success) {
                toast.success(response?.message)
                onClose()
            }
        } catch (error: any) {
            toast.error(error?.data?.message)
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 ">
            <div className="w-full max-w-6xl bg-[#111111] border border-primary rounded-md p-6 relative overflow-y-auto h-[90vh] ">

                <div className="flex items-center justify-between">
                    <div className="mb-8">
                        <h1 className="text-4xl font-serif text-primary mb-2">Add New Stock Listing</h1>
                        <p className="text-gray-400">Create a new property listing for the exclusive marketplace</p>
                    </div>
                    <Button onClick={() => onClose()}>
                        <X color="white" />
                    </Button>
                </div>


                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <div className="bg-[#111111] border border-primary/20 rounded-xl p-8">
                        <h2 className="text-xl font-serif text-white mb-6">Basic Information</h2>

                        <div className="space-y-6">
                            {/* Category */}
                            {/* <div>
                <label className="block text-sm text-gray-400 mb-2">Property Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0A0A0A] border border-primary/40 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div> */}

                            {/* Title */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Property Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., Modern Coastal Villa"
                                    className="w-full bg-[#0A0A0A] border border-primary/40 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Property Description *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows={6}
                                    placeholder="Provide detailed description of the property, including key features, condition, and unique selling points..."
                                    className="w-full bg-[#0A0A0A] border border-primary/40 rounded-lg px-4 py-3 text-white focus:border-primary outline-none resize-none"
                                />
                                <p className="text-xs text-gray-500 mt-2">Minimum 100 characters recommended</p>
                            </div>
                        </div>
                    </div>

                    {/* Financial Details */}
                    <div className="bg-[#111111] border border-primary/20 rounded-xl p-8">
                        <h2 className="text-xl font-serif text-white mb-6">Financial Details</h2>

                        {/* Price Range */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Price Range *</label>
                            <input
                                type="text"
                                name="price"              // was "priceRange"
                                value={formData.price}    // was formData.priceRange
                                onChange={handleChange}
                                required
                                placeholder="e.g., R 5M - R 7M or $5M - $7M"
                                className="w-full mb-4 bg-[#0A0A0A] border border-primary/40 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
                            />
                        </div>
                        {/* Size */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Size *</label>
                            <input
                                type="text"
                                name="size"
                                value={formData.size}
                                onChange={handleChange}
                                required
                                placeholder="e.g., 50 - 100 hectares"
                                className="w-full bg-[#0A0A0A] border border-primary/40 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div className="bg-[#111111] border border-primary/20 rounded-xl p-8">
                        <h2 className="text-xl font-serif text-white mb-6">Location</h2>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Location (General Area) *</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Coastal Region, Western Cape (Exact location hidden)"
                                className="w-full bg-[#0A0A0A] border border-primary/40 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                💡 Tip: Keep location vague for privacy. Exact address will be shared after NDA.
                            </p>
                        </div>
                    </div>

                    {/* Key Features */}
                    <div className="bg-[#111111] border border-primary/20 rounded-xl p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-serif text-white">Key Features</h2>
                            <button
                                type="button"
                                onClick={addFeature}
                                className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/30 rounded-lg hover:bg-primary/20 transition-all text-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Add Feature
                            </button>
                        </div>

                        <div className="space-y-3">
                            {formData.features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3"
                                >
                                    <input
                                        type="text"
                                        value={feature}
                                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                                        placeholder="e.g., 5 Bedrooms, Infinity Pool, Home Cinema"
                                        className="flex-1 bg-[#0A0A0A] border border-primary/40 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
                                    />
                                    {formData.features.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeFeature(index)}
                                            className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-4">
                            Add key features like bedrooms, bathrooms, special amenities, etc.
                        </p>
                    </div>

                    {/* Gallery Images Upload */}
                    <div className="bg-[#111111] border border-primary/20 rounded-xl p-8">

                        <div className="flex justify-between">
                            <h2 className="text-xl font-serif text-white mb-6">Images</h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                            {galleryPreviews.map((preview, index) => (
                                <div
                                    key={index}
                                    className="relative group"
                                >
                                    <img
                                        src={preview}
                                        alt={`Gallery ${index}`}
                                        className="w-full h-32 object-cover rounded-lg border border-primary/20"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeGalleryImage(index)}
                                        className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-3 h-3 text-white" />
                                    </button>
                                </div>
                            ))}

                            {/* Add More Button */}
                            <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-primary/40 rounded-lg cursor-pointer hover:border-primary transition-all bg-[#0A0A0A]">
                                <ImageIcon className="w-8 h-8 text-primary mb-2" />
                                <span className="text-xs text-gray-400">Add Images</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleGalleryUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <div className="flex items-center space-x-2 mt-3">
                            <Switch
                                id="blur-image"
                                checked={isBlur}
                                onCheckedChange={(checked:any) => setIsBlur(checked)}
                            />
                            <Label htmlFor="blur-image" className="text-gray-200 text-sm">
                                Blur Image
                            </Label>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex items-center gap-4 pt-6 border-t border-primary/20">
                        <Button type="submit" size="lg"  className="flex-1 bg-primary! sm:flex-none">
                            Publish Listing
                        </Button>
                        <button
                            type="button"
                            onClick={() => onClose()}
                            className="flex-1 sm:flex-none px-6 py-3 bg-[#1A1A1A] text-white border border-primary/20 rounded-lg hover:border-primary hover:bg-[#2A2A2A] transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}