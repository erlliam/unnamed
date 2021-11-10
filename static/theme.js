const toggle = document.querySelector("#togglebutton");
const body = document.body.classList;

toggle.addEventListener("click", () => {
  body.toggle("dark-theme");

  if (body.contains("dark-theme")) {
    localStorage.setItem("dark-mode", "enabled");
  } else {
    localStorage.setItem("dark-mode", "disabled");
  }
});

if (localStorage.getItem("dark-mode") == "enabled") {
  body.toggle("dark-theme");
  toggle.checked = true;
}
