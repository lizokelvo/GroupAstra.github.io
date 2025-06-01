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



document.addEventListener('DOMContentLoaded', function() {
    // DOM элементы
    const loadingEl = document.getElementById('loading');
    const currentRateEl = document.getElementById('current-rate');
    const updateDateEl = document.getElementById('update-date');
    const conversionDateEl = document.getElementById('conversion-date');
    const amountInput = document.getElementById('amount-input');
    const fromCurrencySelect = document.getElementById('from-currency');
    const toCurrencySelect = document.getElementById('to-currency');
    const swapBtn = document.getElementById('swap-btn');
    const convertBtn = document.getElementById('convert-btn');
    const resultEl = document.getElementById('result');
    const chartPeriodSelect = document.getElementById('chart-period');
    const chartInfoEl = document.getElementById('chart-info');
    
    let currentTmtRate = 0;
    let currentDate = new Date();
    let historicalData = [];
    let currencyChart = null;
    
    // Инициализация приложения
    function init() {
        loadCurrentRate();
        setupEventListeners();
    }
    
    // Загрузка текущего курса TMT
    async function loadCurrentRate() {
        showLoading();
        try {
            const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
            if (!response.ok) throw new Error('Ошибка сети');
            
            const data = await response.json();
            
            // Проверяем наличие курса TMT
            if (!data.Valute.TMT) {
                throw new Error('Курс TMT не найден в данных ЦБ РФ');
            }
            
            // Сохраняем курс и дату
            currentTmtRate = data.Valute.TMT.Value / data.Valute.TMT.Nominal;
            currentDate = new Date(data.Date);
            
            // Обновляем интерфейс
            currentRateEl.textContent = `1 TMT = ${currentTmtRate.toFixed(4)} RUB`;
            updateDateEl.textContent = formatDate(currentDate);
            conversionDateEl.textContent = formatDate(currentDate);
            
            // Загружаем исторические данные
            loadHistoricalData();
        } catch (error) {
            console.error('Ошибка загрузки курса:', error);
            showError('Не удалось загрузить курс TMT. Попробуйте позже.');
        } finally {
            hideLoading();
        }
    }
    
    // Форматирование даты
    function formatDate(date) {
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    // Загрузка исторических данных (мок-данные)
    async function loadHistoricalData() {
        showLoading();
        try {
            const days = parseInt(chartPeriodSelect.value);
            historicalData = await generateHistoricalData(days);
            buildChart();
        } catch (error) {
            console.error('Ошибка загрузки исторических данных:', error);
            showError('Не удалось загрузить исторические данные.');
        } finally {
            hideLoading();
        }
    }
    
    // Генерация исторических данных
    async function generateHistoricalData(days) {
        const data = [];
        const today = new Date();
        
        // Для каждого дня в периоде
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            
            try {
                // Формируем URL для архивных данных
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const url = `https://www.cbr-xml-daily.ru/archive/${year}/${month}/${day}/daily_json.js`;
                
                // Загружаем данные за конкретный день
                const response = await fetch(url);
                if (!response.ok) continue;
                
                const dayData = await response.json();
                
                if (dayData.Valute.TMT) {
                    const rate = dayData.Valute.TMT.Value / dayData.Valute.TMT.Nominal;
                    data.push({
                        date: new Date(dayData.Date),
                        rate: parseFloat(rate.toFixed(4))
                    });
                }
            } catch (error) {
                console.error(`Ошибка загрузки данных за ${date.toLocaleDateString()}:`, error);
                // Если данные за день не загрузились, пропускаем этот день
                continue;
            }
        }
        
        // Если не удалось загрузить данные, используем мок-данные
        if (data.length === 0) {
            console.warn('Используются мок-данные');
            for (let i = days - 1; i >= 0; i--) {
                const date = new Date();
                date.setDate(today.getDate() - i);
                const rate = currentTmtRate * (0.95 + Math.random() * 0.1);
                data.push({
                    date: date,
                    rate: parseFloat(rate.toFixed(4))
                });
            }
        }
        
        return data;
    }
    
    // Построение графика
function buildChart() {
    const ctx = document.getElementById('currency-chart').getContext('2d');
    
    // Подготовка данных
    const labels = historicalData.map(item => 
        item.date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
    );
    
    const rates = historicalData.map(item => item.rate);
    
    // Уничтожаем предыдущий график
    if (currencyChart) {
        currencyChart.destroy();
    }
    
    // Создаем новый график
    currencyChart = new Chart(ctx, {
        type: 'bar', // Изменено на столбчатую диаграмму
        data: {
            labels: labels,
            datasets: [{
                label: 'Курс TMT к RUB',
                data: rates,
                backgroundColor: historicalData.map(() => '#1abc9c'), // Изначальный цвет всех столбцов
                borderColor: '#16a085',
                borderWidth: 1,
                borderRadius: 4, // Закругленные углы столбцов
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `1 TMT = ${context.parsed.y.toFixed(4)} RUB`;
                        }
                    }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Курс (RUB)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Дата'
                    }
                }
            },
            onClick: (e, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const selectedData = historicalData[index];
                    
                    // Выделяем выбранный столбец
                    const newBackgroundColors = historicalData.map((_, i) => 
                        i === index ? '#5282FF' : '#1abc9c'
                    );
                    
                    currencyChart.data.datasets[0].backgroundColor = newBackgroundColors;
                    currencyChart.update();
                    
                    // Показываем информацию
                    chartInfoEl.innerHTML = `
                        <p><strong>Дата:</strong> ${formatDate(selectedData.date)}</p>
                        <p><strong>Курс:</strong> 1 TMT = ${selectedData.rate.toFixed(4)} RUB</p>
                    `;
                    chartInfoEl.style.display = 'block';
                    
                    // Обновляем данные конвертации
                    currentTmtRate = selectedData.rate;
                    currentDate = selectedData.date;
                    currentRateEl.textContent = `1 TMT = ${currentTmtRate.toFixed(4)} RUB`;
                    updateDateEl.textContent = formatDate(currentDate);
                    
                    // Если есть результат конвертации, обновляем его
                    if (resultEl.style.display !== 'none') {
                        convertCurrency();
                    }
                }
            }
        }
    });
}
    
    // Конвертация валют
    function convertCurrency() {
        const amount = parseFloat(amountInput.value);
        if (isNaN(amount)) {
            showError('Введите корректную сумму');
            return;
        }
        
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;
        
        let result;
        if (fromCurrency === 'RUB' && toCurrency === 'TMT') {
            result = amount / currentTmtRate;
        } else if (fromCurrency === 'TMT' && toCurrency === 'RUB') {
            result = amount * currentTmtRate;
        } else {
            showError('Неподдерживаемая конвертация');
            return;
        }
        
        // Используем ТЕКУЩУЮ дату для конвертации
        const conversionDate = new Date();
        conversionDateEl.textContent = formatDate(conversionDate);
        
        // Форматирование результата
        const formattedAmount = amount.toLocaleString('ru-RU', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        
        const formattedResult = result.toLocaleString('ru-RU', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4
        });
        
        // Отображение результата
        resultEl.innerHTML = `
            <p>${formattedAmount} ${fromCurrency} = ${formattedResult} ${toCurrency}</p>
            <p class="rate-info">1 ${fromCurrency} = ${fromCurrency === 'RUB' ? (1/currentTmtRate).toFixed(4) : currentTmtRate.toFixed(4)} ${toCurrency}</p>
            <p class="conversion-date">Дата конвертации: ${formatDate(conversionDate)}</p>
        `;
        resultEl.style.display = 'block';
    }
    
    // Обмен валют местами
    function swapCurrencies() {
        const temp = fromCurrencySelect.value;
        fromCurrencySelect.value = toCurrencySelect.value;
        toCurrencySelect.value = temp;
    }
    
    // Показать загрузку
    function showLoading() {
        loadingEl.style.display = 'flex';
    }
    
    // Скрыть загрузку
    function hideLoading() {
        loadingEl.style.display = 'none';
    }
    
    // Показать ошибку
    function showError(message) {
        const errorEl = document.createElement('div');
        errorEl.className = 'error-message';
        errorEl.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        document.querySelector('.currency-app').prepend(errorEl);
        
        // Автоматическое удаление через 5 секунд
        setTimeout(() => {
            errorEl.remove();
        }, 5000);
    }
    
    // Настройка обработчиков событий
    function setupEventListeners() {
        // Конвертация только по нажатию кнопки
        convertBtn.addEventListener('click', convertCurrency);
        
        swapBtn.addEventListener('click', swapCurrencies);
        
        // Обновление графика при изменении периода
        chartPeriodSelect.addEventListener('change', loadHistoricalData);
        
        // Очистка результата при изменении данных
        amountInput.addEventListener('input', () => resultEl.style.display = 'none');
        fromCurrencySelect.addEventListener('change', () => resultEl.style.display = 'none');
        toCurrencySelect.addEventListener('change', () => resultEl.style.display = 'none');
    }
    
    // Запуск приложения
    init();
});