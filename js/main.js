/* 本地可运行的完整作品入口，不依赖 CDN。 */
(function (global) {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    // 设置封面图（base64内嵌）
    const coverImg = document.getElementById('coverImg');
    if (coverImg && window.H5_IMAGES && window.H5_IMAGES['06-founding-ceremony']) {
      coverImg.src = window.H5_IMAGES['06-founding-ceremony'];
    }
    const stage = document.getElementById('stage');
    const screens = Array.from(stage.querySelectorAll('.screen'));
    global.H5_StoryCard.init();
    global.H5_Timeline.buildAllNodes();
    global.H5_Finale.build(document.getElementById('finaleStages'));
    const swiper = global.H5_Swiper.create(stage,screens,{
      onLeave:() => global.H5_StoryCard.close(),
      onEnter:(index) => {
        if (index === 2) global.H5_Timeline.scrollToTimeline();
        if (index === 3) global.H5_Finale.play();
        const focusTarget = index === 2 ? document.getElementById('tlScroll') : screens[index];
        focusTarget.setAttribute('tabindex',index === 2 ? '0' : '-1');
        focusTarget.focus({preventScroll:true});
      }
    });
    global.H5_SwiperInstance = swiper;
    global.H5 = {swiper,screens};
    const change = (index) => { swiper.goTo(index); global.H5_Audio.playFlip(); };
    document.getElementById('startBtn').addEventListener('click', () => change(2));
    document.getElementById('tlBack').addEventListener('click', () => change(1));
    document.getElementById('goFinale').addEventListener('click', () => change(3));
    document.getElementById('finaleBack').addEventListener('click', () => change(2));
    document.getElementById('finaleReplay').addEventListener('click', () => {
      global.H5_Timeline.reset();
      change(1);
    });
    document.getElementById('firstChapter').addEventListener('click', () => global.H5_Timeline.goToNode(0));
    document.getElementById('chapterToggle').addEventListener('click', () => document.getElementById('chapterDialog').showModal());
    document.querySelectorAll('dialog:not(#storyCard)').forEach(dialog => {
      dialog.querySelector('[data-close-dialog]').addEventListener('click', () => dialog.close());
      dialog.addEventListener('click', (event) => {
        const rect = dialog.getBoundingClientRect();
        if (event.target === dialog && (event.clientY < rect.top || event.clientY > rect.bottom || event.clientX < rect.left || event.clientX > rect.right)) dialog.close();
      });
    });
    global.H5_Audio.init();
    if (!global.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const host = document.getElementById('particles');
      for (let i=0;i<12;i++) {
        const particle = document.createElement('i');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 12 + 's';
        particle.style.animationDuration = 10 + Math.random() * 8 + 's';
        host.appendChild(particle);
      }
    }
    // 以真实图片加载进度更新开卷页（base64内嵌，秒加载）
    const urls = (window.H5_IMAGES && [window.H5_IMAGES['06-founding-ceremony'], window.H5_IMAGES['01-awakening'], window.H5_IMAGES['02-founding']]) || [];
    let settled = 0;
    let finished = false;
    const began = performance.now();
    const finish = () => {
      if (finished) return;
      finished = true;
      document.getElementById('loadingFill').style.width = '100%';
      document.getElementById('loadingPercent').textContent = '100%';
      setTimeout(() => swiper.goTo(1),Math.max(0,650 - (performance.now() - began)));
    };
    if (urls.length === 0) { finish(); }
    urls.forEach(url => {
      const image = new Image();
      const done = () => {
        settled++;
        document.getElementById('loadingFill').style.width = (settled / urls.length * 100) + '%';
        document.getElementById('loadingPercent').textContent = Math.round(settled / urls.length * 100) + '%';
        if (settled === urls.length) finish();
      };
      image.onload = done;
      image.onerror = done;
      image.src = url;
    });
    setTimeout(finish,4500);
  });
})(window);