document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const darkModeSwitch = document.getElementById("darkModeSwitch");
  const shareForm = document.getElementById("shareForm");
  const resultDiv = document.getElementById("result");

  const ua_list = [
    "Mozilla/5.0 (Linux; Android 10; Wildfire E Lite) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/105.0.5195.136 Mobile Safari/537.36[FBAN/EMA;FBLC/en_US;FBAV/298.0.0.10.115;]",
    "Mozilla/5.0 (Linux; Android 11; KINGKONG 5 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/87.0.4280.141 Mobile Safari/537.36[FBAN/EMA;FBLC/fr_FR;FBAV/320.0.0.12.108;]",
    "Mozilla/5.0 (Linux; Android 11; G91 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/106.0.5249.126 Mobile Safari/537.36[FBAN/EMA;FBLC/fr_FR;FBAV/325.0.1.4.108;]"
  ];

  async function extract_token(cookie, ua) {
    try {
      const response = await fetch("https://business.facebook.com/business_locations", {
        headers: {
          "user-agent": ua,
          "referer": "https://www.facebook.com/",
          "Cookie": cookie
        }
      });
      const data = await response.text();
      const tokenMatch = data.match(/(EAAG\w+)/);
      return tokenMatch ? tokenMatch[1] : null;
    } catch (err) {
      console.error('Token extraction error:', err);
      return null;
    }
  }

  async function sharePost(token, post_link, ua, cookie) {
    try {
      const params = new URLSearchParams({
        link: post_link,
        access_token: token,
        published: 0
      });
      const response = await fetch(`https://graph.facebook.com/v18.0/me/feed?${params}`, {
        method: 'POST',
        headers: {
          "user-agent": ua,
          "Cookie": cookie
        }
      });
      const data = await response.json();
      return data.id ? true : false;
    } catch (err) {
      console.error('Share error:', err);
      return false;
    }
  }

  document.querySelector(".burger").addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });

  document.getElementById("backBtn").addEventListener("click", () => {
    sidebar.classList.remove("active");
  });

  darkModeSwitch.addEventListener("change", () => {
    document.body.classList.toggle("purple-mode");
    document.body.classList.toggle("light-mode");
    chrome.storage.local.set({ darkMode: darkModeSwitch.checked });
  });

  chrome.storage.local.get("darkMode", (data) => {
    if (data.darkMode) {
      darkModeSwitch.checked = true;
      document.body.classList.remove("purple-mode");
      document.body.classList.add("light-mode");
    }
  });

  document.getElementById("home").addEventListener("click", () => {
    sidebar.classList.remove("active");
    alert("Home - Welcome to Facebook Share Tool!");
  });

  document.getElementById("shareTool").addEventListener("click", () => {
    sidebar.classList.remove("active");
    document.querySelector(".main-content").scrollIntoView({ behavior: "smooth" });
  });

  document.getElementById("settings").addEventListener("click", () => {
    sidebar.classList.remove("active");
    alert("Settings - Placeholder for settings page.");
  });

  document.getElementById("developer").addEventListener("click", () => {
    sidebar.classList.remove("active");
    window.open("https://www.facebook.com/notfound500", "_blank");
  });

  document.getElementById("exitBtn").addEventListener("click", () => {
    window.close();
  });

  function downloadFile(url, filename) {
  fetch(url)
    .then(response => response.blob())
    .then(blob => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(a.href);
    })
    .catch(err => console.error("Download error:", err));
}

// Handle share form submit
shareForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  resultDiv.innerHTML = "⏳ Processing...";
  resultDiv.style.color = "#aaa";

  const cookie = document.getElementById("cookie").value.trim();
  const post_link = document.getElementById("postLink").value.trim();
  const limit = parseInt(document.getElementById("limit").value);

  if (!cookie || !post_link || !limit) {
    resultDiv.innerHTML = "❌ Missing required fields";
    resultDiv.style.color = "red";
    return;
  }

  let success = 0;
  let failed = 0;

  for (let i = 0; i < limit; i++) {
    const ua = ua_list[Math.floor(Math.random() * ua_list.length)];
    const token = await extract_token(cookie, ua);

    if (!token) {
      failed++;
      continue;
    }

    const ok = await sharePost(token, post_link, ua, cookie);
    ok ? success++ : failed++;

    resultDiv.innerHTML = `
      ✅ Success: ${success}<br>
      ❌ Failed: ${failed}
    `;
  }

  resultDiv.style.color = success ? "lime" : "red";
});