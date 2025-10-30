// Content script for GitHub Button Extension
// This script runs in the context of GitHub pages
import './index.css';

/**
 * Function to add custom button to GitHub repository pages
 */
function addGitHubButton(): void {
  // If button already exists, do nothing
  if (document.querySelector('.github-custom-button')) {
    return;
  }

  // Get repository main navigation element
  const navActions = document.querySelector<HTMLUListElement>('ul.pagehead-actions');
  if (!navActions) {
    // Try alternative selectors for newer GitHub UI
    const alternativeNav = document.querySelector('div[data-testid="action-bar"]') ||
                          document.querySelector('div[data-testid="repository-header"]') ||
                          document.querySelector('div[data-testid="repository-title"]');
    
    if (!alternativeNav) {
      return;
    }
    return;
  }

  // Get repository information from current URL
  const pathMatch = window.location.pathname.match(/^\/([^/]+)\/([^/]+)/);
  if (!pathMatch) {
    return;
  }

  const [, owner, repo] = pathMatch;

  // Create button container
  const container = document.createElement('li');
  container.className = 'github-custom-container';

  // Create BtnGroup container
  const btnGroup = document.createElement('div');
  btnGroup.setAttribute('data-view-component', 'true');
  btnGroup.className = 'BtnGroup';

  // Create button
  const button = document.createElement('a');
  button.className = 'btn-sm btn BtnGroup-item github-custom-button';
  button.href = `https://example.com/${owner}/${repo}`;
  button.target = '_blank';
  button.rel = 'noopener noreferrer';
  button.setAttribute('data-view-component', 'true');

  // Add icon
  const icon = document.createElement('span');
  icon.className = 'octicon';
  icon.innerHTML = `
    <img src="${chrome.runtime.getURL('public/icons/icon32.png')}" width="16" height="16" alt="Custom Button">
  `;

  // Add text
  const text = document.createTextNode('Custom');
  button.appendChild(icon);
  button.appendChild(text);
  btnGroup.appendChild(button);
  container.appendChild(btnGroup);

  // Add to navigation
  navActions.insertBefore(container, navActions.firstChild);
}

// Execute immediately and on DOMContentLoaded
addGitHubButton();
document.addEventListener('DOMContentLoaded', () => {
  addGitHubButton();

  // Handle GitHub SPA navigation
  let lastUrl = location.href;
  let isProcessing = false;

  const observer = new MutationObserver((_mutations: MutationRecord[]) => {
    if (isProcessing) return;
    isProcessing = true;

    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(() => {
        addGitHubButton();
        isProcessing = false;
      }, 500);
      return;
    }

    // Monitor navigation element addition (only if button doesn't exist)
    const navActions = document.querySelector<HTMLUListElement>('ul.pagehead-actions');
    const customButton = document.querySelector('.github-custom-button');
    if (navActions && !customButton) {
      addGitHubButton();
    }

    isProcessing = false;
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false,
  });
});

/**
 * Message listener - receives messages from background script
 */
chrome.runtime.onMessage.addListener(
  (
    request: { action: string; data?: unknown },
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: { success: boolean; data?: unknown; error?: string }) => void
  ) => {
    console.log('Message received in content script:', request);

    try {
      switch (request.action) {
        case 'ping':
          // Respond to ping to confirm content script is available
          sendResponse({ success: true, data: 'pong' });
          break;

        case 'addButton':
          // Handle button addition request
          addGitHubButton();
          sendResponse({ success: true });
          break;

        default:
          sendResponse({
            success: false,
            error: `Unknown action: ${request.action}`
          });
      }
    } catch (error) {
      sendResponse({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    return false; // Synchronous response
  }
);

/**
 * Initialization
 */
function initialize(): void {
  console.log('GitHub Button Extension content script initialized');
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}
