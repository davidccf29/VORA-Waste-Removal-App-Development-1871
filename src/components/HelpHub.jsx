import React from 'react';
import { HelpHub } from '@questlabs/react-sdk';
import questConfig from '../config/questConfig';

const AppHelp = () => {
  // Generate unique user ID or get from localStorage
  const getUserId = () => {
    let userId = localStorage.getItem('voraHelpUserId');
    if (!userId) {
      userId = `vora-user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('voraHelpUserId', userId);
    }
    return userId;
  };

  return (
    <HelpHub
      uniqueUserId={getUserId()}
      questId={questConfig.QUEST_HELP_QUESTID}
      accent={questConfig.PRIMARY_COLOR}
      botLogo={{
        logo: 'https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1741000949338-Vector%20%282%29.png'
      }}
      style={{
        zIndex: 9999 // Higher than navbar and sidebar
      }}
    />
  );
};

export default AppHelp;