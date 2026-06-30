
  // ============================================
  // ICON LIBRARY - small reusable SVG icons used by JS-generated HTML
  // ============================================

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


// ============================================
  // STEP 1: Load saved passwords from browser storage
  // ============================================
  let savedPasswords = JSON.parse(localStorage.getItem('keyvault_passwords') || '[]');
  let lastGeneratedPassword = '';
  let toastTimer;

  function savePasswordsToStorage() {
    localStorage.setItem('keyvault_passwords', JSON.stringify(savedPasswords));
  }


  // ============================================
  // STEP 2: Tab switching
  // ============================================
  function switchTab(tabName, clickedButton) {
    // hide all pages
    document.querySelectorAll('.tab-page').forEach(function (page) {
      page.classList.remove('active');
    });
    // unselect all tab buttons
    document.querySelectorAll('.tab-button').forEach(function (button) {
      button.classList.remove('active');
    });

    // show the chosen page and select the clicked button
    document.getElementById('page-' + tabName).classList.add('active');
    clickedButton.classList.add('active');

    if (tabName === 'vault') {
      renderSavedList();
    }
  }


  // ============================================
  // STEP 3: Toggle the option pills (uppercase, lowercase, etc)
  // ============================================
  function toggleOption(pillId, checkbox) {
    document.getElementById(pillId).classList.toggle('active', checkbox.checked);
  }


  // ============================================
  // STEP 4: Update the length number when slider moves
  // ============================================
  function onLengthChange() {
    const slider = document.getElementById('lengthSlider');
    const numberBox = document.getElementById('lengthNumber');
    numberBox.textContent = slider.value;

    // small bounce animation
    numberBox.style.transform = 'scale(1.2)';
    setTimeout(function () {
      numberBox.style.transform = 'scale(1)';
    }, 150);

    // if a password was already generated, refresh it live
    if (lastGeneratedPassword) {
      generatePassword();
    }
  }


  // ============================================
  // STEP 5: Generate a random password
  // ============================================
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
    if (useSymbols)   characterPool += '!@#$%^&*()-_=+[]{}';

    if (characterPool === '') {
      showToast('Pick at least one option', 'warning', 'error');
      return;
    }

    // build the random password
    let newPassword = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characterPool.length);
      newPassword += characterPool[randomIndex];
    }

    lastGeneratedPassword = newPassword;

    // type it out letter by letter (animation)
    const outputBox = document.getElementById('generatedPasswordInput');
    outputBox.value = '';
    typeOutPassword(outputBox, newPassword, 0);

    updateStrengthMeter(newPassword);
    resetCopyButton();
  }

  // recursive typing animation helper
  function typeOutPassword(inputBox, fullPassword, currentIndex) {
    if (currentIndex > fullPassword.length) return;
    inputBox.value = fullPassword.slice(0, currentIndex);
    if (currentIndex < fullPassword.length) {
      setTimeout(function () {
        typeOutPassword(inputBox, fullPassword, currentIndex + 1);
      }, 18);
    }
  }


  // ============================================
  // STEP 6: Strength meter logic
  // ============================================
  function updateStrengthMeter(password) {
    let score = 0;
    if (password.length >= 8)  score++;
    if (password.length >= 14) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const strengthLevels = [
      { width: '16%',  color: '#ff5c72', label: 'Very Weak' },
      { width: '32%',  color: '#ff8c42', label: 'Weak' },
      { width: '55%',  color: '#f5c842', label: 'Fair' },
      { width: '78%',  color: '#22d3a3', label: 'Strong' },
      { width: '100%', color: '#6c63ff', label: 'Excellent' }
    ];

    const levelIndex = score - 1; // 0 to 4
    const level = strengthLevels[Math.min(levelIndex, 4)] || { width: '0%', color: '#4e5571', label: '-' };

    const fillBar = document.getElementById('strengthFill');
    fillBar.style.width = level.width;
    fillBar.style.background = level.color;

    const textLabel = document.getElementById('strengthText');
    textLabel.textContent = level.label;
    textLabel.style.color = level.color;

    // light up the dots
    for (let i = 0; i < 5; i++) {
      const dot = document.getElementById('dot' + i);
      const shouldBeFilled = i <= levelIndex;
      dot.style.background = shouldBeFilled ? level.color : 'var(--border-light)';
      dot.classList.toggle('filled', shouldBeFilled);
    }
  }


  // ============================================
  // STEP 7: Copy generated password
  // ============================================
  function copyGeneratedPassword() {
    if (!lastGeneratedPassword) {
      showToast('Generate a password first', 'warning', 'error');
      return;
    }

    navigator.clipboard.writeText(lastGeneratedPassword);

    const copyBtn = document.getElementById('copyButton');
    copyBtn.classList.add('copied');
    copyBtn.innerHTML = ICONS.check;

    showToast('Password copied!', 'check', 'success');

    setTimeout(resetCopyButton, 2200);
  }

  function resetCopyButton() {
    const copyBtn = document.getElementById('copyButton');
    copyBtn.classList.remove('copied');
    copyBtn.innerHTML = ICONS.copy;
  }


  // ============================================
  // STEP 8: Show/hide password text on Save tab
  // ============================================
  function togglePasswordVisibility() {
    const input = document.getElementById('passwordInput');
    const icon = document.getElementById('eyeIcon');

    if (input.type === 'password') {
      input.type = 'text';
      icon.innerHTML = ICONS.eyeClosed;
    } else {
      input.type = 'password';
      icon.innerHTML = ICONS.eyeOpen;
    }
  }


  // ============================================
  // STEP 9: Send generated password to Save tab
  // ============================================
  function sendGeneratedToSaveTab() {
    if (!lastGeneratedPassword) {
      showToast('Generate a password first', 'warning', 'error');
      return;
    }
    document.getElementById('passwordInput').value = lastGeneratedPassword;

    const saveTabButton = document.querySelectorAll('.tab-button')[1];
    switchTab('save', saveTabButton);

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


  // ============================================
  // STEP 10: Save a password to the vault
  // ============================================
  function savePassword() {
    const site     = document.getElementById('siteNameInput').value.trim();
    const username = document.getElementById('usernameInput').value.trim();
    const password = document.getElementById('passwordInput').value.trim();

    if (site === '') {
      showToast('Enter a website name', 'warning', 'error');
      return;
    }
    if (password === '') {
      showToast('Enter a password', 'warning', 'error');
      return;
    }

    // add new entry to the top of the list
    savedPasswords.unshift({
      id: Date.now(),
      site: site,
      username: username,
      password: password
    });

    savePasswordsToStorage();
    updateVaultCount();

    // clear the form
    document.getElementById('siteNameInput').value = '';
    document.getElementById('usernameInput').value = '';
    document.getElementById('passwordInput').value = '';

    showToast('Password saved!', 'check', 'success');

    const vaultTabButton = document.querySelectorAll('.tab-button')[2];
    switchTab('vault', vaultTabButton);
  }


  // ============================================
  // STEP 11: Delete a password from the vault
  // ============================================
  function deletePassword(id) {
    savedPasswords = savedPasswords.filter(function (item) {
      return item.id !== id;
    });
    savePasswordsToStorage();
    updateVaultCount();
    renderSavedList();
    showToast('Deleted', 'trash', 'error');
  }


  // ============================================
  // STEP 12: Copy a saved password
  // ============================================
  function copySavedPassword(password) {
    navigator.clipboard.writeText(password);
    showToast('Copied to clipboard!', 'check', 'success');
  }


  // ============================================
  // STEP 13: Update the number badge on Vault tab
  // ============================================
  function updateVaultCount() {
    document.getElementById('vaultCount').textContent = savedPasswords.length;
  }


  // ============================================
  // STEP 14: Get initials for the avatar circle
  // ============================================
  function getInitials(name) {
    const words = name.split(' ');
    let initials = '';
    for (let i = 0; i < words.length && initials.length < 2; i++) {
      if (words[i][0]) initials += words[i][0];
    }
    return initials.toUpperCase() || '??';
  }


  // ============================================
  // STEP 15: Draw the saved passwords list on screen
  // ============================================
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

      htmlOutput += '<div class="saved-card" style="animation-delay:' + (i * 0.05) + 's">';

      htmlOutput += '<div class="saved-card-top">';
      htmlOutput += '<div class="saved-avatar">' + getInitials(item.site) + '</div>';
      htmlOutput += '<div style="flex:1">';
      htmlOutput += '<div class="saved-site-name">' + escapeHtml(item.site) + '</div>';
      if (item.username) {
        htmlOutput += '<div class="saved-username">' + ICONS.user + escapeHtml(item.username) + '</div>';
      }
      htmlOutput += '</div>';
      htmlOutput += '</div>';

      htmlOutput += '<div class="saved-password-row">';
      htmlOutput += '<div class="saved-password-dots">' + '\u2022'.repeat(12) + '</div>';
      htmlOutput += '<div class="saved-actions">';
      htmlOutput += '<button class="small-icon-button" onclick="copySavedPassword(\'' + escapeForAttribute(item.password) + '\')">' + ICONS.copySmall + '</button>';
      htmlOutput += '<button class="small-icon-button delete-button" onclick="deletePassword(' + item.id + ')">' + ICONS.trashSmall + '</button>';
      htmlOutput += '</div>';
      htmlOutput += '</div>';

      htmlOutput += '</div>';
    }

    listContainer.innerHTML = htmlOutput;
  }


  // ============================================
  // STEP 16: Helper functions to keep text safe
  // ============================================
  function escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function escapeForAttribute(text) {
    return text.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  }


  // ============================================
  // STEP 17: Show toast popup message
  // ============================================
  function showToast(message, iconName, type) {
    clearTimeout(toastTimer);

    const toastBox = document.getElementById('toast');
    const toastIcon = document.getElementById('toastIcon');

    document.getElementById('toastMessage').textContent = message;
    toastIcon.outerHTML = ICONS[iconName].replace('<svg ', '<svg id="toastIcon" ');
    toastBox.className = 'show ' + type;

    toastTimer = setTimeout(function () {
      toastBox.className = '';
    }, 2400);
  }


  // ============================================
  // STEP 18: Run on page load
  // ============================================
  updateVaultCount();
  renderSavedList();