// Content script for GitHub Button Extension
// This script runs in the context of GitHub pages

// Function to add custom button to GitHub repository pages
function addCustomButton(): void {
  // If button already exists, do nothing
  if (document.querySelector('.custom-button')) {
    return;
  }

  // Get repository main navigation element
  const navActions = document.querySelector<HTMLUListElement>('ul.pagehead-actions');
  if (!navActions) {
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
  container.className = 'custom-container';

  // Create BtnGroup container
  const btnGroup = document.createElement('div');
  btnGroup.setAttribute('data-view-component', 'true');
  btnGroup.className = 'BtnGroup';

  // Create button
  const button = document.createElement('a');
  button.className = 'btn-sm btn BtnGroup-item custom-button';
  button.href = `https://example.com/${owner}/${repo}`;
  button.target = '_blank';
  button.rel = 'noopener noreferrer';
  button.setAttribute('data-view-component', 'true');

  // Add icon
  const icon = document.createElement('span');
  icon.className = 'octicon';
  icon.innerHTML = `
    <img src="${chrome.runtime.getURL('public/icons/icon64.png')}" width="16" height="16" alt="Custom Button">
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
addCustomButton();
document.addEventListener('DOMContentLoaded', () => {
  addCustomButton();

  // Handle GitHub SPA navigation
  let lastUrl = location.href;
  let isProcessing = false;

  const observer = new MutationObserver((mutations: MutationRecord[]) => {
    if (isProcessing) return;
    isProcessing = true;

    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(() => {
        addCustomButton();
        isProcessing = false;
      }, 500);
      return;
    }

    // Monitor navigation element addition (only if button doesn't exist)
    const navActions = document.querySelector<HTMLUListElement>('ul.pagehead-actions');
    const customButton = document.querySelector('.custom-button');
    if (navActions && !customButton) {
      addCustomButton();
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
