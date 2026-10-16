/* 原生模态故事抽屉：键盘关闭、焦点回还、最后一段完成。 */
(function (global) {
  'use strict';
  let card;
  let action;
  function init() {
    card = document.getElementById('storyCard');
    card.querySelector('.story-card-close').addEventListener('click', close);
    card.querySelector('[data-next]').addEventListener('click', () => { if (action) action(); });
    card.addEventListener('click', (event) => {
      const rect = card.getBoundingClientRect();
      if (event.target === card && (event.clientY < rect.top || event.clientY > rect.bottom || event.clientX < rect.left || event.clientX > rect.right)) close();
    });
  }
  function open(options) {
    card.querySelector('[data-step]').textContent = options.step;
    card.querySelector('[data-title]').textContent = options.title;
    card.querySelector('[data-sub]').textContent = options.sub;
    card.querySelector('[data-body]').textContent = options.body;
    card.querySelector('[data-next]').innerHTML = options.isLast ? '完成本章 <span aria-hidden="true">✓</span>' : '下一段 <span aria-hidden="true">→</span>';
    action = options.onNext;
    card.scrollTop = 0;
    if (!card.open) card.showModal();
  }
  function close() { if (card.open) card.close(); action = null; }
  global.H5_StoryCard = {init,open,close};
})(window);