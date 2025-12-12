function getGeminiModels() {
  return Promise.resolve({
    models: [
      { name: 'gemini-2.0-flash-exp', displayName: 'Gemini 2.0 Flash (Experimental)' },
      { name: 'gemini-1.5-flash', displayName: 'Gemini 1.5 Flash' },
      { name: 'gemini-1.5-flash-8b', displayName: 'Gemini 1.5 Flash-8B' },
      { name: 'gemini-1.5-pro', displayName: 'Gemini 1.5 Pro' },
      { name: 'gemini-pro', displayName: 'Gemini Pro' }
    ]
  });
}

function getOpenRouterModels() {
  return Promise.resolve({
    models: [
      { name: 'google/gemini-2.0-flash-exp:free', displayName: 'Gemini 2.0 Flash (Free)' },
      { name: 'google/gemini-exp-1206:free', displayName: 'Gemini Exp 1206 (Free)' },
      { name: 'meta-llama/llama-3.3-70b-instruct:free', displayName: 'Llama 3.3 70B (Free)' },
      { name: 'qwen/qwen-2.5-72b-instruct:free', displayName: 'Qwen 2.5 72B (Free)' },
      { name: 'mistralai/mistral-7b-instruct:free', displayName: 'Mistral 7B (Free)' },
      { name: 'huggingfaceh4/zephyr-7b-beta:free', displayName: 'Zephyr 7B (Free)' },
      { name: 'openchat/openchat-7b:free', displayName: 'OpenChat 7B (Free)' },
      { name: 'openai/gpt-4o-mini', displayName: 'GPT-4o Mini (Paid)' },
      { name: 'openai/gpt-4o', displayName: 'GPT-4o (Paid)' },
      { name: 'anthropic/claude-3.5-sonnet', displayName: 'Claude 3.5 Sonnet (Paid)' },
      { name: 'anthropic/claude-3-haiku', displayName: 'Claude 3 Haiku (Paid)' }
    ]
  });
}

function getCurrentProvider() {
  return document.getElementById('provider-select').value;
}

function validateApiKey() {
  const provider = getCurrentProvider();
  
  if (provider === 'openrouter') {
    validateOpenRouterApiKey();
    return;
  }
  
  const apiKey = document.getElementById('api-key').value.trim();
  const apiKeyInput = document.getElementById('api-key');
  const validateButton = document.getElementById('validate-button');
  const selectModels = document.getElementById('models-select');
  const gptQueryInput = document.getElementById('gpt-query');

  if (!apiKey) {
    apiKeyInput.style.borderColor = 'red';
    gptQueryInput.disabled = true;
    selectModels.disabled = true;
    validateButton.classList.add('invalid');
    console.warn('API key is empty');
    return;
  }

  // Test the Gemini API key by listing models
  fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
  .then((response) => {
      if (!response.ok) {
          return response.json().then(err => {
            console.error('API validation failed:', err);
            throw new Error(err.error?.message || 'Invalid API key');
          });
      }
      return response.json();
  })
  .then((data) => {
      apiKeyInput.style.borderColor = 'green';
      gptQueryInput.disabled = false;
      selectModels.disabled = false;
      loadAndPopulateModels();
      validateButton.classList.remove('invalid');
      console.log('API key validated successfully');
  })
  .catch((error) => {
      console.error('Error occurred during API key validation:', error);
      apiKeyInput.style.borderColor = 'red';
      gptQueryInput.disabled = true;
      selectModels.disabled = true;
      validateButton.classList.add('invalid');
  });
}

function validateOpenRouterApiKey() {
  const apiKey = document.getElementById('openrouter-api-key').value.trim();
  const apiKeyInput = document.getElementById('openrouter-api-key');
  const validateButton = document.getElementById('openrouter-validate-button');
  const selectModels = document.getElementById('models-select');
  const gptQueryInput = document.getElementById('gpt-query');

  if (!apiKey) {
    apiKeyInput.style.borderColor = 'red';
    gptQueryInput.disabled = true;
    selectModels.disabled = true;
    validateButton.classList.add('invalid');
    console.warn('OpenRouter API key is empty');
    return;
  }

  // Save the key
  chrome.storage.local.set({ 'openrouter-api-key': apiKey }).then(() => {
    console.log("OpenRouter API key saved");
  });

  // Test the OpenRouter API key
  fetch('https://openrouter.ai/api/v1/auth/key', {
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  })
  .then((response) => {
      if (!response.ok) {
          throw new Error('Invalid API key');
      }
      return response.json();
  })
  .then((data) => {
      apiKeyInput.style.borderColor = 'green';
      gptQueryInput.disabled = false;
      selectModels.disabled = false;
      loadAndPopulateModels();
      validateButton.classList.remove('invalid');
      console.log('OpenRouter API key validated successfully', data);
  })
  .catch((error) => {
      console.error('Error occurred during OpenRouter API key validation:', error);
      apiKeyInput.style.borderColor = 'red';
      gptQueryInput.disabled = true;
      selectModels.disabled = true;
      validateButton.classList.add('invalid');
  });
}

function loadAndPopulateModels() {
    const provider = getCurrentProvider();
    const getModels = provider === 'openrouter' ? getOpenRouterModels : getGeminiModels;
    const storageKey = provider === 'openrouter' ? 'openrouter-model' : 'gemini-model';
    const defaultModel = provider === 'openrouter' ? 'google/gemini-2.0-flash-exp:free' : 'gemini-2.0-flash-exp';

    getModels()
        .then((response) => {
            const modelSelect = document.getElementById('models-select');

            // Clear existing options
            modelSelect.innerHTML = '';

            // Add default option
            chrome.storage.local.get([storageKey]).then((model) => {
                const savedModel = model[storageKey] || defaultModel;
                
                // Add all models
                response.models.forEach(modelInfo => {
                    const option = document.createElement('option');
                    option.value = modelInfo.name;
                    option.text = modelInfo.displayName;
                    if (modelInfo.name === savedModel) {
                        option.selected = true;
                    }
                    modelSelect.appendChild(option);
                });
            });
        })
        .catch((error) => {
            console.error('Error loading models:', error);
        });
}

document.addEventListener('DOMContentLoaded', function () {
  // Provider toggle
  document.getElementById('provider-select').addEventListener('change', function () {
    const provider = this.value;
    chrome.storage.local.set({ 'api-provider': provider }).then(() => {
      console.log("Provider saved:", provider);
    });
    
    // Toggle visibility of config sections
    document.getElementById('gemini-config').style.display = provider === 'gemini' ? 'block' : 'none';
    document.getElementById('openrouter-config').style.display = provider === 'openrouter' ? 'block' : 'none';
    
    // Enable dropdown and load models for the selected provider
    document.getElementById('models-select').disabled = false;
    document.getElementById('gpt-query').disabled = false;
    loadAndPopulateModels();
  });

  // API key save (Gemini)
  document.getElementById('api-key').addEventListener('change', function () {
    const value = document.getElementById('api-key').value.trim();
    chrome.storage.local.set({ 'gemini-api-key': value }).then(() => {
      console.log("New API key saved");
    });
    validateApiKey();
  });
  
  document.getElementById('validate-button').addEventListener('click', validateApiKey);

  // OpenRouter API key save
  document.getElementById('openrouter-api-key').addEventListener('change', function () {
    const value = document.getElementById('openrouter-api-key').value.trim();
    chrome.storage.local.set({ 'openrouter-api-key': value }).then(() => {
      console.log("OpenRouter API key saved");
    });
    validateOpenRouterApiKey();
  });
  
  document.getElementById('openrouter-validate-button').addEventListener('click', validateOpenRouterApiKey);

  document.getElementById('models-select').addEventListener('change', function () {
    const value = document.getElementById('models-select').value;
    const provider = getCurrentProvider();
    const storageKey = provider === 'openrouter' ? 'openrouter-model' : 'gemini-model';
    chrome.storage.local.set({ [storageKey]: value }).then(() => {
      console.log("Model saved:", value);
    });
  });

  // Query save
  document.getElementById('gpt-query').addEventListener('change', function () {
    const value = document.getElementById('gpt-query').value;
    console.log(value);
    chrome.storage.local.set({ 'gpt-query': value }).then(() => {
      console.log("New GPT query saved");
    });
  });

  document.getElementById('show-api-key').addEventListener('click', function (event) {
    const isChecked = document.getElementById('show-api-key').checked;
    if (isChecked) {
      document.getElementById('api-key').setAttribute('type', 'text');
      document.getElementById('openrouter-api-key').setAttribute('type', 'text');
    } else {
      document.getElementById('api-key').setAttribute('type', 'password');
      document.getElementById('openrouter-api-key').setAttribute('type', 'password');
    }
  });

  document.getElementById('window-close').addEventListener('click', function (event) {
    const isChecked = document.getElementById('window-close').checked;
    if (isChecked) {
      chrome.storage.local.set({ 'automatic-window-close': true }).then(() => {
        console.log("Automatic window close enabled");
      });
    } else {
      chrome.storage.local.set({ 'automatic-window-close': false }).then(() => {
        console.log("Automatic window close disabled");
      });
    }
  });

  // Set query by default is it is already there
  chrome.storage.local.get(['gpt-query']).then((result) => {
    document.getElementById('gpt-query').value =
      result['gpt-query'] || "You are a ghostwriter and reply to the user's tweets by talking directly to the person, you must keep it short, exclude hashtags.";
  });

  chrome.storage.local.get(['gemini-api-key']).then((result) => {
    if (result['gemini-api-key'] == undefined || result['gemini-api-key'].trim() === '') {
      document.getElementById('api-key').value = "";
      document.getElementById('validate-button').classList.add('invalid');
      
      // Show settings if API key is missing
      document.getElementById('settings-panel').style.display = 'block';
      document.getElementById('persona-section').style.display = 'none';
      document.getElementById('settings-toggle').classList.add('active');

      const selectModels = document.getElementById('models-select');
      const gptQueryInput = document.getElementById('gpt-query');
      gptQueryInput.disabled = true;
      selectModels.disabled = true;
    } else {
      document.getElementById('api-key').value = result['gemini-api-key'].trim();
      validateApiKey();
    }
  });

  // Load OpenRouter API key
  chrome.storage.local.get(['openrouter-api-key']).then((result) => {
    if (result['openrouter-api-key']) {
      document.getElementById('openrouter-api-key').value = result['openrouter-api-key'].trim();
    }
  });

  // Load saved provider
  chrome.storage.local.get(['api-provider']).then((result) => {
    const provider = result['api-provider'] || 'gemini';
    document.getElementById('provider-select').value = provider;
    document.getElementById('gemini-config').style.display = provider === 'gemini' ? 'block' : 'none';
    document.getElementById('openrouter-config').style.display = provider === 'openrouter' ? 'block' : 'none';
    
    // If provider is openrouter and has key, validate and load models
    if (provider === 'openrouter') {
      chrome.storage.local.get(['openrouter-api-key']).then((orResult) => {
        if (orResult['openrouter-api-key']) {
          // Enable the dropdown and load models
          document.getElementById('models-select').disabled = false;
          document.getElementById('gpt-query').disabled = false;
          loadAndPopulateModels();
        }
      });
    }
  });

  chrome.storage.local.get(['gemini-model']).then((result) => {
    if (result['gemini-model'] == undefined) {
      chrome.storage.local.set({ 'gemini-model': 'gemini-2.0-flash-exp' });
    }
    // Model dropdown will be populated by loadAndPopulateModels() after API validation
  });

  chrome.storage.local.get(['automatic-window-close']).then((result) => {
    if (result['automatic-window-close'] == undefined) {
      document.getElementById('window-close').checked = true;
      chrome.storage.local.set({ 'automatic-window-close': true }).then(() => {
        console.log("Automatic window close enabled");
      });
    } else {
      document.getElementById('window-close').checked = result['automatic-window-close'];
    }
  });

  chrome.commands.getAll().then((commands) => {
    console.log(commands);
    const shortcutsContainer = document.getElementById("shortcut-container");
    
    // Define the desired order
    const order = ['generate_reply', 'move_to_previous_button', 'move_to_next_button'];
    
    // Sort commands based on the defined order
    commands.sort((a, b) => {
      return order.indexOf(a.name) - order.indexOf(b.name);
    });

    commands.forEach(shortcut => {
      if (shortcut.name == "_execute_action") {
        return;
      }
      const shortcutElement = document.createElement("li");
      shortcutElement.classList.add("shortcut");
      shortcutElement.innerHTML = `
        <span class="shortcut-key">${shortcut.shortcut || 'undefined'}</span> ${shortcut.description}
      `;
      shortcutsContainer.appendChild(shortcutElement);
    });
  });

  // Add click event listener to the extension shortcuts button
  const extensionShortcutsButton = document.getElementById("extension-shortcuts-button");
  extensionShortcutsButton.addEventListener("click", function () {
    chrome.tabs.create({url: "chrome://extensions/shortcuts"});
  });

  // Settings toggle
  const settingsToggle = document.getElementById('settings-toggle');
  const settingsPanel = document.getElementById('settings-panel');
  const personaSection = document.getElementById('persona-section');
  
  settingsToggle.addEventListener('click', function() {
    settingsToggle.classList.toggle('active');
    if (settingsPanel.style.display === 'none') {
      settingsPanel.style.display = 'block';
      personaSection.style.display = 'none';
    } else {
      settingsPanel.style.display = 'none';
      personaSection.style.display = 'block';
    }
  });
}); 