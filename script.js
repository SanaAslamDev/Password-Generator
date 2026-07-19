(function () {
  'use strict';

  const ICONS = {
    check:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M5 13l4 4L19 7"/></svg>',
    warning:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 2.4 18a1.5 1.5 0 0 0 1.3 2.3h16.6a1.5 1.5 0 0 0 1.3-2.3L13.7 3.9a1.5 1.5 0 0 0-2.6 0Z"/></svg>',
    trash:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>',
    transfer:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M17 7 21 11l-4 4M21 11H9M7 17l-4-4 4-4M3 13h12"/></svg>',
    copy:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
    copySmall:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
    trashSmall:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>',
    user:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.5-6 8-6s8 2 8 6"/></svg>',
    vaultOff:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="36" height="36"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 4l18 16"/><circle cx="12" cy="12" r="3"/></svg>',
    eyeOpen: '<path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z"/><circle cx="12" cy="12" r="3"/>',
    eyeClosed: '<path d="M3 3l18 18"/><path d="M10.6 5.1C11 5 11.5 5 12 5c7 0 10.5 7 10.5 7a14 14 0 0 1-3.1 3.9M6.6 6.6C3.7 8.5 1.5 12 1.5 12s3.5 7 10.5 7c1.3 0 2.5-.2 3.6-.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>'
  };

  const TOAST_DURATION = 3500;
  const DEBOUNCE_DELAY = 300;

  let savedPasswords = loadSavedPasswords();
  let lastGeneratedPassword = '';
  let toastTimer = null;
  let lengthDebounceTimer = null;

  function loadSavedPasswords() {
    try {
      return JSON.parse(localStorage.getItem('keyvault_passwords') || '[]');
    } catch (e) {
      console.error('Storage load failed:', e.message);
      return [];
    }
  }

  function savePasswordsToStorage() {
    try {
      localStorage.setItem('keyvault_passwords', JSON.stringify(savedPasswords));
      return true;
    } catch (e) {
      handleStorageError(e);
      return false;
    }
  }

  function handleStorageError(error) {
    if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
      showToast('Storage is full. Delete old passwords to save new ones.', 'warning', 'error');
    } else if (error.name === 'SecurityError') {
      showToast('Storage access denied. Check privacy mode settings.', 'warning', 'error');
    } else {
      showToast('Could not save password. Try again.', 'warning', 'error');
    }
    console.error('Storage error:', error.name, error.message);
  }

  function switchTab(tabName, clickedButton) {
    document.querySelectorAll('.tab-page').forEach(function (page) {
      page.classList.remove('active');
    });

    document.querySelectorAll('.tab-button').forEach(function (button) {
      button.classList.remove('active');
      button.setAttribute('aria-selected', 'false');
    });

    document.getElementById('page-' + tabName).classList.add('active');
    clickedButton.classList.add('active');
    clickedButton.setAttribute('aria-selected', 'true');

    if (tabName === 'vault') {
      renderSavedList();
    }
  }

  function onLengthChange() {
    const slider = document.getElementById('lengthSlider');
    const numberBox = document.getElementById('lengthNumber');
    numberBox.textContent = slider.value;

    numberBox.style.transform = 'scale(1.2)';
    setTimeout(function () {
      numberBox.style.transform = 'scale(1)';
    }, 150);

    clearTimeout(lengthDebounceTimer);
    if (lastGeneratedPassword) {
      lengthDebounceTimer = setTimeout(generatePassword, DEBOUNCE_DELAY);
    }
  }

  function secureRandomInt(max) {
    const array = new Uint32Array(1);
    const limit = Math.floor(0xFFFFFFFF / max) * max;
    let value;
    do {
      crypto.getRandomValues(array);
      value = array[0];
    } while (value >= limit);
    return value % max;
  }

  function generatePassword() {
    const length = Number(document.getElementById('lengthSlider').value);

    const useUppercase = document.querySelector('#optionUppercase input').checked;
    const useLowercase = document.querySelector('#optionLowercase input').checked;
    const useNumbers   = document.querySelector('#optionNumbers input').checked;
    const useSymbols   = document.querySelector('#optionSymbols input').checked;

    let characterPool = '';
    if (useUppercase) characterPool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useLowercase) characterPool += 'abcdefghijklmnopqrstuvwxyz';
    if (useNumbers)   characterPool += '0123456789';
    if (useSymbols)   characterPool += '!$%^&*()_+-=[]{}~`|\\;:\'"<>,.?/';

    if (characterPool === '') {
      showToast('Select at least one character type', 'warning', 'error');
      return;
    }

    let newPassword = '';
    for (let i = 0; i < length; i++) {
      newPassword += characterPool[secureRandomInt(characterPool.length)];
    }

    lastGeneratedPassword = newPassword;
    document.getElementById('generatedPasswordInput').value = newPassword;
    updateStrengthMeter(newPassword);
    resetCopyButton();
  }

  function calculatePasswordStrength(password) {
    let score = 0;
    const len = password.length;

    if (len >= 8)  score++;
    if (len >= 12) score++;
    if (len >= 16) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!$%^&*()_+\-=\[\]{}~`|\\;:'"<>,.?/]/.test(password)) score++;

    if (/(.)\1{2,}/.test(password)) score--;
    
  return Math.max(0, Math.min(4, score));
  }

  function updateStrengthMeter(password) {
    const score = calculatePasswordStrength(password);

    const levels = [
      { width: '16%',  color: '#FF5B5B', label: 'Very Weak' },
      { width: '32%',  color: '#E86000', label: 'Weak' },
      { width: '55%',  color: '#D4A000', label: 'Fair' },
      { width: '78%',  color: '#5A9D36', label: 'Strong' },
      { width: '100%', color: '#1F6B85', label: 'Excellent' }
    ];

    const level = levels[score] || { width: '0%', color: '#999', label: '-' };

    const fillBar = document.getElementById('strengthFill');
    fillBar.style.width = level.width;
    fillBar.style.background = level.color;

    const textLabel = document.getElementById('strengthText');
    textLabel.textContent = level.label;
    textLabel.style.color = level.color;

    for (let i = 0; i < 5; i++) {
      const dot = document.getElementById('dot' + i);
      dot.style.background = i < score ? level.color : '#DDD';
      dot.classList.toggle('filled', i < score);
    }
  }

  function copyGeneratedPassword() {
    if (!lastGeneratedPassword) {
      showToast('Generate a password first', 'warning', 'error');
      return;
    }
    copyToClipboard(lastGeneratedPassword, function () {
      const copyBtn = document.getElementById('copyButton');
      copyBtn.classList.add('copied');
      copyBtn.innerHTML = ICONS.check;
      showToast('Password copied!', 'check', 'success');
      setTimeout(resetCopyButton, 2200);
    });
  }

  function copySavedPassword(password) {
    copyToClipboard(password, function () {
      showToast('Copied to clipboard!', 'check', 'success');
    });
  }

  function copyToClipboard(text, onSuccess) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(onSuccess)
        .catch(function () {
          fallbackCopyToClipboard(text, onSuccess);
        });
    } else {
      fallbackCopyToClipboard(text, onSuccess);
    }
  }

  function fallbackCopyToClipboard(text, onSuccess) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    
    try {
      textarea.select();
      const successful = document.execCommand('copy');
      if (successful) {
        onSuccess();
      } else {
        showToast('Copy failed. Select password manually.', 'warning', 'error');
      }
    } catch (err) {
      showToast('Copy failed. Select password manually.', 'warning', 'error');
    } finally {
      document.body.removeChild(textarea);
    }
  }

  function resetCopyButton() {
    const copyBtn = document.getElementById('copyButton');
    copyBtn.classList.remove('copied');
    copyBtn.innerHTML = ICONS.copy;
  }

  function togglePasswordVisibility() {
    const input = document.getElementById('passwordInput');
    const icon = document.getElementById('eyeIcon');
    const toggleBtn = document.getElementById('eyeToggle');

    if (input.type === 'password') {
      input.type = 'text';
      icon.innerHTML = ICONS.eyeOpen;
      toggleBtn.setAttribute('aria-label', 'Hide password');
      toggleBtn.setAttribute('aria-pressed', 'true');
    } else {
      input.type = 'password';
      icon.innerHTML = ICONS.eyeClosed;
      toggleBtn.setAttribute('aria-label', 'Show password');
      toggleBtn.setAttribute('aria-pressed', 'false');
    }
  }

  function sendGeneratedToSaveTab() {
    if (!lastGeneratedPassword) {
      showToast('Generate a password first', 'warning', 'error');
      return;
    }
    document.getElementById('passwordInput').value = lastGeneratedPassword;
    switchTab('save', document.querySelector('[data-tab="save"]'));
    showToast('Pasted into Save tab', 'transfer', 'success');
  }

  function pasteGeneratedPassword() {
    if (!lastGeneratedPassword) {
      showToast('Generate a password first', 'warning', 'error');
      return;
    }
    document.getElementById('passwordInput').value = lastGeneratedPassword;
    showToast('Password pasted', 'check', 'success');
  }

  function savePassword(event) {
    if (event) event.preventDefault();

    const site     = document.getElementById('siteNameInput').value.trim();
    const username = document.getElementById('usernameInput').value.trim();
    const password = document.getElementById('passwordInput').value.trim();

    if (!site) {
      showToast('Enter a website name', 'warning', 'error');
      document.getElementById('siteNameInput').focus();
      return;
    }
    if (!password) {
      showToast('Enter a password', 'warning', 'error');
      document.getElementById('passwordInput').focus();
      return;
    }

    savedPasswords.unshift({
      id: Date.now(),
      site: site,
      username: username,
      password: password
    });

    if (!savePasswordsToStorage()) return;
    updateVaultCount();

    document.getElementById('siteNameInput').value = '';
    document.getElementById('usernameInput').value = '';
    document.getElementById('passwordInput').value = '';

    showToast('Password saved!', 'check', 'success');
    switchTab('vault', document.querySelector('[data-tab="vault"]'));
  }

  function deletePassword(id) {
    const item = savedPasswords.find(function (p) { return p.id === id; });
    const label = item ? escapeHtml(item.site) : 'this entry';
    
    if (!confirm('Delete the password for "' + label + '"? This cannot be undone.')) {
      return;
    }
    
    savedPasswords = savedPasswords.filter(function (p) { return p.id !== id; });
    if (!savePasswordsToStorage()) return;
    updateVaultCount();
    renderSavedList();
    showToast('Deleted', 'trash', 'error');
  }

  function updateVaultCount() {
    document.getElementById('vaultCount').textContent = savedPasswords.length;
  }

  function getInitials(name) {
    const words = name.split(' ').filter(w => w.length > 0);
    let initials = '';
    
    for (let i = 0; i < words.length && initials.length < 2; i++) {
      const match = words[i].match(/[a-zA-Z0-9]/);
      if (match) initials += match[0];
    }
    
    if (!initials) {
      initials = name.substring(0, 2);
    }
    
    return (initials || '?').toUpperCase();
  }

  function escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderSavedList() {
    const listContainer = document.getElementById('savedList');

    if (savedPasswords.length === 0) {
      listContainer.innerHTML =
        '<div class="empty-message">' +
          ICONS.vaultOff +
          '<p>No passwords saved yet.</p>' +
        '</div>';
      return;
    }

    let htmlOutput = '';

    for (let i = 0; i < savedPasswords.length; i++) {
      const item = savedPasswords[i];

      htmlOutput += '<div class="saved-card" style="animation-delay:' + (i * 0.05) + 's" data-id="' + item.id + '">';
      htmlOutput += '<div class="saved-card-top">';
      htmlOutput += '<div class="saved-avatar" aria-hidden="true">' + escapeHtml(getInitials(item.site)) + '</div>';
      htmlOutput += '<div style="flex:1">';
      htmlOutput += '<div class="saved-site-name">' + escapeHtml(item.site) + '</div>';
      
      if (item.username) {
        htmlOutput += '<div class="saved-username">' + ICONS.user + escapeHtml(item.username) + '</div>';
      }
      
      htmlOutput += '</div></div>';
      htmlOutput += '<div class="saved-password-row">';
      htmlOutput += '<div class="saved-password-dots">' + '\u2022'.repeat(12) + '</div>';
      htmlOutput += '<div class="saved-actions">';
      htmlOutput += '<button type="button" class="small-icon-button copy-entry-btn" aria-label="Copy password for ' + escapeHtml(item.site) + '">' + ICONS.copySmall + '</button>';
      htmlOutput += '<button type="button" class="small-icon-button delete-button delete-entry-btn" aria-label="Delete password for ' + escapeHtml(item.site) + '">' + ICONS.trashSmall + '</button>';
      htmlOutput += '</div></div></div>';
    }

    listContainer.innerHTML = htmlOutput;
  }

  function showToast(message, iconName, type) {
    clearTimeout(toastTimer);

    const toastBox = document.getElementById('toast');
    const toastIcon = document.getElementById('toastIcon');

    document.getElementById('toastMessage').textContent = message;
    toastIcon.outerHTML = ICONS[iconName].replace('<svg ', '<svg id="toastIcon" aria-hidden="true" focusable="false" ');
    toastBox.className = 'show ' + type;

    toastTimer = setTimeout(function () {
      toastBox.className = '';
    }, TOAST_DURATION);
  }

  function init() {
    document.querySelectorAll('.tab-button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        switchTab(btn.dataset.tab, btn);
      });
    });

    document.querySelectorAll('.option-pill input').forEach(function (checkbox) {
      checkbox.addEventListener('change', function () {
        checkbox.closest('.option-pill').classList.toggle('active', checkbox.checked);
      });
    });

    document.getElementById('lengthSlider').addEventListener('input', onLengthChange);
    document.getElementById('generateButton').addEventListener('click', generatePassword);
    document.getElementById('regenerateButton').addEventListener('click', generatePassword);
    document.getElementById('copyButton').addEventListener('click', copyGeneratedPassword);
    document.getElementById('useToSaveButton').addEventListener('click', sendGeneratedToSaveTab);

    document.getElementById('eyeToggle').addEventListener('click', togglePasswordVisibility);
    document.getElementById('pasteGeneratedButton').addEventListener('click', pasteGeneratedPassword);
    document.getElementById('saveForm').addEventListener('submit', savePassword);

    document.getElementById('savedList').addEventListener('click', function (e) {
      const copyBtn = e.target.closest('.copy-entry-btn');
      const deleteBtn = e.target.closest('.delete-entry-btn');
      
      if (copyBtn) {
        const card = copyBtn.closest('.saved-card');
        const item = savedPasswords.find(function (p) { return p.id === Number(card.dataset.id); });
        if (item) copySavedPassword(item.password);
      }
      
      if (deleteBtn) {
        const card = deleteBtn.closest('.saved-card');
        deletePassword(Number(card.dataset.id));
      }
    });

    updateVaultCount();
    renderSavedList();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();