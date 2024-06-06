import Swiper from "swiper";
import { Pagination, A11y } from "swiper/modules";

// Ждем пока закрузится вся страница
document.addEventListener("DOMContentLoaded", () => {
  // Menu

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

  // Video
  const videoButton = document.querySelector(".js-video-play");
  videoButton.onclick = function () {
    const video = videoButton.parentElement;
    const videoIframe = document.querySelector("iframe");
    videoIframe.contentWindow.postMessage(
      JSON.stringify({ event: "command", func: "playVideo" }),
      "*"
    );
    video.classList.add("is-active");
  };

  // Testimonials
  const swiper = new Swiper(".js-testimonials-slider", {
    // configure Swiper to use modules
    modules: [Pagination, A11y],
    loop: true,
    speed: 600,
    // autoHeight: true,
    spaceBetween: 20,
    slidesPerView: 1,
    a11y: true,
    pagination: {
      el: ".testimonials-slider__pagination",
      bulletElement: "button",
      bulletClass: "testimonials-slider__pagination-bullet",
      bulletActiveClass: "testimonials-slider__pagination-bullet--active",
      clickable: true,
    },
    breakpoints: {
      769: {
        slidesPerView: "auto",
        centeredSlides: true,
        spaceBetween: 0,
        slideToClickedSlide: true,
      },
    },
  });
});
