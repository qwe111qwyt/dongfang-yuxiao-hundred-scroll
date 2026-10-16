/* 页面切换只管理封面与终章，长卷保留浏览器原生滚动。 */
(function (global) {
  'use strict';
  function create(stage, screens, callbacks) {
    let current = 0;
    let start = null;
    let touchStart = null;
    const api = {
      goTo(index) {
        const next = Math.max(1, Math.min(screens.length - 1, index));
        if (next === current) return false;
        const previous = current;
        if (callbacks.onLeave) callbacks.onLeave(previous);
        screens.forEach((screen, i) => {
          screen.classList.toggle('is-active', i === next);
          screen.inert = i !== next;
          screen.setAttribute('aria-hidden', String(i !== next));
        });
        current = next;
        stage.dataset.page = String(current);
        if (callbacks.onEnter) callbacks.onEnter(next, previous);
        return true;
      },
      next() { return api.goTo(current + 1); },
      prev() { return api.goTo(current - 1); },
      getCurrent() { return current; },
      getTotal() { return screens.length; },
      isAnimating() { return false; }
    };
    stage.dataset.page = '0';
    screens.forEach((screen, i) => { screen.inert = i !== 0; screen.setAttribute('aria-hidden', String(i !== 0)); });
    stage.addEventListener('pointerdown', (event) => {
      if (current !== 1 || event.target.closest('button') || screens[1].scrollHeight > screens[1].clientHeight + 2) return;
      start = { x:event.clientX, y:event.clientY };
    });
    stage.addEventListener('pointerup', (event) => {
      if (start && current === 1 && event.clientY - start.y < -55 && Math.abs(event.clientX - start.x) < 90) api.goTo(2);
      start = null;
    });
    stage.addEventListener('pointercancel', () => { start = null; });
    stage.addEventListener('touchstart', (event) => {
      if (current !== 1 || event.target.closest('button') || screens[1].scrollHeight > screens[1].clientHeight + 2) return;
      touchStart = { x:event.touches[0].clientX, y:event.touches[0].clientY };
    }, {passive:true});
    stage.addEventListener('touchend', (event) => {
      const point = event.changedTouches[0];
      if (touchStart && current === 1 && point.clientY - touchStart.y < -55 && Math.abs(point.clientX - touchStart.x) < 90) api.goTo(2);
      touchStart = null;
    }, {passive:true});
    stage.addEventListener('touchcancel', () => { touchStart = null; }, {passive:true});
    stage.addEventListener('wheel', (event) => {
      if (current === 1 && event.deltaY > 12 && !event.target.closest('dialog') && screens[1].scrollHeight <= screens[1].clientHeight + 2) api.goTo(2);
    }, {passive:true});
    window.addEventListener('keydown', (event) => {
      if (current === 0 || document.querySelector('dialog[open]') || event.target.closest('button,input,textarea,select')) return;
      const scroll = document.getElementById('tlScroll');
      if (current === 1 && ['ArrowDown','PageDown','Enter',' '].includes(event.key)) {
        event.preventDefault(); api.goTo(2);
      } else if (current === 2 && ['Home','End','ArrowDown','ArrowUp','PageDown','PageUp',' '].includes(event.key)) {
        event.preventDefault();
        const reduced = global.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let top = scroll.scrollTop;
        if (event.key === 'Home') top = 0;
        else if (event.key === 'End') top = scroll.scrollHeight;
        else top += (['ArrowUp','PageUp'].includes(event.key) ? -1 : 1) * (event.key.startsWith('Arrow') ? 90 : scroll.clientHeight * .8);
        scroll.scrollTo({top,behavior:reduced ? 'instant' : 'smooth'});
      } else if (current === 3 && global.H5_Finale) {
        if (['ArrowRight','ArrowDown','PageDown',' '].includes(event.key)) { event.preventDefault(); global.H5_Finale.next(); }
        if (['ArrowLeft','ArrowUp','PageUp'].includes(event.key)) { event.preventDefault(); global.H5_Finale.prev(); }
      }
    });
    return api;
  }
  global.H5_Swiper = {create};
})(window);