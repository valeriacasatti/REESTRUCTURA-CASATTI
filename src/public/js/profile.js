document.addEventListener("DOMContentLoaded", async () => {
  const welcome = document.getElementById("welcome");

  const response = await fetch("/api/sessions/profile", {
    headers: { "Content-type": "application/json" },
    method: "POST",
  });
  const result = await response.json();
  if (result.status == "success") {
    welcome.innerHTML = `Welcome ${result.data.name}!`;
  } else {
    window.location.href = "/";
  }
});
