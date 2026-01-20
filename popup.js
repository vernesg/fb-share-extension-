document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const status = document.getElementById("status");

  document.querySelector(".burger").onclick = () =>
    sidebar.classList.toggle("active");

  document.getElementById("backBtn").onclick = () =>
    sidebar.classList.remove("active");

  document.getElementById("exitBtn").onclick = () => window.close();

  document.getElementById("developer").onclick = () =>
    window.open("https://www.facebook.com/notfound500", "_blank");

  document.getElementById("darkModeSwitch").onchange = () => {
    document.body.classList.toggle("dark");
    document.body.classList.toggle("light");
  };

  document.getElementById("shareBtn").onclick = () => {
    const link = document.getElementById("postLink").value.trim();
    const limit = document.getElementById("limit").value.trim();

    if (!link || !limit) {
      status.textContent = "Missing input!";
      return;
    }

    status.textContent = "Sharing...";

    chrome.cookies.getAll({ domain: "facebook.com" }, (cookies) => {
      const cookieStr = cookies.map(c => `${c.name}=${c.value}`).join("; ");

      const apiUrl =
        "https://vern-rest-api.vercel.app/api/share" +
        `?cookie=${encodeURIComponent(cookieStr)}` +
        `&link=${encodeURIComponent(link)}` +
        `&limit=${encodeURIComponent(limit)}`;

      fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
          status.textContent = data.message || "Done";
        })
        .catch(() => {
          status.textContent = "Error!";
        });
    });
  };
});