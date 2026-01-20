const burger = document.getElementById('burger');
const navLinks = document.getElementById('nav-links');
const darkModeSwitch = document.getElementById('darkModeSwitch');
const developerBtn = document.getElementById('developer');
const tutorialsBtn = document.getElementById('tutorials');
const backBtn = document.getElementById('backBtn');
const shareBtn = document.getElementById('shareBtn');
const statusEl = document.getElementById('status');

const cookieInput = document.getElementById('cookie');
const linkInput = document.getElementById('link');
const limitInput = document.getElementById('limit');

// ---------------- Navbar toggle
burger.addEventListener('click', () => navLinks.classList.toggle('active'));

// ---------------- Dark/Light toggle
darkModeSwitch.addEventListener('change', () => {
  document.body.classList.toggle('dark');
  document.body.classList.toggle('light');
});

// ---------------- Developer button
developerBtn.addEventListener('click', () => window.open('https://www.facebook.com/notfound500', '_blank'));

// ---------------- Tutorials button
tutorialsBtn.addEventListener('click', () => {
  window.open('tutorial.html', '_blank');
});

// ---------------- Back button
backBtn.addEventListener('click', () => window.open('features.html', '_self'));

// ---------------- Share button
shareBtn.addEventListener('click', async () => {
  const cookie = cookieInput.value.trim();
  const link = linkInput.value.trim();
  const limit = limitInput.value.trim();

  if (!cookie || !link || !limit) {
    statusEl.textContent = '❌ Please fill all fields!';
    statusEl.style.color = '#fecaca';
    return;
  }

  statusEl.innerHTML = '<i class="fas fa-spinner fa-spin icon"></i> Processing...';
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
    statusEl.textContent = '❌ Error! Check network or cookie.';
    statusEl.style.color = '#fecaca';
    console.error(err);
  }
});

// ---------------- Auto-fill FB cookie (simple)
chrome.tabs.query({active:true,currentWindow:true}, tabs=>{
  const tab = tabs[0]; if(!tab) return;
  chrome.cookies.getAll({url:'https://www.facebook.com'}, cookies=>{
    const cUser = cookies.find(c=>c.name==='c_user');
    const xs = cookies.find(c=>c.name==='xs');
    if(cUser && xs) cookieInput.value=`c_user=${cUser.value}; xs=${xs.value};`;
  });
});