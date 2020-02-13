import options from '../js/options.js';

class App {
	constructor(options) {
		this.state = {...options}
		this.step = 0;

		this.contentSelector = document.querySelector('.victorine__content');
		this.dotsSelector = document.querySelector('.victorine__dots');
    
    /* ответы */
    this.responses = [];

    /* история ответов */
    this.historyChoices = [];
    
		/* Инициализация проекта */
		this.init();
	}
	init = () => {
    this.renderContent();
    this.renderDots();
    
    this.contentSelector.addEventListener('click', this.choiceAnswer);
    this.dotsSelector.addEventListener('click', this.choiceStep);
  }
  choiceAnswer = (event) => {
    const target = event.target;

    if(!target.closest('.victorine__answer button')) return;

    const answerName = target.getAttribute('data-answer');

    if(this.state.questions[this.step].proper == answerName) {
      this.responses[this.step] = true;
    } else {
      this.responses[this.step] = false;
    }

    this.historyChoices[this.step] = answerName;

    this.nextStep();
  }
	nextStep = () => {
    if(this.step == this.state.questions.length-1) {
      this.finish();
      
      return false;
    }

    this.step++;

    document.querySelectorAll('.victorine__dot')[this.step].classList.add('active');

		this.renderContent();
  }
  finish() {
    const countProperAnswer = this.responses.filter(item => item == true).length;

    alert(`Вы ответили на ${countProperAnswer} правильных ответа из ${this.state.questions.length}`);

    this.responses = [];
    this.historyChoices = [];
    this.step = 0;

    this.renderContent();
    this.renderDots();
  }
  choiceStep = (event) => {
    const target = event.target;

    if(!target.closest('.victorine__dot.active')) return;

    const id = target.getAttribute('data-id');
    
    this.step = id;

    this.renderContent();
  }
	renderContent() {
    /* Изменение фона */
    document.querySelector('.victorine').style.background = `#${this.state.colors[this.step]}`;

    /* Очистка контента вопросов и ответов */
    this.contentSelector.innerHTML = '';

    /* Отрисовка вопросов и ответов */
    const answers = this.state.questions[this.step].answers
      .map(answer => `
        <div class="victorine__answer">
          <button 
          class="${this.historyChoices[this.step] == answer ? 'active' : 'no-active'}" 
          data-answer="${answer}"
          ></button>
          <span>${answer}</span>
        </div>
      `)
      .join('');

    this.contentSelector.innerHTML = `
      <div class="victorine__question">${this.state.questions[this.step].title}</div>
      <div class="victorine__answers">${answers}</div>
    `;
  }
  renderDots() {
    /* Очистка контента шагов */
    this.dotsSelector.innerHTML = '';

    /* Отрисовка шагов */
    this.state.questions.forEach((step, index) => {
			if(index == 0) {
				this.dotsSelector.innerHTML +=`
					<div class="victorine__dot active" data-id=${index}>${index+1}</div>
				`;
			} else {
				this.dotsSelector.innerHTML +=`
					<div class="victorine__dot" data-id=${index}>${index+1}</div>
				`;
			}
    });
  }
}

new App(options);