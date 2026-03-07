
// pages/PrivacyPolicy.tsx
import { useEffect, useState } from "react";
import { PageEditor } from "./PageEditor";
import { useAddDisclaimerMutation, useGetPrivacyPolicyQuery } from "../../../redux/features/setting/settingApi";
import { toast } from "sonner";

const PRIVACY_PAGE = {
  title: "Privacy Policy",
  slug: "/privacy-policy",
  lastUpdated: new Date().toISOString(),
  content: `<h1>About Investors Hub</h1>

<p>Investors Hub is the premier platform connecting discerning investors with exclusive property investment opportunities. Our mission is to democratize access to high-value real estate deals while maintaining the highest standards of privacy and professionalism.</p>

<h2>Our Story</h2>
<p>Founded in 2020, Investors Hub emerged from a simple observation: the traditional real estate investment market was fragmented, opaque, and difficult to navigate for serious investors seeking premium opportunities.</p>

<h2>What We Do</h2>
<p>We curate exceptional property investment opportunities and connect them with verified, accredited investors. Every listing on our platform undergoes rigorous vetting to ensure quality, legitimacy, and investment potential.</p>

<h2>Our Approach</h2>
<ul>
<li><strong>Privacy First:</strong> We protect both property locations and investor identities through advanced privacy features</li>
<li><strong>Quality Over Quantity:</strong> Only verified, premium listings make it to our platform</li>
<li><strong>Offline Excellence:</strong> All deals are finalized through our admin team to ensure security and professionalism</li>
<li><strong>Transparency:</strong> Clear information, honest communication, no hidden fees</li>
</ul>

<h2>Why Choose Us</h2>
<p>Unlike traditional platforms, we don't facilitate direct transactions. Instead, we serve as a sophisticated matchmaking service, introducing verified investors to curated opportunities while maintaining complete discretion throughout the process.</p>`,
  status: "draft" as const,
};

export const PrivacyPolicy = () => {
  const [page, setPage] = useState(PRIVACY_PAGE);
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

    const [addDisclaimer] = useAddDisclaimerMutation();

    const {data: privacyData} = useGetPrivacyPolicyQuery({})


  useEffect(()=>{
    if(privacyData){                
      setPage((prev)=>({...prev, content: privacyData}))
    }
  },[privacyData])
    const handleSave = async () => {
        try {
            const response = await addDisclaimer({ privacyPolicy: page.content }).unwrap();
            if (response?.success) {
                toast.success(response?.message);
                setIsSaving(true);
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