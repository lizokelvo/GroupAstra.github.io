// Активация меню-бургера
document.querySelector('.menu-btn').addEventListener('click', function() {
    document.querySelector('.sidebar').classList.toggle('active');
    this.classList.toggle('opened');
});

// Плавная прокрутка для кнопки "Наверх"
document.querySelector('.back-to-top').addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Фиксация кнопки "Наверх"
window.addEventListener('scroll', function() {
    const backToTop = document.querySelector('.back-to-top');
    backToTop.style.display = window.pageYOffset > 300 ? 'flex' : 'none';
});

// Анимация при прокрутке
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});


// Обработка кликов по новостным карточкам
document.addEventListener('DOMContentLoaded', function() {
  // Получаем все новостные карточки
  const newsCards = document.querySelectorAll('.news-card');
  
  // Для каждой карточки добавляем обработчики
  newsCards.forEach(card => {
    // Находим ссылку "Подробнее" внутри карточки
    const readMoreLink = card.querySelector('.read-more');
    
    // 1. Обработчик для клика по всей карточке
    card.addEventListener('click', function(e) {
      // Проверяем, не был ли клик по самой ссылке или её дочерним элементам
      if (!e.target.closest('.read-more')) {
        // Получаем URL из атрибута data-url или из ссылки "Подробнее"
        const url = card.dataset.url || readMoreLink.href;
        
        // Переходим по ссылке
        if (url) {
          window.location.href = url;
        }
      }
    });
    
    // 2. Обработчик для клика по ссылке "Подробнее"
    readMoreLink.addEventListener('click', function(e) {
      e.stopPropagation(); // Останавливаем всплытие события
      
      // Добавляем анимацию загрузки
      const spinner = document.createElement('div');
      spinner.className = 'news-spinner';
      spinner.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      this.appendChild(spinner);
      
      // Задержка для демонстрации анимации (в реальном проекте можно убрать)
      setTimeout(() => {
        window.location.href = this.href;
      }, 300);
    });
    
    // 3. Добавляем эффект при наведении
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
      this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
      readMoreLink.querySelector('i').style.transform = 'translateX(5px)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = '';
      this.style.boxShadow = '';
      readMoreLink.querySelector('i').style.transform = '';
    });
  });
  
  // Анимация появления карточек при загрузке
  const newsGrid = document.querySelector('.news-grid');
  if (newsGrid) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          
          // Анимация для каждой карточки по очереди
          const cards = entry.target.querySelectorAll('.news-card');
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, index * 100);
          });
        }
      });
    }, { threshold: 0.1 });
    
    observer.observe(newsGrid);
    
    // Инициализация начального состояния для анимации
    newsGrid.style.opacity = '0';
    newsGrid.style.transform = 'translateY(20px)';
    newsGrid.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    
    const cards = newsGrid.querySelectorAll('.news-card');
    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s ease';
    });
  }
});