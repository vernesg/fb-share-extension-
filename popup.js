document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const status = document.getElementById("status");

  // Sidebar toggle
  document.querySelector(".burger").onclick = () =>
    sidebar.classList.toggle("active");

  // Back button
  document.getElementById("backBtn").onclick = () =>
    sidebar.classList.remove("active");

  // Exit button
  document.getElementById("exitBtn").onclick = () => window.close();

  // Developer button
  document.getElementById("developer").onclick = () =>
    window.open("https://www.facebook.com/notfound500", "_blank");

  // Dark/light switch
  document.getElementById("darkModeSwitch").onchange = () => {
    document.body.classList.toggle("dark");
    document.body.classList.toggle("light");
  };

  // Share button
  document.getElementById("shareBtn").onclick = () => {
    const cookie = document.getElementById("fbCookie").value.trim();
    const link = document.getElementById("postLink").value.trim();
    const limit = document.getElementById("limit").value.trim();

    if (!cookie || !link || !limit) {
      status.textContent = "Please fill all fields!";
      return;
    }

    status.textContent = "Sharing...";

    const apiUrl =
      "https://vern-rest-api.vercel.app/api/share" +
      `?cookie=${encodeURIComponent(cookie)}` +
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
  };
});