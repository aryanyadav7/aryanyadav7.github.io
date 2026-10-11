const menu = document.getElementById("menu");
const links = document.getElementById("links");
if (menu && links) {
  menu.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    menu.setAttribute("aria-expanded", String(open));
  });
  links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    links.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
  }));
}
const progress = document.getElementById("progress");
function updateProgress() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${max > 0 ? scrollY / max * 100 : 0}%`;
}
addEventListener("scroll", updateProgress, {passive:true});
updateProgress();
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
}), {threshold:.12});
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
document.getElementById("year").textContent = new Date().getFullYear();
const form = document.getElementById("contactForm");
if (form) form.addEventListener("submit", () => {
  const button = form.querySelector(".submit");
  button.disabled = true;
  button.querySelector("span").textContent = "Sending…";
  setTimeout(() => {
    if (document.visibilityState === "visible") {
      button.disabled = false;
      button.querySelector("span").textContent = "Send message";
    }
  }, 12000);
});
