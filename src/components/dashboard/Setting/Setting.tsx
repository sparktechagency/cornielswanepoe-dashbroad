import ChangePassword from './ChangePassword';
import PersonalInformation from './PersonnalInformation';


export default function Settings() {
 
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-serif text-white mb-1">Account Settings</h1>
        <p className="text-sm text-gray-400">Manage your profile and security settings</p>
      </div>

      <div className="max-w-3xl space-y-6">
       
        {/* Personal Information */}
        <PersonalInformation />

        {/* Change Password */}
       <ChangePassword />
      </div>
    </div>
  );
}