'use strict';
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
/////////
///Page navigation
//this is not a good solutions
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = el.getAttribute('href');
//     // console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });

//     //console.log('LINK');
//   });
// });
//Button Scrolling
btnScrollTo.addEventListener('click', function (e) {
  const s1cooreds = section1.getBoundingClientRect();
  console.log(s1cooreds);
  console.log(e.target.getBoundingClientRect());
  console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);
  console.log(
    'Height/width Viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // Scrolling
  // window.scrollTo(
  //   s1cooreds.left + window.pageXOffset,
  //   s1cooreds.top + window.pageYOffset
  // );
  // Anotherw way to do this
  // window.scrollTo({
  //   left: s1cooreds.left + window.pageXOffset,
  //   top: s1cooreds.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });
  // another easy way to scroll
  section1.scrollIntoView({ behavior: 'smooth' });
});

//////////////////////////////
//Tab Component
tabsContainer.addEventListener('click', function (e) {
  //e.preventDefault();
  const clicked = e.target.closest('.operations__tab');

  //console.log(clicked);
  //gaurd clause
  if (!clicked) return;
  //remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  //console.log(clicked.dataset.tab);
  //active tab
  clicked.classList.add('operations__tab--active');
  //active content
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});
//Scroll to All Nav Link
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  //matching strategy
  if (e.target.classList.contains('nav__link')) {
    const i = e.target.getAttribute('href');
    document.querySelector(i).scrollIntoView({ behavior: 'smooth' });
  }
});
//Hover Function for Nav element hovering
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;

    const siblings = link.closest('.nav').querySelectorAll('.nav__link');

    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;

      logo.style.opacity = this;
    });
  }
};
// nav.addEventListener('mouseover', function (e) {
//   handleHover(e, 0.5);
// });
// nav.addEventListener('mouseout', function (e) {
//   handleHover(e, 1);
// });
//another way do this
//Passing "Arguments" to Event Handlers
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

//sticky Navigation
// const initialCoord = section1.getBoundingClientRect();
// console.log(initialCoord.top);
// window.addEventListener('scroll', function (e) {
//   console.log(this.window.scrollY);
//   if (this.window.scrollY > initialCoord.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });
/////////////////////////
//sticky Navigation:The Intersection Observer API
// const observerCallBack = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };
// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };
// const observer = new IntersectionObserver(observerCallBack, obsOptions);

// observer.observe(section1);
const stickNav = function (entries) {
  const [entry] = entries;
  //console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
//console.log(navHeight);

const observerHeader = new IntersectionObserver(stickNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
observerHeader.observe(header);
//Reveal section
const allSection = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  //console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const Sectionobserber = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSection.forEach(section => {
  Sectionobserber.observe(section);
  section.classList.add('section--hidden');
});
//Lazy Loading
const targetImage = document.querySelectorAll('img[data-src]');
const loadImg = function (entries, observer) {
  const [entry] = entries;
  //console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imgobserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
targetImage.forEach(img => imgobserver.observe(img));
//Slide component
const slide = function () {
  let curslide = 0;
  const btnleft = document.querySelector('.slider__btn--left');
  const btnright = document.querySelector('.slider__btn--right');
  const slides = document.querySelectorAll('.slide');
  const dotsCpntainer = document.querySelector('.dots');
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotsCpntainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };
  const activeDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  dotsCpntainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activeDot(slide);
    }
  });
  const maxSlide = slides.length - 1;
  // const slider = document.querySelector('.slider');

  // slider.style.transform = 'scale(0.4) tanslateX(-800px)';

  // slider.style.overflow = 'visible';

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  const intia = function () {
    createDots();
    goToSlide(0);
    activeDot(0);
  };
  intia();
  const nextSlide = function () {
    if (curslide === maxSlide) {
      curslide = 0;
    } else {
      curslide++;
    }
    goToSlide(curslide);
    activeDot(curslide);
  };

  const previousSlide = function () {
    curslide === 0 ? (curslide = maxSlide) : curslide--;
    goToSlide(curslide);
    activeDot(curslide);
  };
  btnright.addEventListener('click', nextSlide);
  btnleft.addEventListener('click', previousSlide);
  document.addEventListener('keydown', function (e) {
    console.log(e);
    if (e.key === 'ArrowLeft') previousSlide();
    e.key === 'ArrowRight' && nextSlide();
  });
};
slide();
