// pages/About.tsx
import { useEffect, useState } from "react";
import { PageEditor } from "./PageEditor";
import { useAddDisclaimerMutation, useGetAboutQuery } from "../../../redux/features/setting/settingApi";
import { toast } from "sonner";

const ABOUT_PAGE = {
    title: "About Us",
    slug: "/about",
    lastUpdated: new Date().toISOString(),
    content: "",
    status: "draft" as const,
};

export const About = () => {
    const [page, setPage] = useState(ABOUT_PAGE);
    const [editMode, setEditMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [addDisclaimer] = useAddDisclaimerMutation();
    const {data: aboutData} = useGetAboutQuery({})

    
  useEffect(()=>{
    if(aboutData){                
      setPage((prev)=>({...prev, content: aboutData?.data}))
    }
  },[aboutData])

    const handleSave = async () => {
        try {
            const response = await addDisclaimer({ aboutUs: page.content }).unwrap();
            if (response?.success) {
                toast.success(response?.message);
                setIsSaving(false);
            }
        } catch (error: any) {
            toast.error(error?.data?.message);
            setIsSaving(false);
        }
    };

    return (
        <PageEditor
            currentPage={page}
            editMode={editMode}
            isSaving={isSaving}
            onToggleEditMode={() => setEditMode((prev) => !prev)}
            onSave={handleSave}
            onContentChange={(value) => setPage((prev) => ({ ...prev, content: value }))}
        />
    );
};