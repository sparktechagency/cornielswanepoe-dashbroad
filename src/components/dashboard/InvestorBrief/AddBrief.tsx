import { Check, Upload, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Button } from '../../ui/button';
import { useCreateBriefMutation, useUpdateBriefMutation } from '../../../redux/features/brief/briefApi';
import { toast } from 'sonner';
import { imageUrl } from '../../../redux/base/baseAPI';

const AddBrief = ({ open, onClose, brief }: { open: boolean, onClose: () => void, brief?: any }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'inactive' as 'active' | 'inactive',
    });
    const [imagePreview, setImagePreview] = useState('');
    const [existingImage, setExistingImage] = useState('');


    const [imageFile, setImageFile] = useState<File | null>(null);
    const [addBrief] = useCreateBriefMutation();
    const [updateBrief] = useUpdateBriefMutation();

    useEffect(() => {
        if (brief) {
            setFormData({
                name: brief.name,
                description: brief.description,
                status: brief.status,
            });
            if (brief.image) {
                setExistingImage(brief.image);
            }
        }
    }, [])

    if (!open) return;

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setImageFile(file);
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImagePreview(result);
                setFormData({ ...formData });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const payload = new FormData();

        payload.append("data", JSON.stringify(formData));
        if (imageFile) {
            payload.append("image", imageFile);
        }
        try {
            if (brief) {        
                const response = await updateBrief({ id: brief._id, payload })?.unwrap();
                if (response?.success) {
                    toast.success(response?.message)
                    onClose();
                }
            } else {
                const response = await addBrief(payload)?.unwrap();
                if (response?.success) {
                    toast.success(response?.message)
                    onClose();
                }
            }
        } catch (error: any) {
            toast.error(error?.data?.message);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#111111] border border-primary/20 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-primary/20 flex items-center justify-between">
                    <h2 className="text-xl text-white font-medium">
                        {brief ? 'Edit Brief' : 'Create New Brief'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleAddOrUpdate}>
                    <div className="p-6 space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-white text-sm font-medium mb-2">
                                Title <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter brief title"
                                className="w-full bg-black border border-primary/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-white text-sm font-medium mb-2">
                                Description <span className="text-red-400">*</span>
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Enter brief description"
                                rows={6}
                                className="w-full bg-black border border-primary/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary resize-none"
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-white text-sm font-medium mb-2">
                                Cover Image
                            </label>

                            {/* Upload Button/Area */}
                            {!imageFile && existingImage ? (
                                <div className="relative rounded-lg overflow-hidden border border-primary/20">
                                    <img src={imageUrl + existingImage} alt="Preview" className="w-full h-64 object-cover" />
                                    <button onClick={() => {
                                        setExistingImage('');
                                    }} className='cursor-pointer absolute right-2 top-2 w-10 h-10 bg-white rounded-full shadow flex  items-center justify-center'><X color="red" size={20} /></button>
                                </div>

                            ) : !imagePreview ? (
                                <label className="block w-full bg-black border-2 border-dashed border-primary/20 rounded-lg p-8 text-center cursor-pointer hover:border-primary/40 transition-colors">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                    <Upload className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                                    <p className="text-white text-sm mb-1">Click to upload image</p>
                                    <p className="text-gray-500 text-xs">PNG, JPG, WEBP up to 10MB</p>
                                </label>
                            ) : (
                                <div className="relative rounded-lg overflow-hidden border border-primary/20">
                                    <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImagePreview('');
                                            setFormData({ ...formData });
                                            setImageFile(null)
                                        }}
                                        className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-lg p-2 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-white text-sm font-medium mb-2">
                                Status
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                                className="w-full bg-black border border-primary/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                            >
                                <option value="inactive">Draft</option>
                                <option value="active">Published</option>
                            </select>
                            <p className="text-gray-500 text-xs mt-2">
                                {formData.status === 'active'
                                    ? '✓ Will be published with today\'s date automatically'
                                    : 'Save as draft and publish later'}
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-primary/20 flex items-center justify-end gap-3">
                        <Button onClick={() => onClose()} variant="outline" size="lg" className='text-black!'>
                            Cancel
                        </Button>
                        <Button type="submit" size="lg">
                            <Check className="w-4 h-4" />
                            {brief ? 'Update Brief' : 'Create Brief'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddBrief