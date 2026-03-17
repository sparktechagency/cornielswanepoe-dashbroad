import { Badge, FileText, Loader2, Save } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Textarea } from '../../ui/textarea';

const initData = {
    content: `We value your privacy and are committed to protecting your personal information.
    
    Information We Collect: When you create an account, we may collect your name, email, location, and details you choose to share about your child (such as age, diagnosis, and interests).
    
    How We Use It: This information is used only to help connect you with other parents, improve our services, and ensure a safe community.
    
    Data Sharing: We do not sell or share your personal data with third parties for marketing. Data is only shared if required by law or to protect community safety.
    
    Security: Your data is encrypted and stored securely. We take all reasonable steps to protect it from unauthorized access.
    
    Your Control: You can update or delete your profile at any time through the app settings.
    
    By using this app, you agree to this Privacy Policy. If you have any questions, please contact us at [support@email.com].`,
    lastUpdated: "5/1/2024",
    updatedBy: "Admin",
    status: "published"
}


const PrivacyPolicy = () => {
    const [loading, setLoading] = useState(false);
    const [privacySettings, setPrivacySettings] = useState(initData);
    const [isEditingPrivacy, setIsEditingPrivacy] = useState(false);



    const handleSavePrivacy = async () => {
        setLoading(true);        
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsEditingPrivacy(false);
        setLoading(false);
    };


    return (
        <Card className="border-none shadow-sm max-w-6xl mx-auto">
            <CardContent className="px-8 pb-8">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Privacy Policy</h2>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                <span>Last updated: {privacySettings.lastUpdated}</span>
                                <span>By: {privacySettings.updatedBy}</span>
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                    Published
                                </Badge>
                            </div>
                        </div>
                        {!isEditingPrivacy && (
                            <Button
                                onClick={() => setIsEditingPrivacy(true)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                <FileText className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                        )}
                    </div>

                    {isEditingPrivacy ? (
                        <>
                            <Textarea
                                value={privacySettings.content}
                                onChange={(e) => setPrivacySettings({ ...privacySettings, content: e.target.value })}
                                className="min-h-100 font-mono text-sm"
                            />
                            <div className="flex gap-3">
                                <Button
                                    onClick={handleSavePrivacy}
                                    disabled={loading}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                                <Button
                                    onClick={() => setIsEditingPrivacy(false)}
                                    variant="outline"
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="prose max-w-none">
                            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                                {privacySettings.content}
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default PrivacyPolicy