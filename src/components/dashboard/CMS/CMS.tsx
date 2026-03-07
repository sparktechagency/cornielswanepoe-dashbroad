import {
  CheckCircle,
  Clock,
  Globe
} from 'lucide-react';
import { useState } from 'react';
import { About } from './AboutUs';
import { PrivacyPolicy } from './PrivacyPolicy';
import { TermsConditions } from './TermsConditions';


export default function CMS() {
  const [selectedPage, setSelectedPage] = useState('about');

  const [pages, setPages] = useState([
    {
      id: 'about',
      title: 'About Us',
      slug: '/about',
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      slug: '/privacy',
    },
    {
      id: 'terms',
      title: 'Terms & Conditions',
      slug: '/terms',
    },
  ]);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-serif text-white mb-1">Content Management System</h1>
        <p className="text-sm text-gray-400">Edit and manage website pages and content</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Pages Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-[#111111] border border-primary/20 rounded-lg p-4">
            <h2 className="text-lg font-serif text-white mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Pages
            </h2>
            <div className="space-y-2">
              {pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => {
                    setSelectedPage(page.id);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-all ${selectedPage === page.id
                    ? 'bg-primary/20 border border-primary'
                    : 'bg-[#1A1A1A] border border-transparent hover:border-primary/40'
                    }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-white font-medium text-sm">{page.title}</p>
                    <Clock className="w-4 h-4 text-orange-400 shrink-0" />
                  </div>
                  <p className="text-gray-400 text-xs">{page.slug}</p>

                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Editor Area */}
        {selectedPage === 'about' && <About />}
        {selectedPage === 'privacy' && <PrivacyPolicy />}
        {selectedPage === 'terms' && <TermsConditions />}
      </div>
    </div>
  );
}
