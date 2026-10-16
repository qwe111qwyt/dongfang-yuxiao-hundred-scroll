/* 终章显式分段控制，每次进入复位；事件仅绑定一次。 */
(function (global) {
  'use strict';
  let current = 0;
  let host;
  const stages = global.H5_DATA.FINALE.stages;
  function build(container) {
    host = container;
    host.innerHTML = stages.map((stage,i) =>
      '<section class="finale-stage" aria-label="终章第 ' + (i + 1) + ' 段"><div class="finale-stage-index">0' + (i + 1) + '</div><div class="finale-stage-eyebrow">' + stage.eyebrow + '</div><h2 class="finale-stage-big">' + stage.big + '</h2><p class="finale-stage-sub">' + stage.sub + '</p><div class="finale-stage-visual" aria-hidden="true">' + ['国','人','你'][i] + '</div></section>'
    ).join('');
    const dots = document.getElementById('finaleDots');
    stages.forEach((_,i) => {
      const button = document.createElement('button');
      button.setAttribute('aria-label','阅读终章第 ' + (i + 1) + ' 段');
      button.addEventListener('click', () => show(i));
      dots.appendChild(button);
    });
    document.getElementById('finaleNext').addEventListener('click', next);
    document.getElementById('finalePrev').addEventListener('click', prev);
    show(0);
    return stages.length;
  }
  function show(index) {
    current = Math.max(0,Math.min(stages.length - 1,index));
    host.querySelectorAll('.finale-stage').forEach((stage,i) => {
      stage.classList.toggle('is-active',i === current);
      stage.inert = i !== current;
    });
    document.querySelectorAll('#finaleDots button').forEach((dot,i) => {
      dot.classList.toggle('is-active',i === current);
      dot.setAttribute('aria-pressed',String(i === current));
    });
    document.getElementById('finalePrev').disabled = current === 0;
    document.getElementById('finaleNext').disabled = current === stages.length - 1;
    document.getElementById('finaleNext').innerHTML = current === stages.length - 1 ? '长卷未完' : '继续 <span aria-hidden="true">→</span>';
  }
  function next() { show(current + 1); }
  function prev() { show(current - 1); }
  function play() { show(0); }
  global.H5_Finale = {build,play,next,prev};
})(window);