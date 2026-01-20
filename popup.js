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
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      })
      .catch(err => console.error('Download failed:', err));
  }

  document.getElementById("downloadCookieGetter").addEventListener("click", () => {
    downloadFile("https://github.com/vernesg/cookie-getter-extension/archive/refs/heads/main.zip", "cookie-getter-extension.zip");
  });

  const modal = document.getElementById("tutorialModal");
  const closeModal = document.getElementById("closeModal");
  const downloadFromModal = document.getElementById("downloadFromModal");

  document.getElementById("tutorial").addEventListener("click", () => {
    sidebar.classList.remove("active");
    modal.style.display = "block";
  });

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  downloadFromModal.addEventListener("click", () => {
    downloadFile(
      "https://github.com/vernesg/cookie-getter-extension/archive/refs/heads/main.zip",
      "cookie-getter-extension.zip"
    );
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  shareForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    resultDiv.textContent = "Extracting token, please wait...";

    const cookie = document.getElementById("cookieInput").value.trim();
    if (!cookie) {
      resultDiv.textContent = "Please enter a valid cookie.";
      return;
    }

    let token = null;

    for (const ua of ua_list) {
      token = await extract_token(cookie, ua);
      if (token) break;
    }

    if (token) {
      resultDiv.innerHTML = `
        <strong>Access Token Found:</strong><br>
        <textarea readonly style="width:100%;height:80px;">${token}</textarea>
      `;
    } else {
      resultDiv.textContent = "Failed to extract access token.";
    }
  });

});