const navigation = document.querySelector(".navigation");
const toggle = document.querySelector(".navigation__toggle");

toggle.addEventListener("click", function() {
  if (toggle.classList.contains("navigation__closed")) {
    toggle.classList.remove("navigation__closed");
    toggle.classList.add("navigation__opened");
    navigation.style.display = "block";
  } else {
    toggle.classList.add("navigation__closed");
    toggle.classList.remove("navigation__opened");
    navigation.style.display = "none";
  }
});