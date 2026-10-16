/* ============================================================
   东方正在刷新 — 数据中心
   ============================================================ */
(function (global) {
  'use strict';

  const BASE = 'assets/img-webp/';
  const FALLBACK = 'assets/img/';

  const NODES = [
    {
      key: 'awakening',
      imgBase: '01-awakening',
      year: '1919',
      yearEn: 'May Fourth Movement',
      title: '觉醒',
      subtitle: '1919 · 五四运动',
      text: '巴黎和会的外交失败，点燃了「外争主权、内除国贼」的怒吼。青年学生走上街头，工人阶级开始登上历史舞台。',
      en: 'AWAKEN',
      bgHue: '#8a1a25',
      bridge: '两年后，一叶红船，驶向新的起点。',
      story: [
        { side: 'left',  title: '看 · 青年的觉醒',  body: '1919 年，巴黎和会上中国外交的失败引发强烈抗议。5 月 4 日，北京青年学生走上街头，掀起爱国运动。', beat: { x: 20, y: 32, r: 12 } },
        { side: 'right', title: '听 · 街头的怒吼',  body: '三千学生齐聚天安门，「外争主权，内除国贼」的口号响彻云霄。', beat: { x: 70, y: 48, r: 14 } },
        { side: 'left',  title: '想 · 新文化之光',  body: '陈独秀创办《青年杂志》，后更名为《新青年》。陈独秀、李大钊等推动新思想传播，民主与科学成为新文化运动的鲜明旗帜。', beat: { x: 50, y: 70, r: 12 } }
      ]
    },
    {
      key: 'founding',
      imgBase: '02-founding',
      year: '1921',
      yearEn: 'Founding of CPC',
      title: '开天辟地',
      subtitle: '1921 · 中国共产党成立',
      text: '上海石库门里的一盏灯火，从南湖红船驶向历史深处。十三名代表，平均年龄二十八岁。',
      en: 'FOUND',
      bgHue: '#5a1218',
      bridge: '六年后，南昌城头的枪声划破夜空，',
      story: [
        { side: 'left',  title: '望 · 石库门灯火',  body: '上海法租界望志路 106 号，一盏油灯照亮 13 位代表的脸庞。', beat: { x: 24, y: 35, r: 13 } },
        { side: 'right', title: '渡 · 南湖红船',    body: '中共一大在上海召开，后转移到浙江嘉兴南湖的一艘游船上继续举行，完成会议议程。', beat: { x: 72, y: 55, r: 14 } },
        { side: 'left',  title: '立 · 红色纲领',    body: '来自各地的代表通过中国共产党第一个纲领和第一个决议。一个新的政党诞生，中国革命从此有了新的领导力量。', beat: { x: 45, y: 78, r: 11 } }
      ]
    },
    {
      key: 'spark',
      imgBase: '03-spark',
      year: '1927',
      yearEn: 'Agrarian Revolution',
      title: '星火燎原',
      subtitle: '1927 · 土地革命',
      text: '从南昌起义的枪声到井冈山的红旗，走上「农村包围城市」的道路。',
      en: 'SPARK',
      bgHue: '#7a1c0c',
      bridge: '然而第五次反「围剿」失利，红军被迫踏上漫漫长路，',
      story: [
        { side: 'left',  title: '看 · 南昌城头',    body: '周恩来、贺龙、叶挺、朱德、刘伯承等领导发动南昌起义，打响武装反抗第一枪。', beat: { x: 22, y: 40, r: 12 } },
        { side: 'right', title: '登 · 井冈之巅',    body: '毛泽东率秋收起义部队到达井冈山，创建第一个农村革命根据地。',         beat: { x: 60, y: 55, r: 14 } },
        { side: 'left',  title: '传 · 支部建在连上', body: '三湾改编把党支部建在连上，奠定了党对军队的绝对领导。',              beat: { x: 82, y: 30, r: 12 } }
      ]
    },
    {
      key: 'longMarch',
      imgBase: '04-long-march',
      year: '1934',
      yearEn: 'The Long March',
      title: '远征',
      subtitle: '1934 · 红军长征',
      text: '两万五千里，跨越万水千山。1934 年至 1936 年，红军在艰苦卓绝的长征中突破重围，完成具有伟大转折意义的战略转移。',
      en: 'MARCH',
      bgHue: '#3a4a6a',
      bridge: '1937 年，卢沟桥的炮声，震动山河。',
      story: [
        { side: 'left',  title: '渡 · 于都河',     body: '1934 年 10 月，中央红军 8.6 万人从于都集结出发，渡过于都河。', beat: { x: 24, y: 30, r: 13 } },
        { side: 'right', title: '定 · 遵义会议',   body: '1935 年 1 月，遵义会议事实上确立了毛泽东在党和红军中的领导地位。', beat: { x: 55, y: 50, r: 14 } },
        { side: 'left',  title: '夺 · 泸定铁索',   body: '22 位红军勇士攀着悬空的铁索，冒着弹雨夺下泸定桥。',         beat: { x: 80, y: 65, r: 12 } }
      ]
    },
    {
      key: 'resist',
      imgBase: '05-resist',
      year: '1937',
      yearEn: 'War of Resistance',
      title: '共御外侮',
      subtitle: '1937 · 全民族抗战',
      text: '1937 年，七七事变揭开全民族抗战的序幕。从 1931 年到 1945 年，十四年浴血奋战，中华儿女赢得了抗日战争的伟大胜利。',
      en: 'RESIST',
      bgHue: '#5a2222',
      bridge: '1949 年，一句庄严宣告，响彻天安门。',
      story: [
        { side: 'left',  title: '醒 · 卢沟晓月',   body: '1937 年 7 月 7 日夜，日军借口士兵失踪，悍然炮轰宛平城。', beat: { x: 22, y: 42, r: 12 } },
        { side: 'right', title: '战 · 台儿庄',     body: '1938 年，李宗仁指挥中国军队重创日军两个精锐师团。',     beat: { x: 55, y: 35, r: 14 } },
        { side: 'left',  title: '反 · 百团大战',   body: '1940 年，彭德怀指挥八路军 105 个团大规模破袭华北日军。', beat: { x: 80, y: 58, r: 12 } }
      ]
    },
    {
      key: 'foundingCeremony',
      imgBase: '06-founding-ceremony',
      year: '1949',
      yearEn: 'Founding Ceremony',
      title: '山河新生',
      subtitle: '1949 · 中华人民共和国成立',
      text: '「中华人民共和国中央人民政府今天成立了！」二十八响礼炮，五星红旗升起。',
      en: 'NEWBORN',
      bgHue: '#9a1b1b',
      bridge: '十五年后，罗布泊上空，腾起一朵壮丽的云。',
      story: [
        { side: 'left',  title: '听 · 礼炮二十八响', body: '1949 年 10 月 1 日下午 3 时，54 门礼炮齐鸣 28 响。',   beat: { x: 50, y: 28, r: 14 } },
        { side: 'right', title: '望 · 城楼之巅',     body: '毛泽东在天安门城楼向全世界庄严宣告新中国成立。',          beat: { x: 25, y: 50, r: 12 } },
        { side: 'left',  title: '看 · 第一面国旗',   body: '由曾联松设计，红色象征革命，大五角星代表中国共产党。',     beat: { x: 78, y: 60, r: 12 } }
      ]
    },
    {
      key: 'shield',
      imgBase: '07-shield',
      year: '1964',
      yearEn: 'Two Bombs, One Satellite',
      title: '为国铸盾',
      subtitle: '1964 · 第一颗原子弹爆炸成功',
      text: '1964 年第一颗原子弹爆炸成功，1967 年第一颗氢弹爆炸成功，1970 年第一颗人造地球卫星发射成功。「两弹一星」见证自力更生的力量。',
      en: 'SHIELD',
      bgHue: '#2a3a4a',
      bridge: '1978 年，改革的春潮，涌向辽阔大地。',
      story: [
        { side: 'left',  title: '看 · 罗布泊云柱',  body: '1964 年 10 月 16 日，我国第一颗原子弹在罗布泊爆炸成功。', beat: { x: 30, y: 38, r: 13 } },
        { side: 'right', title: '记 · 钱学森归国',  body: '「中国航天之父」冲破美国阻挠毅然归国，主持两弹事业。',   beat: { x: 60, y: 50, r: 14 } },
        { side: 'left',  title: '念 · 邓稼先',      body: '「两弹元勋」隐姓埋名 28 年，将一生献给中国核武器事业。',   beat: { x: 82, y: 35, r: 12 } }
      ]
    },
    {
      key: 'reform',
      imgBase: '08-reform',
      year: '1978',
      yearEn: 'Reform & Opening',
      title: '春潮涌动',
      subtitle: '1978 · 改革开放',
      text: '十一届三中全会开启了改革开放的伟大征程。用几十年走完了发达国家几百年的工业化历程。',
      en: 'REFORM',
      bgHue: '#1a6a4a',
      bridge: '20 年后，长江、嫩江、松花江同时告急，',
      story: [
        { side: 'left',  title: '看 · 红手印',       body: '1978 年冬，安徽小岗村 18 户农民按下红手印，「包产到户」。', beat: { x: 22, y: 48, r: 12 } },
        { side: 'right', title: '听 · 深圳速度',     body: '1980 年深圳设立经济特区，从边陲小镇崛起为现代化都市。',     beat: { x: 55, y: 36, r: 14 } },
        { side: 'left',  title: '读 · 三中全会公报', body: '1978 年 12 月，作出把党和国家中心转移到经济建设的决策。', beat: { x: 80, y: 58, r: 12 } }
      ]
    },
    {
      key: 'flood',
      imgBase: '09-flood',
      year: '1998',
      yearEn: 'Flood Fighting',
      title: '众志成城',
      subtitle: '1998 · 抗洪救灾',
      text: '长江、嫩江、松花江发生特大洪水。人民解放军、武警官兵与广大群众并肩奋战，用生命守护家园，筑起众志成城的防线。',
      en: 'UNITED',
      bgHue: '#1a3a5a',
      bridge: '进入新时代，9899 万人告别贫困，',
      story: [
        { side: 'left',  title: '看 · 九江大堤',   body: '1998 年 8 月，九江城防大堤决口，官兵奋战五天五夜封堵。', beat: { x: 25, y: 45, r: 12 } },
        { side: 'right', title: '记 · 李向群',     body: '抗洪英雄李向群四次晕倒在大堤上，献出 20 岁的年轻生命。', beat: { x: 55, y: 60, r: 14 } },
        { side: 'left',  title: '望 · 三江大决战', body: '长江、嫩江、松花江告急，军民团结奋战，谱写万众一心、众志成城的抗洪壮歌。', beat: { x: 80, y: 35, r: 12 } }
      ]
    },
    {
      key: 'revival',
      imgBase: '10-revival',
      year: '新时代',
      yearEn: 'Poverty Alleviation',
      title: '民族复兴',
      subtitle: '新时代 · 脱贫攻坚',
      text: '九千八百九十九万农村贫困人口全部脱贫。书写了人类减贫史上的中国奇迹。',
      en: 'REVIVAL',
      bgHue: '#c8102e',
      bridge: '百年长河奔涌向前，下一帧，',
      story: [
        { side: 'left',  title: '看 · 十八洞蝶变',  body: '湖南湘西十八洞村是「精准扶贫」首倡地，从深度贫困到小康示范。', beat: { x: 25, y: 50, r: 12 } },
        { side: 'right', title: '走 · 悬崖村天梯',  body: '四川凉山「悬崖村」从藤梯到钢梯，出行条件不断改善。2020 年，部分村民通过易地扶贫搬迁住进县城新居。', beat: { x: 55, y: 35, r: 14 } },
        { side: 'left',  title: '贺 · 全面小康',    body: '9899 万贫困人口脱贫、832 个贫困县摘帽，千年小康梦圆。',     beat: { x: 80, y: 60, r: 12 } }
      ]
    }
  ];

  const FINALE = {
    title: '百年 · 写给你',
    stages: [
      {
        eyebrow: '一  百  年  路',
        big: '站起来 · 富起来\n强起来',
        sub: '从一叶红船，到巍巍巨轮\n从山河破碎，到国泰民安\n一代代人的奋斗，写就时代的巨变',
        visual: 'tiananmen'
      },
      {
        eyebrow: '二  铸  民  族  魂',
        big: '人民是英雄',
        sub: '这是 13 颗心聚成的火种\n也是 14 亿双手托起的江山\n每一个你，都是这个时代的封面',
        visual: 'people'
      },
      {
        eyebrow: '三  下  一  帧',
        big: '下一帧，交给你',
        sub: '百年长卷，每一帧都在刷新\n前人写下觉醒，奋斗写下富强\n下一笔，由你落墨',
        visual: 'next'
      }
    ]
  };

  const META = {
    title: '东方正在刷新',
    subtitle: '从觉醒到复兴 · 百年长卷交互设计',
    totalPages: 4,
    nodesStart: 2,
    nodesEnd: 2
  };

  global.H5_DATA = { NODES, META, BASE, FALLBACK, FINALE };
})(window);