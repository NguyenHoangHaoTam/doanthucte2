//chuyen dong cua silde
let currentSlide = 0;
const slides = [
  '/anh/anh1.jpg',
  '/anh/anh3.jpg',
  '/anh/anh4.jpg'
];

const slideImage = document.getElementById('slide');

function showSlide(index) {
  slideImage.style.opacity = 0;
  setTimeout(() => {
    currentSlide = (index + slides.length) % slides.length;
    slideImage.src = slides[currentSlide];
    slideImage.style.opacity = 1; 
  }, 300);
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

function prevSlide() {
  showSlide(currentSlide - 1);
}

setInterval(() => {
  nextSlide();
}, 4000);
//logo dien thoaithoai
const callButton = document.querySelector('.call-button');

window.addEventListener('scroll', () => {
  let scrollTop = window.scrollY;
  let windowHeight = window.innerHeight;
  callButton.style.top = (scrollTop + windowHeight - 100) + 'px';
});


