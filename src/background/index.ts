// Background script (Service Worker) for GitHub Button Extension
// This script runs in the background and handles events

/**
 * Type definitions for messages
 */
interface Message {
  action: string;
  data?: unknown;
}

interface MessageResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

/**
 * Function to inject content scripts into GitHub tabs
 */
const injectContentToTab = async (tab: chrome.tabs.Tab): Promise<void> => {
  // Skip if URL is undefined
  if (!tab.url) {
    return;
  }

  // Skip if tab is discarded
  if (tab.discarded) {
    return;
  }

  // Skip if tab ID is undefined
  if (tab.id === undefined) {
    return;
  }

  // Skip if not a GitHub URL
  if (!tab.url.startsWith('https://github.com/')) {
    return;
  }

  try {
    const manifest = chrome.runtime.getManifest();

    // Inject CSS
    if (manifest.content_scripts?.[0]?.css) {
      await chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: manifest.content_scripts[0].css,
      });
    }

    // Inject JavaScript
    if (manifest.content_scripts?.[0]?.js) {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: manifest.content_scripts[0].js,
      });
    }
  } catch (error) {
    console.error('Error injecting content script:', error);
  }
};

/**
 * Listen for extension installation or update
 */
chrome.runtime.onInstalled.addListener((details: chrome.runtime.InstalledDetails) => {
  if (details.reason === 'install') {
    console.log('GitHub Button Extension installed successfully');

    // Initialize default settings or perform setup tasks
    chrome.storage.local.set({
      initialized: true,
      installedAt: new Date().toISOString()
    });

    // Inject content scripts into existing GitHub tabs
    chrome.tabs.query({}, async (tabs: chrome.tabs.Tab[]) => {
      const injectionPromises = tabs.map(async (tab) => {
        try {
          await injectContentToTab(tab);
        } catch (e) {
          console.error(e);
        }
      });
      
      await Promise.allSettled(injectionPromises);
    });
  } else if (details.reason === 'update') {
    const previousVersion = details.previousVersion;
    const currentVersion = chrome.runtime.getManifest().version;
    console.log(`GitHub Button Extension updated from ${previousVersion} to ${currentVersion}`);
    
    // Re-inject content scripts after update
    chrome.tabs.query({}, async (tabs: chrome.tabs.Tab[]) => {
      const injectionPromises = tabs.map(async (tab) => {
        try {
          await injectContentToTab(tab);
        } catch (e) {
          console.error(e);
        }
      });
      
      await Promise.allSettled(injectionPromises);
    });
  }
});

/**
 * Listen for extension icon clicks
 */
chrome.action.onClicked.addListener(async (tab: chrome.tabs.Tab) => {
  if (!tab.id) {
    console.warn('No tab ID available');
    return;
  }

  // Check if the tab is a restricted page where content scripts can't run
  if (tab.url && (
    tab.url.startsWith('chrome://') ||
    tab.url.startsWith('chrome-extension://') ||
    tab.url.startsWith('edge://') ||
    tab.url.startsWith('moz-extension://') ||
    tab.url.startsWith('about:')
  )) {
    console.warn('Cannot access content script on restricted page:', tab.url);
    return;
  }

  // Only work on GitHub pages
  if (!tab.url || !tab.url.startsWith('https://github.com/')) {
    console.warn('Extension only works on GitHub pages');
    return;
  }

  try {
    // First, check if content script is injected by sending a test message
    const testResponse = await chrome.tabs.sendMessage(
      tab.id,
      { action: 'ping' } as Message
    ) as MessageResponse;

    if (testResponse && testResponse.success) {
      // Content script is available, send the actual message
      const response = await chrome.tabs.sendMessage(
        tab.id,
        { action: 'addButton' } as Message
      ) as MessageResponse;

      if (response.success) {
        console.log('Button added successfully:', response.data);
      } else {
        console.error('Button addition failed:', response.error);
      }
    }
  } catch (error) {
    // This error often occurs when content script hasn't loaded yet
    if (error instanceof Error) {
      console.error('Error sending message:', error.message);

      if (error.message.includes('Could not establish connection')) {
        console.warn('Content script not available. Attempting to inject it...');
        
        try {
          // Try to inject the content script programmatically
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['src/content/index.ts']
          });
          
          console.log('Content script injected successfully');
          
          // Now try sending the message again
          const response = await chrome.tabs.sendMessage(
            tab.id,
            { action: 'addButton' } as Message
          ) as MessageResponse;
          
          if (response.success) {
            console.log('Button added successfully after injection:', response.data);
          } else {
            console.error('Button addition failed after injection:', response.error);
          }
        } catch (injectError) {
          console.error('Failed to inject content script:', injectError);
        }
      }
    }
  }
});

/**
 * Listen for messages from content scripts or other parts of the extension
 */
chrome.runtime.onMessage.addListener(
  (
    request: Message,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: MessageResponse) => void
  ) => {
    console.log('Message received in background:', request);

    // Handle different message actions
    switch (request.action) {
      case 'getTabInfo':
        // Example: Get tab information
        if (sender.tab) {
          sendResponse({
            success: true,
            data: {
              url: sender.tab.url,
              title: sender.tab.title,
              id: sender.tab.id
            }
          });
        } else {
          sendResponse({
            success: false,
            error: 'No tab information available'
          });
        }
        return false;

      default:
        sendResponse({
          success: false,
          error: `Unknown action: ${request.action}`
        });
        return false;
    }
  }
);

// Listen for tab updates to inject content scripts when needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('https://github.com/')) {
    console.log(`GitHub tab ${tabId} finished loading: ${tab.url}`);
    
    // Inject content script into the updated tab
    void injectContentToTab(tab);
  }
});

// Listen for new tabs
chrome.tabs.onCreated.addListener((tab) => {
  if (tab.url && tab.url.startsWith('https://github.com/')) {
    console.log(`New GitHub tab created: ${tab.url}`);
    
    // Wait a bit for the tab to load, then inject content script
    setTimeout(() => {
      void injectContentToTab(tab);
    }, 1000);
  }
});

console.log('GitHub Button Extension background service worker initialized');
