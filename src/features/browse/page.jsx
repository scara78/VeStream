import React from 'react';

const SettingsPage = () => {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="bg-card p-6 rounded-lg shadow-sm">
        <p className="text-muted-foreground">This is where user settings will go.</p>
        <p className="text-muted-foreground mt-2">You can customize your profile, preferences, and more here.</p>
      </div>
    </div>
  );
};

export default SettingsPage;