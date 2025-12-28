'use client';

import { useState } from 'react';

export default function PreferencesForm() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const handleEmailNotificationsToggle = () => {
    setEmailNotifications(!emailNotifications);
    // Here you could add API call to save preferences
    console.log('Email notifications toggled:', !emailNotifications);
  };

  const handleMarketingEmailsToggle = () => {
    setMarketingEmails(!marketingEmails);
    // Here you could add API call to save preferences
    console.log('Marketing emails toggled:', !marketingEmails);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between py-3 border-b border-zinc-700">
        <div>
          <h3 className="text-white font-medium">Email Notifications</h3>
          <p className="text-zinc-400 text-sm">Receive updates about your account</p>
        </div>
        <button
          onClick={handleEmailNotificationsToggle}
          className={`relative w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 ${
            emailNotifications ? 'bg-pink-500' : 'bg-zinc-700'
          }`}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full transform transition-transform duration-200 ease-in-out ${
              emailNotifications ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
      
      <div className="flex items-center justify-between py-3 border-b border-zinc-700">
        <div>
          <h3 className="text-white font-medium">Marketing Emails</h3>
          <p className="text-zinc-400 text-sm">Receive tips and product updates</p>
        </div>
        <button
          onClick={handleMarketingEmailsToggle}
          className={`relative w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 ${
            marketingEmails ? 'bg-pink-500' : 'bg-zinc-700'
          }`}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full transform transition-transform duration-200 ease-in-out ${
              marketingEmails ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
