
import { ImageIcon, Save, Upload, User, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Button } from '../../ui/button';
import { useEditProfileMutation, useGetProfileQuery } from '../../../redux/features/user/userApi';
import { imageUrl } from '../../../redux/base/baseAPI';
import { toast } from 'sonner';


const PersonalInformation = () => {

  const [form, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profileImage: ''
  });

  const [existingProfile, setExistingProfile] = useState("")

  const [imagePreview, setImagePreview] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [file, setFile] = useState<any>(null)

  const { data: profileData } = useGetProfileQuery({});
  const [editProfile] = useEditProfileMutation()


  useEffect(() => {
    if (profileData) {
      console.log("profileData", profileData);
      
      setFormData((prev) => ({ ...prev, name: profileData.name, email: profileData.email, phone: profileData.phone }))
      setExistingProfile(profileData?.image || '')
    }
  }, [profileData])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setFile(file)
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData((prev) => ({ ...prev, profileImage: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async() => {
   try {
    const formData = new FormData();
    const data = {
      name: form.name,
      phone: form.phone,
    }
    formData.append("data", JSON.stringify(data));
    if(file){
      formData.append("image", file);
    }

    const response = await editProfile(formData).unwrap();
    if(response?.success){
      toast.success(response?.message);

    }
   } catch (error:any) {
    toast.error(error?.data?.message);
   }
  };


  return (
    <>
      {/* Profile Image */}
      <div className="bg-[#111111] border border-primary/20 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-serif text-white">Profile Image</h2>
            <p className="text-sm text-gray-400">Update your profile picture</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Current/Preview Image */}
          <div className="relative">
            {!file && existingProfile ? (<div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary/20">
              <img
                src={imageUrl + existingProfile}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>) : imagePreview ? (
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary/20">
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-[#1A1A1A] border-2 border-primary/20 flex items-center justify-center">
                <User className="w-10 h-10 text-gray-500" />
              </div>
            )}
          </div>

          {/* Upload Button */}
          <div className="flex-1">
            <label className="inline-block">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] border border-primary/20 rounded-lg text-white hover:bg-[#2A2A2A] transition-colors">
                <Upload className="w-4 h-4" />
                Upload New Image
              </div>
            </label>
            {(imagePreview) && (
              <button
                onClick={() => {
                  setImagePreview('');
                  setFormData((prev) => ({ ...prev, profileImage: '' }));
                }}
                className="ml-2 inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
              >
                <X className="w-4 h-4" />
                Remove
              </button>
            )}
            <p className="text-xs text-gray-500 mt-2">JPG, PNG or WEBP. Max size 2MB.</p>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-[#111111] border border-primary/20 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-400/10 flex items-center justify-center">
            <User className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-serif text-white">Profile Information</h2>
            <p className="text-sm text-gray-400">Update your personal details</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setFormData({ ...form, name: e.target.value })}
              className="w-full bg-[#1A1A1A] border border-primary/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={form.email}
              disabled
              className="w-full bg-[#0A0A0A] border border-primary/20 rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed"
              placeholder="Enter your email"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed for security reasons</p>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setFormData({ ...form, phone: e.target.value })}

              className="w-full bg-[#1A1A1A] border border-primary/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
              placeholder="Enter your phone number"
            />
          </div>

          <div className="pt-4">
            <Button
              onClick={handleSaveProfile}
              disabled={isSaving}
              size="sm"
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PersonalInformation;