// Get DOM elements
const burger = document.getElementById('burger');
const navLinks = document.getElementById('nav-links');
const darkModeSwitch = document.getElementById('darkModeSwitch');
const developerBtn = document.getElementById('developer');
const shareBtn = document.getElementById('shareBtn');
const statusEl = document.getElementById('status');

const cookieInput = document.getElementById('cookie');
const linkInput = document.getElementById('link');
const limitInput = document.getElementById('limit');

// -----------------------------
// Navbar burger toggle
// -----------------------------
burger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// -----------------------------
// Dark/Light mode toggle
// -----------------------------
darkModeSwitch.addEventListener('change', () => {
  document.body.classList.toggle('dark');
  document.body.classList.toggle('light');
});

// -----------------------------
// Developer button
// -----------------------------
developerBtn.addEventListener('click', () => {
  window.open('https://www.facebook.com/notfound500', '_blank');
});

// -----------------------------
// Share button click
// -----------------------------
shareBtn.addEventListener('click', async () => {
  const cookie = cookieInput.value.trim();
  const link = linkInput.value.trim();
  const limit = limitInput.value.trim();

  if (!cookie || !link || !limit) {
    statusEl.textContent = '❌ Please fill all fields!';
    statusEl.style.color = '#fecaca';
    return;
  }

  statusEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
  statusEl.style.color = '#fff';

  try {
    const response = await fetch(
      `https://vern-rest-api.vercel.app/api/share?cookie=${encodeURIComponent(cookie)}&link=${encodeURIComponent(link)}&limit=${encodeURIComponent(limit)}`,
      { method: 'GET' }
    );
    const result = await response.json();

    if (result.status) {
      statusEl.textContent = `✅ Shared ${result.success_count} times!`;
      statusEl.style.color = '#d1fae5';
    } else {
      statusEl.textContent = `❌ ${result.message || 'Failed to share.'}`;
      statusEl.style.color = '#fecaca';
    }
  } catch (err) {
    statusEl.textContent = '❌ Error! Check your network or cookie.';
    statusEl.style.color = '#fecaca';
    console.error(err);
  }
});

// -----------------------------
// Optional: auto-fill cookie from active Facebook tab
// -----------------------------
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs[0];
  if (!tab) return;

  chrome.cookies.getAll({ url: 'https://www.facebook.com' }, (cookies) => {
    const cUser = cookies.find(c => c.name === 'c_user');
    const xs = cookies.find(c => c.name === 'xs');
    if (cUser && xs) {
      cookieInput.value = `c_user=${cUser.value}; xs=${xs.value};`;
    }
  });
});