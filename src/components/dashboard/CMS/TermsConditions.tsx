// pages/TermsConditions.tsx
import { useEffect, useState } from "react";
import { PageEditor } from "./PageEditor";
import { useAddDisclaimerMutation, useGetTermsConditionQuery } from "../../../redux/features/setting/settingApi";
import { toast } from "sonner";

const TERMS_PAGE = {
    title: "Terms & Conditions",
    slug: "/terms-conditions",
    lastUpdated: new Date().toISOString(),
    content: `
    <h1>Terms & Conditions</h1>
    <p>Welcome to our platform. By accessing or using our services, you agree to be bound by these Terms & Conditions.</p>

    <h2>1. Acceptance of Terms</h2>
    <p>By accessing and using this platform, you accept and agree to be bound by these terms and all applicable laws and regulations.</p>

    <h2>2. Use of Services</h2>
    <p>You agree to use our services only for lawful purposes and in a manner that does not infringe the rights of others.</p>

    <h2>3. User Accounts</h2>
    <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>

    <h2>4. Intellectual Property</h2>
    <p>All content, trademarks, and intellectual property on this platform are owned by us or our licensors.</p>

    <h2>5. Limitation of Liability</h2>
    <p>We shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services.</p>

    <h2>6. Changes to Terms</h2>
    <p>We reserve the right to modify these terms at any time. Continued use of the platform constitutes acceptance of updated terms.</p>

    <h2>7. Contact Us</h2>
    <p>If you have any questions about these Terms & Conditions, please contact us.</p>
  `,
    status: "draft" as const,
};

export const TermsConditions = () => {
    const [page, setPage] = useState(TERMS_PAGE);
    const [editMode, setEditMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [addDisclaimer] = useAddDisclaimerMutation();
    const { data: termsData } = useGetTermsConditionQuery({})


    useEffect(() => {
        if (termsData) {
            setPage((prev) => ({ ...prev, content: termsData }))
        }
    }, [termsData])


    const handleSave = async () => {
        try {
            const response = await addDisclaimer({ termsOfService: page.content }).unwrap();
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