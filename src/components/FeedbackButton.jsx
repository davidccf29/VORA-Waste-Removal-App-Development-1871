import React, { useState } from 'react';
import { FeedbackWorkflow } from '@questlabs/react-sdk';
import questConfig from '../config/questConfig';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMessageSquare, FiChevronLeft } = FiIcons;

const FeedbackButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const getUserId = () => {
    let userId = localStorage.getItem('voraFeedbackUserId');
    if (!userId) {
      userId = `vora-feedback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('voraFeedbackUserId', userId);
    }
    return userId;
  };

  const EventTracking = () => {
    // Track feedback button click event
    console.log('Feedback button clicked', {
      timestamp: new Date().toISOString(),
      userId: getUserId(),
      page: window.location.pathname
    });
  };

  return (
    <>
      {/* Floating Feedback Button */}
      <button
        onClick={() => {
          EventTracking();
          setIsOpen((prev) => !prev);
        }}
        style={{ 
          background: questConfig.PRIMARY_COLOR,
          zIndex: 9998 // Below modal overlay but above other content
        }}
        className="flex gap-1 rounded-t-md rounded-b-none justify-end items-center px-3 text-14 leading-5 font-semibold py-2 text-white fixed top-[calc(50%-20px)] -right-10 rotate-[270deg] transition-all h-9 hover:right-0 hover:shadow-lg"
      >
        <div className="w-fit h-fit rotate-90 transition-all duration-300">
          <SafeIcon 
            icon={isOpen ? FiChevronLeft : FiMessageSquare} 
            className="w-4 h-4" 
          />
        </div>
        <p className="text-white text-sm font-medium leading-none">Feedback</p>
      </button>

      {/* Feedback Workflow Component */}
      {isOpen && (
        <div style={{ zIndex: 9999 }}>
          <FeedbackWorkflow
            uniqueUserId={getUserId()}
            questId={questConfig.QUEST_FEEDBACK_QUESTID}
            isOpen={isOpen}
            accent={questConfig.PRIMARY_COLOR}
            onClose={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: '50%',
              right: '20px',
              transform: 'translateY(-50%)',
              zIndex: 9999
            }}
          >
            <FeedbackWorkflow.ThankYou />
          </FeedbackWorkflow>
        </div>
      )}
    </>
  );
};

export default FeedbackButton;