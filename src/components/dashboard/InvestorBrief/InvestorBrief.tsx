import {
    Calendar,
    Check,
    Edit2,
    FileText,
    Image as ImageIcon,
    Plus,
    Trash2,
    Upload,
    X
} from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '../../ui/button';

interface Brief {
  id: number;
  title: string;
  description: string;
  image: string;
  publishDate: string;
  status: 'Published' | 'Draft';
}

export default function InvestorBrief() {
  const [briefs, setBriefs] = useState<Brief[]>([
    {
      id: 1,
      title: 'Q1 2024 Market Analysis',
      description: 'Comprehensive analysis of real estate investment trends in South Africa. Key highlights include coastal property appreciation, commercial sector recovery, and emerging opportunities in the agricultural space.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60',
      publishDate: '2024-02-15',
      status: 'Published',
    },
    {
      id: 2,
      title: 'Winelands Investment Opportunities',
      description: 'Exclusive insights into premium winelands estate acquisitions. Analysis covers export potential, tourism integration, and long-term appreciation forecasts for established vineyards.',
      image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&auto=format&fit=crop&q=60',
      publishDate: '2024-02-10',
      status: 'Published',
    },
    {
      id: 3,
      title: 'Coastal Development Trends',
      description: 'Deep dive into coastal property development opportunities along the Western Cape coastline. Market dynamics, zoning considerations, and investment projections included.',
      image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&auto=format&fit=crop&q=60',
      publishDate: '2024-02-05',
      status: 'Draft',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingBrief, setEditingBrief] = useState<Brief | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    publishDate: '',
    status: 'Draft' as 'Published' | 'Draft',
  });
  const [imagePreview, setImagePreview] = useState('');

  const handleCreateNew = () => {
    setEditingBrief(null);
    setImagePreview('');
    setFormData({
      title: '',
      description: '',
      image: '',
      publishDate: new Date().toISOString().split('T')[0],
      status: 'Draft',
    });
    setShowModal(true);
  };

  const handleEdit = (brief: Brief) => {
    setEditingBrief(brief);
    setImagePreview(brief.image);
    setFormData({
      title: brief.title,
      description: brief.description,
      image: brief.image,
      publishDate: brief.publishDate,
      status: brief.status,
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this brief?')) {
      setBriefs(briefs.filter(b => b.id !== id));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData({ ...formData, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formData.title || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    // Auto-set publish date when publishing
    const finalPublishDate = formData.status === 'Published' 
      ? new Date().toISOString().split('T')[0] 
      : formData.publishDate;

    if (editingBrief) {
      // Update existing
      setBriefs(briefs.map(b => 
        b.id === editingBrief.id 
          ? { ...b, ...formData, publishDate: finalPublishDate }
          : b
      ));
    } else {
      // Create new
      const newBrief: Brief = {
        id: Math.max(...briefs.map(b => b.id), 0) + 1,
        ...formData,
        publishDate: finalPublishDate,
      };
      setBriefs([newBrief, ...briefs]);
    }

    setShowModal(false);
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-white mb-1">Investor Brief Management</h1>
          <p className="text-sm text-gray-400">Create and manage investor briefs for your users</p>
        </div>
        <Button onClick={handleCreateNew} size="sm">
          <Plus className="w-4 h-4" />
          Create New Brief
        </Button>
      </div>

      {/* Briefs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {briefs.map((brief) => (
          <div key={brief.id} className="bg-[#111111] border border-primary/20 rounded-lg overflow-hidden hover:border-primary/40 transition-colors">
            {/* Image */}
            <div className="relative h-48 bg-[#1A1A1A]">
              {brief.image ? (
                <img src={brief.image} alt={brief.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-600" />
                </div>
              )}
              <div className="absolute top-3 right-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  brief.status === 'Published' 
                    ? 'bg-green-400/10 text-green-400 border border-green-400/20' 
                    : 'bg-gray-400/10 text-gray-400 border border-gray-400/20'
                }`}>
                  {brief.status}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-white font-medium mb-2 line-clamp-2">{brief.title}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-3">{brief.description}</p>
              
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-4">
                <Calendar className="w-4 h-4" />
                <span>{new Date(brief.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(brief)} className="flex-1">
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDelete(brief.id)}
                  className="text-red-400 border-red-400/20 hover:bg-red-400/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {briefs.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No briefs created yet</p>
          <Button onClick={handleCreateNew} size="sm" className="mt-4">
            <Plus className="w-4 h-4" />
            Create First Brief
          </Button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] border border-primary/20 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-primary/20 flex items-center justify-between">
              <h2 className="text-xl text-white font-medium">
                {editingBrief ? 'Edit Brief' : 'Create New Brief'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                {!imagePreview ? (
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
                        setFormData({ ...formData, image: '' });
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
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Published' | 'Draft' })}
                  className="w-full bg-black border border-primary/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
                <p className="text-gray-500 text-xs mt-2">
                  {formData.status === 'Published' 
                    ? '✓ Will be published with today\'s date automatically' 
                    : 'Save as draft and publish later'}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-primary/20 flex items-center justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Check className="w-4 h-4" />
                {editingBrief ? 'Update Brief' : 'Create Brief'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}