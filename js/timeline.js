/* 十幅完整插画、章节目录、读图故事与滚动进度。 */
(function (global) {
  'use strict';
  const {NODES} = global.H5_DATA;
  let scroll;
  let resetRequested = false;
  const read = new Set();
  const visited = new Set();
  const reduced = () => global.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function buildAllNodes() {
    scroll = document.getElementById('tlScroll');
    const host = document.getElementById('timelineNodes');
    const chapters = document.getElementById('chapterList');
    try { JSON.parse(localStorage.getItem('centennial-read') || '[]').forEach(id => read.add(id)); } catch (_) {}
    host.replaceChildren();
    chapters.replaceChildren();
    NODES.forEach((node,i) => {
      const number = String(i + 1).padStart(2,'0');
      const article = document.createElement('article');
      article.className = 'tl-node';
      article.id = 'chapter-' + node.key;
      article.dataset.index = String(i);
      article.setAttribute('aria-labelledby', 'title-' + node.key);
      article.innerHTML = [
        '<div class="tl-node-yearstrip"><div class="tl-node-yearstrip-year ' + (i === 9 ? 'is-era' : '') + '">' + node.year + '</div><div class="tl-node-yearstrip-en">' + node.yearEn + '</div><div class="tl-node-serial">' + number + ' / 10</div></div>',
        '<div class="tl-node-image-wrap"><img class="tl-node-image" src="' + (global.H5_IMAGES[node.imgBase] || '') + '" alt="' + node.subtitle + '主题插画" width="941" height="1672" loading="' + (i < 2 ? 'eager' : 'lazy') + '" decoding="async"><div class="tl-beat-spots"></div></div>',
        '<div class="tl-image-tools"><span>图 ' + number + ' · ' + node.subtitle + '</span><button class="tl-view-image">查看全画 ↗</button></div>',
        '<div class="tl-node-body"><div class="tl-node-title-row"><h2 class="tl-node-title" id="title-' + node.key + '">' + node.title + '</h2><span class="tl-node-subtitle">' + node.subtitle + '</span></div><p class="tl-node-text">' + node.text + '</p></div>',
        '<div class="tl-node-progress"><span class="tl-node-progress-label">读图故事</span><div class="tl-node-progress-dots"></div><span class="tl-node-read-count"></span></div>'
      ].join('');
      const image = article.querySelector('.tl-node-image');
      image.addEventListener('error', () => {
        console.warn('Image load failed:', node.imgBase);
      }, {once:true});
      node.story.forEach((beat,j) => {
        const spot = document.createElement('button');
        spot.className = 'tl-beat-spot';
        spot.style.left = beat.beat.x + '%';
        spot.style.top = beat.beat.y + '%';
        spot.textContent = j + 1;
        spot.dataset.beatIdx = String(j);
        spot.setAttribute('aria-label','阅读故事 ' + (j + 1) + '：' + beat.title);
        const dot = document.createElement('button');
        dot.className = 'tl-dot';
        dot.textContent = String(j + 1).padStart(2,'0');
        dot.dataset.dot = String(j);
        dot.setAttribute('aria-label',beat.title);
        spot.addEventListener('click', () => activateBeat(i,j));
        dot.addEventListener('click', () => activateBeat(i,j));
        article.querySelector('.tl-beat-spots').appendChild(spot);
        article.querySelector('.tl-node-progress-dots').appendChild(dot);
      });
      article.querySelector('.tl-view-image').addEventListener('click', () => {
        const dialog = document.getElementById('imageDialog');
        const image = document.getElementById('fullImage');
        image.src = global.H5_IMAGES[node.imgBase] || '';
        image.alt = node.subtitle + '完整主题插画';
        document.getElementById('imageTitle').textContent = node.year + ' · ' + node.title;
        dialog.showModal();
      });
      host.appendChild(article);
      if (i < NODES.length - 1) {
        const bridge = document.createElement('div');
        bridge.className = 'tl-bridge';
        bridge.innerHTML = '<div class="tl-bridge-line"></div><p class="tl-bridge-text">' + node.bridge + '</p><div class="tl-bridge-line"></div>';
        host.appendChild(bridge);
      }
      const chapter = document.createElement('button');
      chapter.className = 'chapter-item';
      chapter.dataset.index = String(i);
      chapter.innerHTML = '<span class="chapter-year">' + node.year + '</span><span class="chapter-name">' + node.title + '</span><span class="chapter-number">' + number + ' ↗</span>';
      chapter.addEventListener('click', () => { document.getElementById('chapterDialog').close(); goToNode(i); });
      chapters.appendChild(chapter);
      updateReadState(i);
    });
    let frame = 0;
    scroll.addEventListener('scroll', () => {
      if (frame) return;
      frame = requestAnimationFrame(() => { updateProgress(); frame = 0; });
    }, {passive:true});
    updateProgress();
  }
  function activateBeat(nodeIndex,beatIndex) {
    const node = NODES[nodeIndex];
    const beat = node.story[beatIndex];
    read.add(node.key + ':' + beatIndex);
    try { localStorage.setItem('centennial-read',JSON.stringify(Array.from(read))); } catch (_) {}
    updateReadState(nodeIndex,beatIndex);
    global.H5_StoryCard.open({
      step:'图 ' + String(nodeIndex + 1).padStart(2,'0') + ' / 10 · 故事 ' + (beatIndex + 1) + ' / ' + node.story.length,
      title:beat.title, sub:node.year + ' · ' + node.yearEn, body:beat.body,
      isLast:beatIndex === node.story.length - 1,
      onNext:() => {
        if (beatIndex < node.story.length - 1) activateBeat(nodeIndex,beatIndex + 1);
        else global.H5_StoryCard.close();
      }
    });
    if (global.H5_Audio) global.H5_Audio.playLight();
  }
  function updateReadState(index,active) {
    const node = NODES[index];
    const article = document.getElementById('chapter-' + node.key);
    let count = 0;
    node.story.forEach((_,j) => {
      const done = read.has(node.key + ':' + j);
      if (done) count++;
      [article.querySelector('[data-beat-idx="' + j + '"]'),article.querySelector('[data-dot="' + j + '"]')].forEach(button => {
        button.classList.toggle('is-done',done);
        button.classList.toggle('is-active',active === j);
      });
    });
    article.querySelector('.tl-node-read-count').textContent = count + ' / ' + node.story.length + ' 已读';
  }
  function goToNode(index) {
    const article = document.getElementById('chapter-' + NODES[index].key);
    const top = scroll.scrollTop + article.getBoundingClientRect().top - scroll.getBoundingClientRect().top - 18;
    scroll.scrollTo({top,behavior:reduced() ? 'instant' : 'smooth'});
  }
  function updateProgress() {
    if (!scroll || !scroll.clientHeight) return;
    const ratio = Math.max(0,Math.min(1,scroll.scrollTop / Math.max(1,scroll.scrollHeight - scroll.clientHeight)));
    document.getElementById('tlProgressFill').style.width = (ratio * 100) + '%';
    document.querySelector('.tl-progress-bar').setAttribute('aria-valuenow',String(Math.round(ratio * 100)));
    const top = scroll.getBoundingClientRect().top;
    let current = -1;
    scroll.querySelectorAll('.tl-node').forEach((article,i) => {
      const rect = article.getBoundingClientRect();
      if (rect.top < top + scroll.clientHeight * .4) current = i;
      if (rect.top < top + scroll.clientHeight && rect.bottom > top) visited.add(i);
    });
    document.getElementById('tlProgressNow').textContent = current + 1;
    document.getElementById('tlCurrentYear').textContent = current < 0 ? '序章' : NODES[current].year;
    document.querySelectorAll('.chapter-item').forEach((button,i) => {
      button.classList.toggle('is-active',i === current);
      if (i === current) button.setAttribute('aria-current','true');
      else button.removeAttribute('aria-current');
    });
    document.getElementById('readingSummary').textContent = '已翻阅 ' + visited.size + ' / 10 幅插画 · 已读 ' + read.size + ' / 30 段画中故事';
  }
  function scrollToTimeline() {
    if (resetRequested) {
      scroll.scrollTo({top:0,behavior:'instant'});
      resetRequested = false;
    }
    updateProgress();
  }
  function reset() {
    resetRequested = true;
    if (scroll.clientHeight) scrollToTimeline();
  }
  global.H5_Timeline = {buildAllNodes,goToNode,scrollToTimeline,updateProgress,reset};
})(window);