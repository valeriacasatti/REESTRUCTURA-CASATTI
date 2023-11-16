const loginForm = document.getElementById("loginForm");
const error = document.getElementsByClassName("error");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formValues = {
    email: e.target.email.value,
    password: e.target.password.value,
  };
  const response = await fetch("/api/sessions/login", {
    method: "POST",
    body: JSON.stringify(formValues),
    headers: {
      "Content-type": "application/json",
    },
  });
  const result = await response.json();
  console.log(result);

  if (result.status === "success") {
    window.location.href = "/profile";
  } else {
    error.innerHTML = "login error";
  }
});
