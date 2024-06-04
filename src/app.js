// Ждем пока закрузится вся страница
document.addEventListener("DOMContentLoaded", () => {
  // Найти кнопку на странице
  const button = document.querySelector(".js-menu-toggle");

  // Добавить событие по клику
  button.onclick = function () {
    // Добавить/убрать класс "opened" и установить атрибут aria-expanded в значение true или false.
    if (button.classList.contains("menu__toggle--active")) {
      button.classList.remove("menu__toggle--active");
      button.setAttribute("aria-expanded", "false");
    } else {
      button.classList.add("menu__toggle--active");
      button.setAttribute("aria-expanded", "true");
    }
  };
});
