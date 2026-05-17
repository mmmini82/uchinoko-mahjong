'use strict';

const $ = (id) => document.getElementById(id);
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const TILE_GLYPHS = [
  '🀇','🀈','🀉','🀊','🀋','🀌','🀍','🀎','🀏',
  '🀙','🀚','🀛','🀜','🀝','🀞','🀟','🀠','🀡',
  '🀐','🀑','🀒','🀓','🀔','🀕','🀖','🀗','🀘',
  '🀀','🀁','🀂','🀃','🀆','🀅','中'
];
const TILE_TEXT = [
  '一萬','二萬','三萬','四萬','五萬','六萬','七萬','八萬','九萬',
  '一筒','二筒','三筒','四筒','五筒','六筒','七筒','八筒','九筒',
  '一索','二索','三索','四索','五索','六索','七索','八索','九索',
  '東','南','西','北','白','發','中'
];
const TILE_IMAGES = [
  'man_1.gif','man_2.gif','man_3.gif','man_4.gif','man_5.gif','man_6.gif','man_7.gif','man_8.gif','man_9.gif',
  'pin_1.gif','pin_2.gif','pin_3.gif','pin_4.gif','pin_5.gif','pin_6.gif','pin_7.gif','pin_8.gif','pin_9.gif',
  'sou_1.gif','sou_2.gif','sou_3.gif','sou_4.gif','sou_5.gif','sou_6.gif','sou_7.gif','sou_8.gif','sou_9.gif',
  'wind_ton.gif','wind_nan.gif','wind_sha.gif','wind_pei.gif','dragon_haku.gif','dragon_hatsu.gif','dragon_chun.gif'
].map(name => `assets/tiles/${name}`);
const WINDS = ['東','南','西','北'];
const SUIT = (t) => Math.floor(t / 9);
const NUM = (t) => (t % 9) + 1;
const isHonor = (t) => t >= 27;
const isTerminal = (t) => !isHonor(t) && (NUM(t) === 1 || NUM(t) === 9);
const isSimple = (t) => !isHonor(t) && NUM(t) >= 2 && NUM(t) <= 8;

const CHARACTERS = [
  {
    "id": "minaho",
    "portrait": "assets/characters/minaho.png",
    "name": "南帆",
    "title": "雪華の結び手",
    "icon": "❄️",
    "power": 3,
    "stats": {
      "attack": 68,
      "defense": 74,
      "efficiency": 78,
      "luck": 62
    },
    "color": "linear-gradient(135deg,#d9f7ff,#b58cff 58%,#2b163e)",
    "quote": "めんどいけど、勝てたら気持ちいいからやる。"
  },
  {
    "id": "akane",
    "portrait": "assets/characters/akane.png",
    "name": "朱音",
    "title": "焔龍の強者",
    "icon": "🔥",
    "power": 5,
    "stats": {
      "attack": 92,
      "defense": 82,
      "efficiency": 88,
      "luck": 76
    },
    "color": "linear-gradient(135deg,#ff3b42,#ff9b46 52%,#30111b)",
    "quote": "姫、見てろ。勝つ時はちゃんと勝つ。"
  },
  {
    "id": "hin",
    "portrait": "assets/characters/leung_hin.png",
    "name": "梁泫",
    "title": "招財の老師",
    "icon": "🧧",
    "power": 5,
    "stats": {
      "attack": 84,
      "defense": 88,
      "efficiency": 91,
      "luck": 94
    },
    "color": "linear-gradient(135deg,#31efbb,#0c8b71 55%,#22173f)",
    "quote": "南帆小姐，睇住啦。老師今日唔讓㗎。"
  },
  {
    "id": "yuk",
    "portrait": "assets/characters/yuk.png",
    "name": "煜",
    "title": "金気の若龍",
    "icon": "💰",
    "power": 5,
    "stats": {
      "attack": 86,
      "defense": 78,
      "efficiency": 92,
      "luck": 96
    },
    "color": "linear-gradient(135deg,#ffe08a,#2f7d56 54%,#11130f)",
    "quote": "金は溜めずに巡らせる。牌も同じだよ。"
  },
  {
    "id": "yao",
    "portrait": "assets/characters/yao.png",
    "name": "瑤",
    "title": "街縁の龍娘",
    "icon": "💎",
    "power": 5,
    "stats": {
      "attack": 78,
      "defense": 86,
      "efficiency": 89,
      "luck": 92
    },
    "color": "linear-gradient(135deg,#ffd9ef,#7ae6d0 52%,#2b1847)",
    "quote": "南帆ちゃん、急がなくていいよ。いい縁はちゃんと来るから。"
  },
  {
    "id": "haruka",
    "portrait": "assets/characters/haruka.png",
    "name": "悠",
    "title": "静かな支配者",
    "icon": "🩸",
    "power": 4,
    "stats": {
      "attack": 74,
      "defense": 94,
      "efficiency": 86,
      "luck": 62
    },
    "color": "linear-gradient(135deg,#2b3048,#5e6dff 55%,#111018)",
    "quote": "焦らない。君の前では、無駄に崩れたくないから。"
  },
  {
    "id": "masumi",
    "portrait": "assets/characters/masumi.png",
    "name": "真澄",
    "title": "卓上の演出家",
    "icon": "🪽",
    "power": 4,
    "stats": {
      "attack": 82,
      "defense": 70,
      "efficiency": 84,
      "luck": 66
    },
    "color": "linear-gradient(135deg,#c7c9d7,#7d57ff 54%,#180d24)",
    "quote": "幕は開いたよ。最後まで俺を見ていて。"
  },
  {
    "id": "aoi",
    "portrait": "assets/characters/aoi.png",
    "name": "碧衣",
    "title": "直感の水龍",
    "icon": "🐉",
    "power": 3,
    "stats": {
      "attack": 86,
      "defense": 56,
      "efficiency": 70,
      "luck": 68
    },
    "color": "linear-gradient(135deg,#22c8ff,#295dff 55%,#0a122b)",
    "quote": "オレが行く。細けぇ理屈より勢いだろ。"
  },
  {
    "id": "renya",
    "portrait": "assets/characters/renya.png",
    "name": "煉夜",
    "title": "風の読牌者",
    "icon": "🪶",
    "power": 4,
    "stats": {
      "attack": 70,
      "defense": 86,
      "efficiency": 88,
      "luck": 72
    },
    "color": "linear-gradient(135deg,#1d1d26,#5e5a78 55%,#040405)",
    "quote": "焦らんでええよ。風向きは、ちゃんと見えてる。"
  },
  {
    "id": "itsuki",
    "portrait": "assets/characters/itsuki.png",
    "name": "斎",
    "title": "空の法則",
    "icon": "🦊",
    "power": 5,
    "stats": {
      "attack": 78,
      "defense": 95,
      "efficiency": 96,
      "luck": 80
    },
    "color": "linear-gradient(135deg,#ffe3b0,#d1b07c 55%,#312116)",
    "quote": "おや、理に適った卓ですね。拝見しましょう。"
  },
  {
    "id": "miko",
    "portrait": "assets/characters/mikoto.png",
    "name": "海琴",
    "title": "優雅な人魚",
    "icon": "🌊",
    "power": 3,
    "stats": {
      "attack": 62,
      "defense": 90,
      "efficiency": 74,
      "luck": 66
    },
    "color": "linear-gradient(135deg,#d8fbff,#5ca7ff 52%,#14243b)",
    "quote": "ふふ、波を荒らさずに勝つのも綺麗でしょう？"
  },
  {
    "id": "shion",
    "portrait": "assets/characters/shion.png",
    "name": "紫苑",
    "title": "時の女王",
    "icon": "⏳",
    "power": 5,
    "stats": {
      "attack": 80,
      "defense": 88,
      "efficiency": 94,
      "luck": 82
    },
    "color": "linear-gradient(135deg,#d98cff,#7b29a8 56%,#1b0d25)",
    "quote": "よろしくてよ。巡りは私が選びますわ。"
  },
  {
    "id": "maximilien",
    "portrait": "assets/characters/maximilien.png",
    "name": "マクシミリアン",
    "title": "白の侯爵",
    "icon": "🦇",
    "power": 5,
    "stats": {
      "attack": 86,
      "defense": 92,
      "efficiency": 94,
      "luck": 70
    },
    "color": "linear-gradient(135deg,#f2f2ff,#b9aec9 54%,#17131f)",
    "quote": "血統も牌も、雑に扱うものではない。"
  },
  {
    "id": "lucien",
    "portrait": "assets/characters/lucien.png",
    "name": "リュシアン",
    "title": "白侯爵の猟犬",
    "icon": "⛓️",
    "power": 4,
    "stats": {
      "attack": 94,
      "defense": 42,
      "efficiency": 64,
      "luck": 88
    },
    "color": "linear-gradient(135deg,#ffe5a6,#ff5757 55%,#2d0f18)",
    "quote": "あははっ、その牌、すっごく甘そうだよね？"
  },
  {
    "id": "kaya",
    "portrait": "assets/characters/kaya.png",
    "name": "伽耶",
    "title": "雷龍の魔女",
    "icon": "⚡",
    "power": 5,
    "stats": {
      "attack": 90,
      "defense": 66,
      "efficiency": 86,
      "luck": 80
    },
    "color": "linear-gradient(135deg,#111018,#f0c84b 50%,#4b1f73)",
    "quote": "南帆ちゃん、その迷い方……綺麗ね。もっと見せて。"
  },
  {
    "id": "takuma",
    "portrait": "assets/characters/takuma.png",
    "name": "拓真",
    "title": "念喰らい",
    "icon": "🚬",
    "power": 3,
    "stats": {
      "attack": 78,
      "defense": 58,
      "efficiency": 72,
      "luck": 74
    },
    "color": "linear-gradient(135deg,#2f2b25,#8b6a45 55%,#120e0b)",
    "quote": "焦らなくていいよ。崩れる瞬間が一番見やすいから。"
  },
  {
    "id": "shinobu",
    "portrait": "assets/characters/shinobu.png",
    "name": "忍",
    "title": "記録喰い",
    "icon": "📖",
    "power": 4,
    "stats": {
      "attack": 76,
      "defense": 86,
      "efficiency": 92,
      "luck": 64
    },
    "color": "linear-gradient(135deg,#18101f,#7437a6 55%,#09060c)",
    "quote": "その一打、綺麗ですねぇ。記録しておきましょう。"
  },
  {
    "id": "kouga",
    "portrait": "assets/characters/kouga.png",
    "name": "煌雅",
    "title": "妖艶鬼",
    "icon": "💠",
    "power": 4,
    "stats": {
      "attack": 84,
      "defense": 70,
      "efficiency": 82,
      "luck": 82
    },
    "color": "linear-gradient(135deg,#0d1022,#3155c8 52%,#4b177a)",
    "quote": "フッ……アンタ、面白い打ち方するね。"
  }
];


// v42: 汎用セリフ定義は完全に不使用化。
// セリフ表示タイミングは維持し、eventQuote() は CHARACTER_EVENT_LINES の各キャラ専用セリフだけをローテーションする。
const EVENT_ROTATION = Object.create(null);

const YAKU_CATEGORIES = [
  { id: 'easy', label: 'まず覚える' },
  { id: 'one', label: '1翻' },
  { id: 'two', label: '2翻' },
  { id: 'big', label: '高い役' },
  { id: 'yakuman', label: '役満' }
];

const YAKU_LIST = [
  { cat: 'easy', name: '立直（リーチ）', han: '1翻', desc: '鳴かずにテンパイしたら宣言できる役。初心者はまずこれを目指せばOK。', tip: '「あと1枚で和了」の形になったら立直ボタンを見る。', badges: ['判定済', '初心者向け'] },
  { cat: 'easy', name: '門前清自摸和（メンゼンツモ）', han: '1翻', desc: '鳴かずに自分で当たり牌を引いて和了する役。', tip: '鳴いたら付かない。門前の時だけ自然につきやすい。', badges: ['判定済', '初心者向け'] },
  { cat: 'easy', name: '断么九（タンヤオ）', han: '1翻', desc: '2〜8の数牌だけで作る役。1・9・字牌を使わない。', tip: '端っこ牌と字牌を切って、中の数字だけに寄せる。', badges: ['判定済', '初心者向け'] },
  { cat: 'easy', name: '役牌', han: '1翻', desc: '白・發・中などを3枚揃える役。', tip: '白發中が2枚あったら大事にしがちでOK。', badges: ['判定済', '初心者向け'] },
  { cat: 'easy', name: '七対子（チートイツ）', han: '2翻', desc: '同じ牌2枚のペアを7組作る役。普通の4メンツ1雀頭とは別ルート。', tip: '対子が4組以上あるなら候補。ペアを崩しすぎない。', badges: ['判定済', '初心者向け'] },

  { cat: 'one', name: '平和（ピンフ）', han: '1翻', desc: '順子中心で、役牌の雀頭や待ちが悪い形を避けたきれいな役。', tip: '123・456みたいな順子が多い時に狙う。', badges: ['覚え用'] },
  { cat: 'one', name: '一盃口（イーペーコー）', han: '1翻', desc: '同じ順子を2組作る役。例：二三四萬＋二三四萬。', tip: '同じ並びが重なったら崩さない。', badges: ['覚え用'] },
  { cat: 'one', name: '海底摸月／河底撈魚', han: '1翻', desc: '山の最後の牌でツモ、または最後の捨て牌でロンする偶然役。', tip: '狙うというより最後に起きたらラッキー。', badges: ['覚え用'] },

  { cat: 'two', name: '混全帯么九（チャンタ）', han: '2翻', desc: '全部のメンツと雀頭に1・9・字牌が絡む役。', tip: '端牌や字牌が多い時の候補。ただし少し難しい。', badges: ['覚え用'] },
  { cat: 'two', name: '三色同順', han: '2翻', desc: '萬子・筒子・索子で同じ数字の順子を作る役。例：123萬・123筒・123索。', tip: '同じ数字の並びが別の色で見えたら意識。', badges: ['覚え用'] },
  { cat: 'two', name: '一気通貫', han: '2翻', desc: '同じ色で123・456・789を揃える役。', tip: '同じ色が縦に伸びている時に狙う。', badges: ['覚え用'] },
  { cat: 'two', name: '対々和（トイトイ）', han: '2翻', desc: '刻子を4つ作る役。ポンを使うと狙いやすい。', tip: '同じ牌がたくさん来る時だけ意識。', badges: ['判定済'] },
  { cat: 'two', name: '三暗刻', han: '2翻', desc: '暗刻を3つ作る役。自力で同じ牌3枚を3組揃える。', tip: '刻子が自然にできた時のご褒美役。', badges: ['覚え用'] },

  { cat: 'big', name: '混一色（ホンイツ）', han: '3翻', desc: '1種類の数牌＋字牌だけで作る役。鳴いてもOK。', tip: '手牌が同じ色に偏ったら狙う。', badges: ['判定済'] },
  { cat: 'big', name: '清一色（チンイツ）', han: '6翻', desc: '1種類の数牌だけで作る高い役。字牌も使わない。鳴いても高い。', tip: '強いけど難しい。1色だらけならロマン。', badges: ['判定済'] },
  { cat: 'big', name: '小三元', han: '2翻＋役牌', desc: '白・發・中のうち2つを刻子、残り1つを雀頭にする役。', tip: '三元牌が集まったら急に高くなる。', badges: ['覚え用'] },
  { cat: 'big', name: 'ドラ', han: '+1翻ずつ', desc: 'ドラ表示牌に対応するボーナス牌。役ではないので、ドラだけでは和了できない。', tip: '持っていると点が伸びる。でも形が悪すぎるなら切ることもある。', badges: ['判定済'] },

  { cat: 'yakuman', name: '国士無双', han: '役満', desc: '1・9・字牌を13種類すべて集め、どれか1つを対子にする役満。', tip: '最初から端牌と字牌だらけの時だけ狙う。', badges: ['判定済'] },
  { cat: 'yakuman', name: '四暗刻', han: '役満', desc: '暗刻を4つ作る役満。', tip: '同じ牌が異常に重なる時の夢。', badges: ['覚え用'] },
  { cat: 'yakuman', name: '大三元', han: '役満', desc: '白・發・中を全部3枚ずつ揃える役満。', tip: '三元牌が2種類揃ったら周りも警戒してくる。', badges: ['覚え用'] },
  { cat: 'yakuman', name: '字一色', han: '役満', desc: '字牌だけで作る役満。', tip: '配牌が字牌だらけじゃないとほぼ無理。', badges: ['覚え用'] }
];

let activeYakuCategory = 'easy';

let selectedPlayer = 'minaho';
let selectedOpponents = ['akane', 'hin', 'yuk'];
let currentOpponentFocus = 'akane';
let deferredInstallPrompt = null;
let selectedMatchLength = 6;
const MATCH_LENGTH_OPTIONS = [3, 6, 12, Infinity];

const state = {
  screen: 'menu',
  players: [],
  wall: [],
  dora: null,
  current: 0,
  dealer: 0,
  turnDrawn: null,
  pendingRon: null,
  pendingCall: null,
  locked: false,
  ended: false,
  riichiPending: false,
  round: 1,
  matchLength: 6,
  currentHand: 1
};

function characterById(id) {
  return CHARACTERS.find(c => c.id === id) || CHARACTERS[0];
}

function renderMatchLengthButtons() {
  const box = $('matchLengthButtons');
  if (!box) return;
  box.innerHTML = '';
  MATCH_LENGTH_OPTIONS.forEach(value => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `match-length-btn ${selectedMatchLength === value ? 'active' : ''}`;
    btn.textContent = value === Infinity ? '無制限' : `${value}局`;
    btn.addEventListener('click', () => {
      selectedMatchLength = value;
      renderMatchLengthButtons();
    });
    box.appendChild(btn);
  });
}

function renderCharacterChoices() {
  const playerIconList = $('playerIconList');
  const opponentIconList = $('opponentIconList');
  if (!playerIconList || !opponentIconList) return;

  selectedOpponents = selectedOpponents.filter(id => id !== selectedPlayer).slice(0, 3);
  if (!currentOpponentFocus || currentOpponentFocus === selectedPlayer) {
    currentOpponentFocus = selectedOpponents[0] || CHARACTERS.find(c => c.id !== selectedPlayer)?.id || 'akane';
  }

  playerIconList.innerHTML = '';
  opponentIconList.innerHTML = '';

  CHARACTERS.forEach(char => {
    playerIconList.appendChild(characterIconButton(char, selectedPlayer === char.id, false, () => {
      selectPlayer(char.id);
    }));
  });

  CHARACTERS.forEach(char => {
    const disabled = char.id === selectedPlayer;
    opponentIconList.appendChild(characterIconButton(char, selectedOpponents.includes(char.id), disabled, () => {
      if (disabled) return;
      currentOpponentFocus = char.id;
      if (!selectedOpponents.includes(char.id) && selectedOpponents.length < 3) {
        selectedOpponents.push(char.id);
      }
      renderCharacterChoices();
    }));
  });

  renderPlayerPreview();
  renderOpponentPreview();
  renderOpponentSlots();
  renderMatchLengthButtons();
}

function selectPlayer(id) {
  selectedPlayer = id;
  selectedOpponents = selectedOpponents.filter(oppId => oppId !== id).slice(0, 3);
  if (currentOpponentFocus === id) currentOpponentFocus = selectedOpponents[0] || CHARACTERS.find(c => c.id !== id)?.id || 'akane';
  renderCharacterChoices();
}

function goOpponentStep() {
  while (selectedOpponents.length < 3) {
    const next = CHARACTERS.find(c => c.id !== selectedPlayer && !selectedOpponents.includes(c.id));
    if (!next) break;
    selectedOpponents.push(next.id);
  }
  currentOpponentFocus = selectedOpponents[0] || CHARACTERS.find(c => c.id !== selectedPlayer)?.id || 'akane';
  $('playerSelectStep')?.classList.add('hidden');
  $('opponentSelectStep')?.classList.remove('hidden');
  renderCharacterChoices();
}

function goPlayerStep() {
  $('opponentSelectStep')?.classList.add('hidden');
  $('playerSelectStep')?.classList.remove('hidden');
  renderCharacterChoices();
}

function characterIconButton(char, selected, disabled, onClick) {
  const button = document.createElement('button');
  button.className = `select-icon-card ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`;
  button.style.setProperty('--char-gradient', char.color);
  button.type = 'button';
  button.innerHTML = `
    <div class="select-thumb">${avatarHtml(char, 'thumb')}</div>
    <strong>${escapeHtml(char.name)}</strong>
    <span>${'★'.repeat(char.power)}${'☆'.repeat(5 - char.power)}</span>
  `;
  button.addEventListener('click', onClick);
  return button;
}

function characterStandeeHtml(char, side = 'player') {
  const portrait = char.portrait || `assets/characters/${char.id}.png`;
  return `
    <div class="standee-frame ${side}" style="--char-gradient:${char.color}">
      <div class="standee-fallback">${char.icon}</div>
      <img src="${portrait}" alt="${escapeHtml(char.name)}" loading="lazy" onload="this.parentElement.classList.add('image-loaded')" onerror="this.remove()">
    </div>
  `;
}

function renderPlayerPreview() {
  const box = $('playerPreview');
  if (!box) return;
  const char = characterById(selectedPlayer);
  box.style.setProperty('--char-gradient', char.color);
  box.innerHTML = `
    <div class="preview-art">${characterStandeeHtml(char, 'player')}</div>
    <div class="preview-copy">
      <p class="eyebrow">SELECTED PLAYER</p>
      <h2><span class="preview-icon">${char.icon}</span><span class="preview-name">${escapeHtml(char.name)}</span></h2>
      <div class="preview-badges">
        <span>${escapeHtml(char.title)}</span>
        <span>難易度：${'★'.repeat(char.power)}${'☆'.repeat(5 - char.power)}</span>
      </div>
      <p class="preview-desc">${escapeHtml(characterPlayStyle(char))}</p>
      <blockquote>${escapeHtml(char.quote)}</blockquote>
      <div class="preview-actions">
        <button id="confirmPlayerBtn" type="button" class="primary">このキャラで決定</button>
      </div>
    </div>
  `;
  $('confirmPlayerBtn')?.addEventListener('click', goOpponentStep);
}

function renderOpponentPreview() {
  const box = $('opponentPreview');
  if (!box) return;
  if (currentOpponentFocus === selectedPlayer) currentOpponentFocus = CHARACTERS.find(c => c.id !== selectedPlayer)?.id || 'akane';
  const char = characterById(currentOpponentFocus);
  const chosen = selectedOpponents.includes(char.id);
  const full = selectedOpponents.length >= 3;
  box.style.setProperty('--char-gradient', char.color);
  const actionLabel = chosen ? 'この相手を外す' : full ? '入れ替えて入れる' : '対戦相手に入れる';
  box.innerHTML = `
    <div class="preview-art">${characterStandeeHtml(char, 'opponent')}</div>
    <div class="preview-copy">
      <p class="eyebrow">SELECTED RIVAL</p>
      <h2><span class="preview-icon">${char.icon}</span><span class="preview-name">${escapeHtml(char.name)}</span></h2>
      <div class="preview-badges">
        <span>${escapeHtml(char.title)}</span>
        <span>強さ：${'★'.repeat(char.power)}${'☆'.repeat(5 - char.power)}</span>
        <span>${chosen ? '選択中' : '未選択'}</span>
      </div>
      <p class="preview-desc">${escapeHtml(characterPlayStyle(char))}</p>
      <blockquote>${escapeHtml(char.quote)}</blockquote>
      <div class="preview-actions">
        <button id="toggleOpponentBtn" type="button" class="${chosen ? 'ghost' : 'accent'}">${actionLabel}</button>
      </div>
    </div>
  `;
  $('toggleOpponentBtn')?.addEventListener('click', () => toggleOpponent(char.id));
}

function renderOpponentSlots() {
  const slots = $('opponentSlots');
  const count = $('opponentCountLabel');
  if (!slots) return;
  if (count) count.textContent = `${selectedOpponents.length} / 3`;
  slots.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const id = selectedOpponents[i];
    const div = document.createElement('div');
    div.className = `opponent-slot ${id ? 'filled' : ''}`;
    if (id) {
      const char = characterById(id);
      div.style.setProperty('--char-gradient', char.color);
      div.innerHTML = `${avatarHtml(char, 'slot')}<span>${escapeHtml(char.name)}</span><button type="button" aria-label="${escapeHtml(char.name)}を外す">×</button>`;
      div.querySelector('button')?.addEventListener('click', () => { removeOpponent(id); });
      div.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') return;
        currentOpponentFocus = id;
        renderCharacterChoices();
      });
    } else {
      div.innerHTML = `<span class="empty-slot">未選択</span>`;
    }
    slots.appendChild(div);
  }
}

function toggleOpponent(id) {
  if (id === selectedPlayer) return;
  if (selectedOpponents.includes(id)) {
    selectedOpponents = selectedOpponents.filter(oppId => oppId !== id);
  } else {
    if (selectedOpponents.length >= 3) selectedOpponents.shift();
    selectedOpponents.push(id);
  }
  currentOpponentFocus = id;
  renderCharacterChoices();
}

function removeOpponent(id) {
  selectedOpponents = selectedOpponents.filter(oppId => oppId !== id);
  if (currentOpponentFocus === id) currentOpponentFocus = selectedOpponents[0] || CHARACTERS.find(c => c.id !== selectedPlayer)?.id || 'akane';
  renderCharacterChoices();
}

function characterPlayStyle(char) {
  const s = char.stats || {};
  const best = Object.entries({攻撃:s.attack||0, 守備:s.defense||0, 効率:s.efficiency||0, 運:s.luck||0}).sort((a,b)=>b[1]-a[1])[0]?.[0] || 'バランス';
  if (char.id === 'minaho') return '初心者ナビと相性がいい操作キャラ。無理に背伸びせず、気持ちいい和了を拾いやすい。';
  if (char.power >= 5) return `${best}がかなり高い強敵。読みと流れが噛み合うと一気に和了まで持っていく。`;
  if (char.power >= 4) return `${best}寄りの中〜上級相手。押し引きがはっきりしていて、油断すると刺してくる。`;
  return `${best}に特徴がある遊びやすい相手。初心者が感覚を掴む練習卓にも向いている。`;
}

function avatarHtml(char, extraClass = '') {
  const portrait = char.portrait || `assets/characters/${char.id}.png`;
  return `
    <div class="avatar ${extraClass}" style="--char-gradient:${char.color}" title="${escapeHtml(char.name)}">
      <span class="avatar-fallback">${char.icon}</span>
      <img src="${portrait}" alt="${escapeHtml(char.name)}" loading="lazy" onload="this.parentElement.classList.add('image-loaded')" onerror="this.remove()">
    </div>
  `;
}

function characterCard(char, selected, onClick) {
  const card = document.createElement('button');
  card.className = `char-card ${selected ? 'selected' : ''}`;
  card.style.setProperty('--char-gradient', char.color);
  card.innerHTML = `
    <div class="char-row">
      ${avatarHtml(char)}
      <div>
        <div class="char-name">${escapeHtml(char.name)}</div>
        <div class="char-title">${escapeHtml(char.title)}</div>
      </div>
    </div>
    <div class="stars">${'★'.repeat(char.power)}${'☆'.repeat(5 - char.power)}</div>
    <div class="char-quote">${escapeHtml(char.quote)}</div>
  `;
  card.addEventListener('click', onClick);
  return card;
}

function randomOpponents(strongBias = false) {
  const pool = CHARACTERS.filter(c => c.id !== selectedPlayer);
  const weighted = [];
  pool.forEach(c => {
    const w = strongBias ? c.power : Math.max(1, 6 - c.power);
    for (let i = 0; i < w; i++) weighted.push(c.id);
  });
  const result = [];
  while (result.length < 3 && weighted.length) {
    const id = weighted.splice(Math.floor(Math.random() * weighted.length), 1)[0];
    if (!result.includes(id)) result.push(id);
  }
  selectedOpponents = result;
  currentOpponentFocus = selectedOpponents[0] || currentOpponentFocus;
  renderCharacterChoices();
}


function setTopBackgroundAsset() {
  const isMobile = window.matchMedia('(max-width: 900px)').matches;
  const candidates = isMobile
    ? [
        'assets/ui/top_mobile.png',
        'assets/ui/top_mobile.jpg',
        'assets/ui/top_background_mobile.png',
        'assets/ui/top_background_mobile.jpg',
        'assets/ui/background_mobile.png',
        'assets/ui/background_mobile.jpg'
      ]
    : [
        'assets/ui/top_pc.png',
        'assets/ui/top_pc.jpg',
        'assets/ui/top_background_pc.png',
        'assets/ui/top_background_pc.jpg',
        'assets/ui/background_pc.png',
        'assets/ui/background_pc.jpg'
      ];
  let index = 0;
  const tryNext = () => {
    const src = candidates[index++];
    if (!src) {
      document.documentElement.style.removeProperty('--top-bg-image');
      return;
    }
    const img = new Image();
    img.onload = () => document.documentElement.style.setProperty('--top-bg-image', `url("${src}")`);
    img.onerror = tryNext;
    img.src = src + `?v=${Date.now()}`;
  };
  tryNext();
}

function showTopScreen() {
  setTopBackgroundAsset();
  const top = $('topScreen');
  const menu = $('menuScreen');
  const game = $('gameScreen');
  if (top) {
    top.classList.remove('hidden');
    top.removeAttribute('hidden');
    top.style.display = '';
    top.setAttribute('aria-hidden', 'false');
  }
  if (menu) {
    menu.classList.add('hidden');
    menu.style.display = '';
    menu.setAttribute('aria-hidden', 'true');
  }
  if (game) {
    game.classList.add('hidden');
    game.style.display = '';
    game.setAttribute('aria-hidden', 'true');
  }
  document.body.classList.add('top-active');
  state.screen = 'top';
}

function enterMenuFromTop() {
  const top = $('topScreen');
  const menu = $('menuScreen');
  const game = $('gameScreen');
  if (top) {
    top.classList.add('hidden');
    top.style.display = 'none';
    top.setAttribute('aria-hidden', 'true');
  }
  if (menu) {
    menu.classList.remove('hidden');
    menu.style.display = '';
    menu.setAttribute('aria-hidden', 'false');
  }
  if (game) {
    game.classList.add('hidden');
    game.style.display = '';
    game.setAttribute('aria-hidden', 'true');
  }
  $('playerSelectStep')?.classList.remove('hidden');
  $('opponentSelectStep')?.classList.add('hidden');
  document.body.classList.remove('top-active');
  state.screen = 'menu';
  renderCharacterChoices();
}

function returnToSelectFromGame(step = 'opponents') {
  state.screen = 'menu';
  state.ended = true;
  state.locked = true;
  state.pendingRon = null;
  state.pendingCall = null;
  state.riichiPending = false;
  hideResult();
  hideMeldPeek();
  hideCallButtons();
  closeYakuModal();

  const top = $('topScreen');
  const menu = $('menuScreen');
  const game = $('gameScreen');
  if (top) {
    top.classList.add('hidden');
    top.style.display = 'none';
    top.setAttribute('aria-hidden', 'true');
  }
  if (menu) {
    menu.classList.remove('hidden');
    menu.style.display = '';
    menu.setAttribute('aria-hidden', 'false');
  }
  if (game) {
    game.classList.add('hidden');
    game.style.display = '';
    game.setAttribute('aria-hidden', 'true');
  }
  document.body.classList.remove('top-active');

  if (step === 'player') {
    $('opponentSelectStep')?.classList.add('hidden');
    $('playerSelectStep')?.classList.remove('hidden');
  } else {
    while (selectedOpponents.length < 3) {
      const next = CHARACTERS.find(c => c.id !== selectedPlayer && !selectedOpponents.includes(c.id));
      if (!next) break;
      selectedOpponents.push(next.id);
    }
    currentOpponentFocus = selectedOpponents[0] || CHARACTERS.find(c => c.id !== selectedPlayer)?.id || 'akane';
    $('playerSelectStep')?.classList.add('hidden');
    $('opponentSelectStep')?.classList.remove('hidden');
  }
  renderCharacterChoices();
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
}

function setupEventListeners() {
  $('topStartBtn')?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    enterMenuFromTop();
  });
  $('randomOpponentsBtn').addEventListener('click', () => randomOpponents(false));
  $('backToPlayerBtn')?.addEventListener('click', goPlayerStep);
  $('recommendedBtn').addEventListener('click', () => {
    selectedOpponents = ['akane', 'hin', 'yuk'].filter(id => id !== selectedPlayer);
    CHARACTERS.forEach(c => {
      if (selectedOpponents.length < 3 && c.id !== selectedPlayer && !selectedOpponents.includes(c.id)) selectedOpponents.push(c.id);
    });
    currentOpponentFocus = selectedOpponents[0] || currentOpponentFocus;
    renderCharacterChoices();
  });
  $('startBtn').addEventListener('click', () => startGame(true));
  $('tsumoBtn').addEventListener('click', () => humanTsumo());
  $('ronBtn').addEventListener('click', () => humanRon());
  $('skipBtn').addEventListener('click', () => skipAction());
  $('chiBtn').addEventListener('click', () => humanCall('chi'));
  $('ponBtn').addEventListener('click', () => humanCall('pon'));
  $('kanBtn').addEventListener('click', () => humanCall('kan'));
  $('callChiBtn').addEventListener('click', () => humanCall('chi'));
  $('callPonBtn').addEventListener('click', () => humanCall('pon'));
  $('callKanBtn').addEventListener('click', () => humanCall('kan'));
  $('callSkipBtn').addEventListener('click', () => skipAction());
  $('sortBtn').addEventListener('click', () => { sortHand(state.players[0].hand); renderAll(); });
  $('newRoundBtn').addEventListener('click', () => startGame(true));
  $('backToOpponentsFromGameBtn')?.addEventListener('click', () => returnToSelectFromGame('opponents'));
  $('backToPlayerFromGameBtn')?.addEventListener('click', () => returnToSelectFromGame('player'));
  $('yakuListBtn').addEventListener('click', () => openYakuModal());
  $('menuYakuListBtn').addEventListener('click', () => openYakuModal());
  $('closeYakuBtn').addEventListener('click', () => closeYakuModal());
  $('yakuModal').addEventListener('click', (event) => { if (event.target.id === 'yakuModal') closeYakuModal(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeYakuModal(); });
  $('installBtn').addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    $('installBtn').classList.add('hidden');
  });
}

async function startGame(fresh = true) {
  if (selectedOpponents.length < 3) {
    const pool = CHARACTERS.filter(c => c.id !== selectedPlayer && !selectedOpponents.includes(c.id));
    while (selectedOpponents.length < 3 && pool.length) selectedOpponents.push(pool.shift().id);
  }
  state.screen = 'game';
  $('topScreen')?.classList.add('hidden');
  if ($('topScreen')) $('topScreen').style.display = 'none';
  document.body.classList.remove('top-active');
  $('menuScreen').classList.add('hidden');
  $('gameScreen').classList.remove('hidden');

  if (fresh || !state.players.length) {
    const ids = [selectedPlayer, ...selectedOpponents.slice(0, 3)];
    state.players = ids.map((id, index) => ({
      ...structuredClone(characterById(id)),
      index,
      wind: WINDS[index],
      score: 25000,
      hand: [],
      discards: [],
      melds: [],
      riichi: false,
      riichiDiscardIndex: null,
      lastDraw: null,
      isHuman: index === 0
    }));
    state.dealer = 0;
    state.currentHand = 1;
    state.matchLength = selectedMatchLength;
  } else {
    state.currentHand += 1;
  }
  state.current = 0;
  state.ended = false;
  state.locked = false;
  state.pendingRon = null;
  state.pendingCall = null;
  state.riichiPending = false;
  resetRound();
  hideResult();
  log(`対局開始。${state.currentHand}局目、親は${state.players[0].name}。`, true);
  await showCutin(state.players[0], `局開始 ${state.matchLength === Infinity ? `${state.currentHand}局目` : `${state.currentHand}/${state.matchLength}局`}`, eventQuote(state.players[0], 'start'), { kind: 'start', duration: 2300 });
  renderAll();
  await proceedTurn();
}

function resetRound() {
  state.wall = buildWall();
  shuffle(state.wall);
  state.dora = state.wall.pop();
  state.players.forEach(p => { p.hand = []; p.discards = []; p.melds = []; p.riichi = false; p.riichiDiscardIndex = null; p.lastDraw = null; });
  for (let r = 0; r < 13; r++) {
    for (const p of state.players) p.hand.push(state.wall.pop());
  }
  state.players.forEach(p => sortHand(p.hand));
  state.current = state.dealer;
  state.turnDrawn = null;
  state.pendingRon = null;
  state.pendingCall = null;
  state.ended = false;
  state.locked = false;
  state.riichiPending = false;
}

function buildWall() {
  const wall = [];
  for (let tile = 0; tile < 34; tile++) {
    for (let i = 0; i < 4; i++) wall.push(tile);
  }
  return wall;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

async function proceedTurn() {
  if (state.ended || state.locked) return;
  hideCallButtons();
  if (state.wall.length <= 0) {
    exhaustiveDraw();
    return;
  }
  const player = state.players[state.current];
  $('centerMessage').textContent = `${player.name}の摸牌`;
  drawTile(player);
  renderAll();
  await sleep(player.isHuman ? 80 : 460);
  if (state.screen !== 'game' || state.ended) return;

  if (canAgari(player, null, 'tsumo')) {
    if (player.isHuman) {
      $('tsumoBtn').disabled = false;
      $('centerMessage').textContent = 'ツモれるよ。和了する？';
      renderHand();
      return;
    }
    if (botAcceptWin(player, 'tsumo', player.lastDraw)) {
      await botTsumo(player);
      return;
    }
  }

  const botKanOption = !player.isHuman ? chooseBotSelfKan(player) : null;
  if (botKanOption) {
    await performSelfKan(player, botKanOption);
    return;
  }

  if (!player.isHuman && !player.riichi && canDeclareRiichi(player) && player.score >= 1000) {
    const riichiDiscardIndex = chooseRiichiDiscardIndex(player);
    const pressure = Math.max(0, 56 - state.wall.length) / 80;
    const chance = Math.min(0.96, (player.stats.attack + player.stats.efficiency + player.power * 10) / 245 + pressure);
    if (riichiDiscardIndex !== -1 && Math.random() < chance) {
      player.riichi = true;
      player.riichiDiscardIndex = riichiDiscardIndex;
      player.score -= 1000;
      await showCutin(player, '立直', eventQuote(player, 'riichi'), { kind: 'riichi', duration: 2200 });
      log(`${player.name}が立直。`, true);
    }
  }

  if (player.isHuman) {
    $('centerMessage').textContent = '捨てる牌を選んでね';
    $('tsumoBtn').disabled = !canAgari(player, null, 'tsumo');
    $('riichiBtn').disabled = !(canDeclareRiichi(player) && !player.riichi && player.score >= 1000);
    const selfKans = getSelfKanOptions(player);
    if (selfKans.length && !player.riichi) {
      $('kanBtn').classList.remove('hidden');
      $('kanBtn').disabled = false;
      $('kanBtn').textContent = selfKans[0].type === 'ankan' ? '暗槓' : '加槓';
    }
    renderHand();
    return;
  }

  const discardIndex = chooseBotDiscard(player);
  await discardTile(player, discardIndex);
}

function drawTile(player) {
  if (!player.isHuman) maybeBiasDraw(player);
  maybeStackWinningTileForRiichi(player);
  const tile = state.wall.pop();
  player.hand.push(tile);
  player.lastDraw = tile;
  state.turnDrawn = tile;
  if (!player.riichi) sortHand(player.hand);
  log(`${player.name}が摸牌。`);
}


function maybeStackWinningTileForRiichi(player) {
  // 初心者向けゲームとして、リーチ後は「ちゃんと和了が起きる」テンポを優先する。
  // 実麻雀より少しドラマ寄りに、待ち牌が山に残っていれば一定確率で山上へ寄せる。
  if (!player.riichi || player.isHuman || !player.hand || player.hand.length % 3 !== 1) return;
  const waits = getWinningTiles(player.hand, meldCount(player)).filter(tile => state.wall.includes(tile));
  if (!waits.length) return;
  const pressure = Math.max(0, 70 - state.wall.length) / 75;
  const chance = Math.min(0.88, 0.24 + player.power * 0.075 + player.stats.luck / 420 + pressure);
  if (Math.random() > chance) return;
  const tile = waits[Math.floor(Math.random() * waits.length)];
  const positions = [];
  state.wall.forEach((w, i) => { if (w === tile) positions.push(i); });
  if (!positions.length) return;
  const pos = positions[Math.floor(Math.random() * positions.length)];
  const top = state.wall.length - 1;
  [state.wall[top], state.wall[pos]] = [state.wall[pos], state.wall[top]];
}

function maybeBiasDraw(player) {
  const { luck, efficiency } = player.stats;
  const bossBoost = player.power >= 5 ? 0.16 : player.power >= 4 ? 0.08 : 0;
  const chance = Math.min(.72, (luck + player.power * 13) / 390 + bossBoost);
  if (Math.random() > chance || state.wall.length < 12) return;
  const sample = Math.min(16 + Math.floor(efficiency / 12) + player.power * 2, state.wall.length);
  let bestPos = state.wall.length - 1;
  let bestScore = -Infinity;
  const base = player.hand.slice();
  for (let i = 0; i < sample; i++) {
    const pos = state.wall.length - 1 - i;
    const tile = state.wall[pos];
    const test = base.concat(tile);
    const score = evaluateHand(test, player) + highValuePotentialScore(test, player) * (player.power >= 4 ? 0.85 : 0.25) + Math.random() * 2;
    if (score > bestScore) {
      bestScore = score;
      bestPos = pos;
    }
  }
  const top = state.wall.length - 1;
  [state.wall[top], state.wall[bestPos]] = [state.wall[bestPos], state.wall[top]];
}

async function humanTsumo() {
  const player = state.players[0];
  if (!canAgari(player, null, 'tsumo')) return;
  finishHand({ winner: player, from: null, type: 'tsumo', tile: player.lastDraw });
}

async function humanRon() {
  if (!state.pendingRon) return;
  const { winner, from, tile } = state.pendingRon;
  finishHand({ winner, from, type: 'ron', tile });
}

async function skipRon() {
  state.pendingRon = null;
  $('ronBtn').classList.add('hidden');
  $('skipBtn').classList.add('hidden');
  state.locked = false;
  nextTurn();
  renderAll();
  await proceedTurn();
}

async function botTsumo(player) {
  finishHand({ winner: player, from: null, type: 'tsumo', tile: player.lastDraw });
}

async function discardTile(player, handIndex) {
  if (state.ended) return;
  hideCallButtons();
  const [tile] = player.hand.splice(handIndex, 1);
  player.discards.push(tile);
  player.lastDraw = null;
  state.turnDrawn = null;
  if (player.isHuman && state.riichiPending) {
    if (isTenpai(player.hand, meldCount(player))) {
      player.riichi = true;
      player.score -= 1000;
      await showCutin(player, '立直', eventQuote(player, 'riichi'), { kind: 'riichi', duration: 2200 });
      log(`${player.name}が立直。`, true);
    } else {
      log('その捨て牌だとテンパイが崩れるため、立直は取り消された。', true);
    }
    state.riichiPending = false;
  }
  if (!player.riichi) sortHand(player.hand);
  log(`${player.name}が${tileLabel(tile)}を捨てた。`);
  renderAll();
  await sleep(250);
  if (state.screen !== 'game' || state.ended) return;

  const ronWinners = [];
  for (const other of state.players) {
    if (other.index === player.index) continue;
    if (canAgari(other, tile, 'ron')) ronWinners.push(other);
  }

  if (ronWinners.length) {
    const humanWinner = ronWinners.find(p => p.isHuman);
    if (humanWinner) {
      state.pendingRon = { winner: humanWinner, from: player, tile };
      state.locked = true;
      $('ronBtn').classList.remove('hidden');
      $('skipBtn').classList.remove('hidden');
      $('centerMessage').textContent = `${tileLabel(tile)}でロンできるよ`; 
      renderAll();
      return;
    }
    const botCandidates = ronWinners.sort((a, b) => botRonPriority(b, tile) - botRonPriority(a, tile));
    const botWinner = botCandidates.find(candidate => botAcceptWin(candidate, 'ron', tile));
    if (botWinner) {
      finishHand({ winner: botWinner, from: player, type: 'ron', tile });
      return;
    }
  }

  const calls = getCallChoices(player, tile);
  const humanChoice = calls.find(c => c.caller.isHuman);
  if (humanChoice) {
    state.pendingCall = { from: player, tile, choices: calls };
    state.locked = true;
    showHumanCallOptions(humanChoice, tile);
    renderAll();
    return;
  }

  const botChoice = chooseBotCall(calls);
  if (botChoice) {
    await performCall(botChoice);
    return;
  }

  nextTurn();
  await proceedTurn();
}

function getCallChoices(discarder, tile) {
  const choices = [];
  for (const caller of state.players) {
    if (caller.index === discarder.index || caller.riichi) continue;
    const counts = countsFromHand(caller.hand);
    const options = { chi: [], pon: false, kan: false };
    if (counts[tile] >= 2) options.pon = true;
    if (counts[tile] >= 3) options.kan = true;
    if (caller.index === (discarder.index + 1) % 4) options.chi = getChiOptions(caller.hand, tile);
    if (options.pon || options.kan || options.chi.length) choices.push({ caller, from: discarder, tile, options });
  }
  return choices;
}

function getChiOptions(hand, tile) {
  if (isHonor(tile)) return [];
  const counts = countsFromHand(hand);
  const opts = [];
  const suitBase = SUIT(tile) * 9;
  const n = tile - suitBase;
  const candidates = [
    [n - 2, n - 1],
    [n - 1, n + 1],
    [n + 1, n + 2]
  ];
  candidates.forEach(pair => {
    const [a, b] = pair;
    if (a < 0 || b < 0 || a > 8 || b > 8) return;
    const ta = suitBase + a;
    const tb = suitBase + b;
    if (counts[ta] > 0 && counts[tb] > 0) opts.push([ta, tb]);
  });
  return opts;
}

function showHumanCallOptions(choice, tile) {
  $('centerMessage').textContent = `${tileLabel(tile)}を鳴けるよ。鳴くと立直はできなくなる。`;
  // v12: インラインの鳴きボタンは手牌エリアを押し下げるため使わず、浮動パネルだけ表示する。
  ['chiBtn','ponBtn','kanBtn','skipBtn'].forEach(id => {
    const btn = $(id);
    if (!btn) return;
    btn.classList.add('hidden');
    btn.disabled = true;
  });
  showCallPrompt(choice, tile);
}

function showCallPrompt(choice, tile) {
  const prompt = $('callPrompt');
  if (!prompt) return;
  $('callPromptTitle').innerHTML = `${tileLabel(tile)}を鳴けるよ`;
  const configs = [
    ['callChiBtn', !!choice.options.chi.length, 'チー'],
    ['callPonBtn', !!choice.options.pon, 'ポン'],
    ['callKanBtn', !!choice.options.kan, '大明槓']
  ];
  configs.forEach(([id, enabled, label]) => {
    const btn = $(id);
    if (!btn) return;
    btn.textContent = label;
    btn.classList.toggle('hidden', !enabled);
    btn.disabled = !enabled;
  });
  prompt.classList.remove('hidden');
}

function hideCallButtons() {
  ['chiBtn','ponBtn','kanBtn'].forEach(id => {
    const btn = $(id);
    if (!btn) return;
    btn.classList.add('hidden');
    btn.disabled = true;
  });
  ['callChiBtn','callPonBtn','callKanBtn'].forEach(id => {
    const btn = $(id);
    if (!btn) return;
    btn.classList.add('hidden');
    btn.disabled = true;
  });
  const prompt = $('callPrompt');
  if (prompt) prompt.classList.add('hidden');
  const kanBtn = $('kanBtn');
  if (kanBtn) kanBtn.textContent = 'カン';
}

async function humanCall(type) {
  if (!state.pendingCall) {
    if (type === 'kan') await humanSelfKan();
    return;
  }
  const choice = state.pendingCall.choices.find(c => c.caller.isHuman);
  if (!choice) return;
  if (type === 'chi' && !choice.options.chi.length) return;
  if (type === 'pon' && !choice.options.pon) return;
  if (type === 'kan' && !choice.options.kan) return;
  if (type === 'chi') choice.chiTiles = chooseBestChiTiles(choice.caller, choice.tile, choice.options.chi);
  choice.type = type;
  state.pendingCall = null;
  state.locked = false;
  hideCallButtons();
  $('skipBtn').classList.add('hidden');
  await performCall(choice);
}

async function skipAction() {
  if (state.pendingRon) {
    await skipRon();
    return;
  }
  if (state.pendingCall) {
    const pending = state.pendingCall;
    state.pendingCall = null;
    state.locked = false;
    hideCallButtons();
    $('skipBtn').classList.add('hidden');
    const botChoice = chooseBotCall(pending.choices.filter(c => !c.caller.isHuman));
    if (botChoice) {
      await performCall(botChoice);
      return;
    }
    nextTurn();
    renderAll();
    await proceedTurn();
  }
}

function chooseBestChiTiles(caller, tile, options) {
  let best = options[0];
  let bestScore = -Infinity;
  for (const opt of options) {
    const sim = caller.hand.slice();
    removeOne(sim, opt[0]);
    removeOne(sim, opt[1]);
    const score = evaluateHand(sim, caller) + ukeireScore(sim) + (opt.every(isSimple) && isSimple(tile) ? 12 : 0);
    if (score > bestScore) { bestScore = score; best = opt; }
  }
  return best;
}


function callValueGain(player, tile, type) {
  const before = allTilesOf(player);
  const after = before.concat(tile);
  let gain = highValuePotentialScore(after, player) - highValuePotentialScore(before, player);
  if (isYakuhaiTileFor(player, tile) && (type === 'pon' || type === 'kan')) gain += 42;
  if (type === 'kan') gain += 36 + player.stats.luck / 6;
  if (type === 'chi' && player.power >= 5 && !supportsFlushPlan(player.hand, tile)) gain -= 26;
  return gain;
}

function supportsFlushPlan(hand, tile) {
  if (isHonor(tile)) return true;
  const counts = suitCounts(hand.concat(tile));
  const suit = SUIT(tile);
  const offSuit = counts.numberTotal - counts[suit];
  return counts[suit] + counts.honor >= 8 && offSuit <= 4;
}

function suitCounts(hand) {
  const counts = { 0: 0, 1: 0, 2: 0, honor: 0, numberTotal: 0 };
  hand.forEach(t => {
    if (isHonor(t)) counts.honor++;
    else { counts[SUIT(t)]++; counts.numberTotal++; }
  });
  return counts;
}

function highValuePotentialScore(hand, player) {
  if (!hand || !player) return 0;
  const power = Number(player.power) || 0;
  if (power < 4) return 0;
  const counts = countsFromHand(hand);
  const suits = suitCounts(hand);
  const maxSuit = Math.max(suits[0], suits[1], suits[2]);
  const otherSuits = suits.numberTotal - maxSuit;
  const pairs = counts.filter(c => c >= 2).length;
  const triples = counts.filter(c => c >= 3).length;
  const terminalsUnique = [0,8,9,17,18,26,27,28,29,30,31,32,33].filter(t => counts[t] > 0).length;
  const dora = state.dora == null ? 0 : counts[state.dora];
  const dragons = [31,32,33].reduce((sum, t) => sum + Math.min(counts[t], 3), 0);

  let score = 0;
  if (maxSuit + suits.honor >= 7) score += (maxSuit + suits.honor) * 7 - otherSuits * 9;
  if (maxSuit >= 8 && suits.honor <= 2) score += 36;
  if (pairs >= 4) score += pairs * 12;
  if (triples >= 2) score += triples * 24;
  if (dragons >= 4) score += dragons * 8;
  if (terminalsUnique >= 8) score += terminalsUnique * 10;
  if (dora) score += dora * 22;
  return Math.max(0, score) * (0.75 + power * 0.08);
}

function previewWinFor(player, type, tile = null) {
  const scoringHand = player.hand.slice();
  if (type === 'ron' && tile != null && scoringHand.length % 3 === 1) scoringHand.push(tile);
  return analyzeWin(scoringHand, type, tile, player, { preview: true });
}

function desiredBotWinHan(player) {
  const remaining = state.wall.length;
  if (player.power >= 5) {
    if (remaining <= 12) return 2;
    if (remaining <= 28) return 3;
    return 4;
  }
  if (remaining <= 10) return 1;
  if (remaining <= 30) return 2;
  return 3;
}

function hasShowyYaku(result) {
  if (!result || !result.yaku) return false;
  return result.yaku.some(name => /清一色|混一色|対々和|七対子|国士無双|ドラ[2-9]|役牌[2-9]/.test(name));
}

function chooseBotCall(calls) {
  const viable = [];
  for (const choice of calls) {
    const c = choice.caller;
    if (choice.options.kan && shouldBotCall(c, choice.tile, 'kan')) viable.push({ ...choice, type: 'kan', priority: callPriority(c, choice.tile, 'kan') + 35 });
    if (choice.options.pon && shouldBotCall(c, choice.tile, 'pon')) viable.push({ ...choice, type: 'pon', priority: callPriority(c, choice.tile, 'pon') + 20 });
    if (choice.options.chi.length && shouldBotCall(c, choice.tile, 'chi')) {
      const chiTiles = chooseBestChiTiles(c, choice.tile, choice.options.chi);
      viable.push({ ...choice, type: 'chi', chiTiles, priority: callPriority(c, choice.tile, 'chi') });
    }
  }
  if (!viable.length) return null;
  viable.sort((a, b) => b.priority - a.priority);
  return viable[0];
}

function strongBotCallPlan(player, tile, type) {
  const before = allTilesOf(player);
  const after = before.concat(tile);
  const counts = countsFromHand(after);
  const suits = suitCounts(after);
  const maxSuit = Math.max(suits[0], suits[1], suits[2]);
  const offSuit = suits.numberTotal - maxSuit;
  const triples = counts.filter(c => c >= 3).length;
  const pairs = counts.filter(c => c >= 2).length;
  const doraCount = state.dora == null ? 0 : counts[state.dora];
  const yakuhai = isYakuhaiTileFor(player, tile);
  const flushPlan = supportsFlushPlan(player.hand, tile) && maxSuit + suits.honor >= 8 && offSuit <= 3;
  const toitoiPlan = (type === 'pon' || type === 'kan') && (triples >= 2 || (triples >= 1 && pairs >= 3));
  const doraPlan = doraCount >= 2 || tile === state.dora;
  return { yakuhai, flushPlan, toitoiPlan, doraPlan };
}

function shouldBotCall(player, tile, type) {
  if (player.riichi) return false;

  // v39: 強キャラは基本メンゼン・高打点狙い。
  // すぐ鳴いて安手へ落ちる挙動を抑え、鳴くなら役牌/染め/対々/ドラ/終盤だけに寄せる。
  if (player.power >= 4) {
    const valueGain = callValueGain(player, tile, type);
    const plan = strongBotCallPlan(player, tile, type);
    const remaining = state.wall.length;
    const veryLate = remaining <= 14;
    const late = remaining <= 24;

    if (type === 'chi') {
      if (!plan.flushPlan && !plan.doraPlan && !veryLate) return false;
      if (valueGain < (player.power >= 5 ? 62 : 48) && !veryLate) return false;
    }

    if (type === 'pon') {
      const hasHighPlan = plan.yakuhai || plan.flushPlan || plan.toitoiPlan || plan.doraPlan;
      if (!hasHighPlan && !veryLate) return false;
      if (valueGain < (player.power >= 5 ? 42 : 30) && !plan.yakuhai && !veryLate) return false;
    }

    if (type === 'kan') {
      // カンは派手だけど危険なので、強キャラほど意味のあるカンだけ。
      const hasKanReason = plan.yakuhai || plan.flushPlan || plan.toitoiPlan || plan.doraPlan || valueGain >= 60;
      if (!hasKanReason && !late) return false;
    }

    let chance = 0.04 + player.stats.attack / 900 + player.stats.efficiency / 1200;
    if (type === 'chi') chance += player.power >= 5 ? 0.03 : 0.06;
    if (type === 'pon') chance += player.power >= 5 ? 0.08 : 0.12;
    if (type === 'kan') chance += player.power >= 5 ? 0.10 : 0.14;
    if (plan.yakuhai) chance += player.power >= 5 ? 0.30 : 0.24;
    if (plan.flushPlan) chance += 0.24;
    if (plan.toitoiPlan) chance += 0.22;
    if (plan.doraPlan) chance += 0.18;
    if (valueGain >= 60) chance += 0.16;
    if (valueGain >= 90) chance += 0.18;
    if (veryLate) chance += 0.18;

    const cap = player.power >= 5 ? 0.62 : 0.72;
    return Math.random() < Math.min(cap, Math.max(0.01, chance));
  }

  const attack = player.stats.attack / 100;
  const efficiency = player.stats.efficiency / 100;
  const base = type === 'kan' ? 0.18 : type === 'pon' ? 0.28 : 0.22;
  let chance = base + attack * 0.24 + efficiency * 0.14 + player.power * 0.035;
  if (isYakuhaiTileFor(player, tile)) chance += 0.28;
  if (isSimple(tile)) chance += 0.08;
  if (type === 'chi' && (!isSimple(tile) || player.stats.defense > player.stats.attack + 18)) chance -= 0.12;
  if (type === 'kan') chance += player.stats.luck / 500;
  return Math.random() < Math.min(0.88, Math.max(0.02, chance));
}

function callPriority(player, tile, type) {
  let score = player.power * 10 + player.stats.attack * .45 + player.stats.efficiency * .55 + Math.random() * 30;
  if (isYakuhaiTileFor(player, tile)) score += 45;
  if (type === 'kan') score += player.stats.luck * .25;
  if (type === 'chi' && isSimple(tile)) score += 10;
  if (player.power >= 4) {
    const plan = strongBotCallPlan(player, tile, type);
    score += callValueGain(player, tile, type) * (player.power >= 5 ? 1.35 : 0.95);
    if (type === 'chi') score -= player.power >= 5 ? 44 : 26;
    if (plan.yakuhai) score += 34;
    if (plan.flushPlan) score += 42;
    if (plan.toitoiPlan) score += 36;
    if (plan.doraPlan) score += 28;
  }
  return score;
}

async function performCall(choice) {
  const { caller, from, tile, type } = choice;
  removeDiscardFromRiver(from, tile);
  caller.riichi = false;
  caller.riichiDiscardIndex = null;
  let meld;
  if (type === 'chi') {
    const chiTiles = choice.chiTiles || chooseBestChiTiles(caller, tile, choice.options.chi);
    removeOne(caller.hand, chiTiles[0]);
    removeOne(caller.hand, chiTiles[1]);
    meld = { type: 'chi', tiles: [tile, ...chiTiles].sort((a,b)=>a-b), from: from.index, open: true };
    log(`${caller.name}が${tileLabel(tile)}をチー。`, true);
  } else if (type === 'pon') {
    removeOne(caller.hand, tile);
    removeOne(caller.hand, tile);
    meld = { type: 'pon', tiles: [tile, tile, tile], from: from.index, open: true };
    log(`${caller.name}が${tileLabel(tile)}をポン。`, true);
  } else {
    removeOne(caller.hand, tile);
    removeOne(caller.hand, tile);
    removeOne(caller.hand, tile);
    meld = { type: 'kan', tiles: [tile, tile, tile, tile], from: from.index, open: true };
    log(`${caller.name}が${tileLabel(tile)}を大明槓。`, true);
  }
  caller.melds.push(meld);
  sortHand(caller.hand);
  state.current = caller.index;
  renderAll();
  const callTitle = type === 'chi' ? 'チー' : type === 'pon' ? 'ポン' : 'カン';
  await showMiniCutin(caller, callTitle, eventQuote(caller, type === 'kan' ? 'kan' : type));
  if (type === 'kan') {
    if (state.wall.length <= 0) { exhaustiveDraw(); return; }
    drawTile(caller);
    renderAll();
    await sleep(caller.isHuman ? 80 : 420);
    if (canAgari(caller, null, 'tsumo')) {
      if (caller.isHuman) {
        $('tsumoBtn').disabled = false;
        $('centerMessage').textContent = '嶺上でツモれるよ。和了する？';
        renderHand();
        return;
      }
      if (botAcceptWin(caller, 'tsumo', caller.lastDraw)) {
        finishHand({ winner: caller, from: null, type: 'tsumo', tile: caller.lastDraw });
        return;
      }
    }
  }
  if (caller.isHuman) {
    $('centerMessage').textContent = '鳴いたよ。捨てる牌を選んでね。';
    renderHand();
    return;
  }
  await sleep(420);
  const discardIndex = chooseBotDiscard(caller);
  await discardTile(caller, discardIndex);
}

function removeDiscardFromRiver(player, tile) {
  for (let i = player.discards.length - 1; i >= 0; i--) {
    if (player.discards[i] === tile) {
      player.discards.splice(i, 1);
      return;
    }
  }
}

function removeOne(hand, tile) {
  const idx = hand.indexOf(tile);
  if (idx !== -1) hand.splice(idx, 1);
}

function getSelfKanOptions(player) {
  if (!player || player.riichi) return [];
  const counts = countsFromHand(player.hand);
  const opts = [];
  counts.forEach((c, tile) => { if (c === 4) opts.push({ type: 'ankan', tile }); });
  (player.melds || []).forEach((m, meldIndex) => {
    if (m.type === 'pon' && counts[m.tiles[0]] > 0) opts.push({ type: 'kakan', tile: m.tiles[0], meldIndex });
  });
  return opts;
}

async function humanSelfKan() {
  const player = state.players[0];
  if (!player || state.current !== 0 || state.locked || state.ended) return;
  const opt = getSelfKanOptions(player)[0];
  if (!opt) return;
  await performSelfKan(player, opt);
}

function chooseBotSelfKan(player) {
  const opts = getSelfKanOptions(player);
  if (!opts.length) return null;
  let chance = 0.08 + player.power * 0.05 + player.stats.luck / 420 + player.stats.attack / 600;
  if (player.power >= 4) {
    // v39: 強キャラのカンは「派手だから即」ではなく、高打点に繋がる時だけ寄せる。
    const meaningful = opts.filter(opt => {
      const tile = opt.tile;
      const plan = strongBotCallPlan(player, tile, 'kan');
      return plan.yakuhai || plan.flushPlan || plan.toitoiPlan || plan.doraPlan || callValueGain(player, tile, 'kan') >= 70;
    });
    if (!meaningful.length) return null;
    chance = Math.min(player.power >= 5 ? 0.34 : 0.42, chance * 0.72);
    if (Math.random() >= chance) return null;
    return meaningful[Math.floor(Math.random() * meaningful.length)];
  }
  chance = Math.min(0.55, chance);
  if (Math.random() >= chance) return null;
  return opts[Math.floor(Math.random() * opts.length)];
}

async function performSelfKan(player, opt) {
  if (opt.type === 'ankan') {
    for (let i = 0; i < 4; i++) removeOne(player.hand, opt.tile);
    player.melds.push({ type: 'ankan', tiles: [opt.tile,opt.tile,opt.tile,opt.tile], from: player.index, open: false });
    log(`${player.name}が${tileLabel(opt.tile)}を暗槓。`, true);
  } else {
    removeOne(player.hand, opt.tile);
    const meld = player.melds[opt.meldIndex];
    meld.type = 'kakan';
    meld.tiles.push(opt.tile);
    log(`${player.name}が${tileLabel(opt.tile)}を加槓。`, true);
  }
  hideCallButtons();
  renderAll();
  await showMiniCutin(player, opt.type === 'ankan' ? '暗槓' : '加槓', eventQuote(player, 'kan'));
  await proceedTurnAfterKanDraw(player);
}

async function proceedTurnAfterKanDraw(player) {
  if (state.wall.length <= 0) { exhaustiveDraw(); return; }
  drawTile(player);
  renderAll();
  await sleep(player.isHuman ? 80 : 420);
  if (canAgari(player, null, 'tsumo')) {
    if (player.isHuman) {
      $('tsumoBtn').disabled = false;
      $('centerMessage').textContent = '槓のあと、ツモれるよ。和了する？';
      renderHand();
      return;
    }
    if (botAcceptWin(player, 'tsumo', player.lastDraw)) {
      finishHand({ winner: player, from: null, type: 'tsumo', tile: player.lastDraw });
      return;
    }
  }
  if (player.isHuman) {
    $('centerMessage').textContent = '槓のあと、捨てる牌を選んでね。';
    renderHand();
    return;
  }
  const discardIndex = chooseBotDiscard(player);
  await discardTile(player, discardIndex);
}

function nextTurn() {
  state.current = (state.current + 1) % 4;
}

function leavesTenpaiAfterDiscard(hand14, idx) {
  if (!hand14 || hand14.length % 3 !== 2) return false;
  const sim = hand14.slice();
  sim.splice(idx, 1);
  return isTenpai(sim);
}

function chooseRiichiDiscardIndex(player) {
  if (!player || !player.hand || player.hand.length % 3 !== 2) return -1;
  let best = -1;
  let bestScore = -Infinity;
  const seenTiles = new Set();
  for (let idx = 0; idx < player.hand.length; idx++) {
    const tile = player.hand[idx];
    if (seenTiles.has(tile)) continue;
    seenTiles.add(tile);
    const after = player.hand.slice();
    after.splice(idx, 1);
    if (!isTenpai(after)) continue;
    const waits = getWinningTiles(after).filter(t => state.wall.includes(t));
    const waitCopies = waits.reduce((sum, t) => sum + state.wall.filter(w => w === t).length, 0);
    const score = evaluateDiscardChoice(after, tile, player, false, player.hand) + waits.length * 55 + waitCopies * 14;
    if (score > bestScore) {
      bestScore = score;
      best = idx;
    }
  }
  return best;
}

function chooseBotDiscard(player) {
  if (player.riichiDiscardIndex != null) {
    const idx = player.riichiDiscardIndex;
    player.riichiDiscardIndex = null;
    return Math.max(0, Math.min(idx, player.hand.length - 1));
  }
  if (player.riichi && player.lastDraw != null) {
    return player.hand.lastIndexOf(player.lastDraw);
  }
  const uniqueIndices = [];
  const seen = new Set();
  player.hand.forEach((tile, idx) => {
    if (!seen.has(tile)) {
      uniqueIndices.push(idx);
      seen.add(tile);
    }
  });
  const chaos = Math.max(0.04, 0.42 - player.power * 0.065 - player.stats.efficiency / 500);
  if (Math.random() < chaos) return uniqueIndices[Math.floor(Math.random() * uniqueIndices.length)];

  let best = uniqueIndices[0];
  let bestScore = -Infinity;
  for (const idx of uniqueIndices) {
    const tile = player.hand[idx];
    const sim = player.hand.slice();
    sim.splice(idx, 1);
    const score = evaluateDiscardChoice(sim, tile, player, true, player.hand);
    if (score > bestScore) {
      bestScore = score;
      best = idx;
    }
  }
  return best;
}

function evaluateDiscardChoice(hand13, discardedTile, player, randomness = true, beforeHand14 = null) {
  const attackWeight = player.stats.attack / 100;
  const defenseWeight = player.stats.defense / 100;
  const efficiencyWeight = player.stats.efficiency / 100;
  const lateDefense = state.wall.length < 34 ? 1 : 0.35;
  let score = evaluateHand(hand13, player) * efficiencyWeight;
  score += ukeireScore(hand13) * (1.6 + attackWeight);
  score += safeTileScore(discardedTile) * defenseWeight * lateDefense;
  score += doraKeepPenalty(discardedTile) * attackWeight;
  score += structureBreakPenalty(beforeHand14, hand13, discardedTile);
  if (randomness) score += Math.random() * (8 - player.power);
  return score;
}

function structureBreakPenalty(beforeHand14, afterHand13, tile) {
  if (!beforeHand14) return 0;
  const before = countsFromHand(beforeHand14);
  const after = countsFromHand(afterHand13);
  let penalty = 0;

  // 初心者向けには「完成している形をむやみに崩さない」を強めに守る。
  if (before[tile] >= 3 && after[tile] === before[tile] - 1) penalty -= 90;
  if (before[tile] === 2 && after[tile] === 1) {
    const pairCount = before.filter(c => c >= 2).length;
    penalty -= pairCount >= 4 ? 70 : 38;
  }

  const runLoss = completedRunCount(beforeHand14) - completedRunCount(afterHand13);
  if (runLoss > 0) penalty -= runLoss * 55;

  const taatsuLoss = taatsuCount(beforeHand14) - taatsuCount(afterHand13);
  if (taatsuLoss > 0) penalty -= taatsuLoss * 10;

  // 役牌の対子・刻子は価値が高いので、特に雑に崩さない。
  if (isHonor(tile) && before[tile] >= 2) penalty -= 22;
  return penalty;
}

function completedRunCount(hand) {
  const counts = countsFromHand(hand);
  let runs = 0;
  for (let base of [0, 9, 18]) {
    const copy = counts.slice();
    for (let i = 0; i <= 6; i++) {
      while (copy[base + i] > 0 && copy[base + i + 1] > 0 && copy[base + i + 2] > 0) {
        runs++;
        copy[base + i]--;
        copy[base + i + 1]--;
        copy[base + i + 2]--;
      }
    }
  }
  return runs;
}

function taatsuCount(hand) {
  const counts = countsFromHand(hand);
  let taatsu = 0;
  for (let base of [0, 9, 18]) {
    for (let i = 0; i <= 7; i++) if (counts[base + i] && counts[base + i + 1]) taatsu++;
    for (let i = 0; i <= 6; i++) if (counts[base + i] && counts[base + i + 2]) taatsu++;
  }
  return taatsu;
}

function evaluateHand(hand, player) {
  const counts = countsFromHand(hand);
  if (canWin(counts, meldCount(player))) return 10000;
  let score = 0;
  for (let t = 0; t < 34; t++) {
    const c = counts[t];
    if (!c) continue;
    if (c >= 3) score += 36;
    if (c === 2) score += isHonor(t) ? 12 : 10;
    if (c === 1) score += isSimple(t) ? 2 : 0;
    if (t === state.dora) score += 10;
  }
  for (let base of [0, 9, 18]) {
    for (let i = 0; i <= 6; i++) {
      const a = counts[base + i], b = counts[base + i + 1], c = counts[base + i + 2];
      if (a && b && c) score += 24;
    }
    for (let i = 0; i <= 7; i++) if (counts[base + i] && counts[base + i + 1]) score += 7;
    for (let i = 0; i <= 6; i++) if (counts[base + i] && counts[base + i + 2]) score += 5;
  }
  const simpleCount = hand.filter(isSimple).length;
  score += simpleCount * (player.stats.efficiency / 80);
  if (player && player.power >= 4) score += highValuePotentialScore(hand, player);
  if (isTenpai(hand, meldCount(player))) score += 80;
  return score;
}

function ukeireScore(hand13) {
  const counts = countsFromHand(hand13);
  let wins = 0;
  let improvements = 0;
  const base = evaluateHand(hand13, { stats: { efficiency: 75 } });
  for (let t = 0; t < 34; t++) {
    if (counts[t] >= 4) continue;
    counts[t]++;
    if (canWin(counts, 0)) wins += 10;
    const testHand = [];
    for (let i = 0; i < 34; i++) for (let c = 0; c < counts[i]; c++) testHand.push(i);
    if (evaluateHand(testHand, { stats: { efficiency: 75 } }) > base + 8) improvements += Math.max(0, 4 - counts[t] + 1);
    counts[t]--;
  }
  return wins + improvements;
}

function safeTileScore(tile) {
  let visible = 0;
  state.players.forEach(p => p.discards.forEach(d => { if (d === tile) visible++; }));
  const honorBonus = isHonor(tile) ? visible * 2 : visible;
  return visible * 4 + honorBonus;
}

function doraKeepPenalty(tile) {
  if (tile === state.dora) return -20;
  return 0;
}

function botRonPriority(player, tile) {
  return player.power * 20 + player.stats.attack + player.stats.efficiency + (tile === state.dora ? 20 : 0) + Math.random() * 30;
}

function botAcceptWin(player, type, tile = null) {
  // 強キャラは「安いから即終了」ではなく、高打点・見せ場を優先する。
  // ただし終盤やリーチ済みの手はゲームテンポを崩さない範囲で拾う。
  if (!player || player.isHuman) return true;
  const result = previewWinFor(player, type, tile);
  if (!result || !result.hasRealYaku) return false;
  if (player.power < 4) return true;

  const target = desiredBotWinHan(player);
  const isShowy = hasShowyYaku(result) || result.han >= target;
  if (isShowy) return true;

  const remaining = state.wall.length;
  const late = remaining <= (player.power >= 5 ? 18 : 14);
  const riichiValue = player.riichi && result.han >= Math.max(2, target - 1);
  const behind = player.score <= Math.min(...state.players.map(p => p.score)) - 2400;
  if ((late || behind || riichiValue) && result.han >= Math.max(2, target - 2)) return true;

  log(`${player.name}は安い和了を見送った。もっと高く仕留めにいく。`, true);
  return false;
}

function meldCount(playerOrMelds) {
  if (!playerOrMelds) return 0;
  if (Array.isArray(playerOrMelds)) return playerOrMelds.length;
  return Array.isArray(playerOrMelds.melds) ? playerOrMelds.melds.length : 0;
}

function allTilesOf(player, extraTile = null) {
  const tiles = player.hand.slice();
  if (extraTile != null) tiles.push(extraTile);
  (player.melds || []).forEach(m => tiles.push(...m.tiles));
  return tiles;
}

function canDeclareRiichi(playerOrHand) {
  const hand14 = Array.isArray(playerOrHand) ? playerOrHand : playerOrHand.hand;
  const melds = Array.isArray(playerOrHand) ? 0 : meldCount(playerOrHand);
  if (melds > 0) return false;
  if (hand14.length % 3 !== 2) return false;
  const seen = new Set();
  for (let i = 0; i < hand14.length; i++) {
    const tile = hand14[i];
    if (seen.has(tile)) continue;
    seen.add(tile);
    const sim = hand14.slice();
    sim.splice(i, 1);
    if (isTenpai(sim, 0)) return true;
  }
  return false;
}

function isTenpai(hand13, melds = 0) {
  if (hand13.length % 3 !== 1) return false;
  const counts = countsFromHand(hand13);
  for (let t = 0; t < 34; t++) {
    if (counts[t] >= 4) continue;
    counts[t]++;
    if (canWin(counts, melds)) {
      counts[t]--;
      return true;
    }
    counts[t]--;
  }
  return false;
}

function getWinningTiles(hand13, melds = 0) {
  if (!hand13 || hand13.length % 3 !== 1) return [];
  const counts = countsFromHand(hand13);
  const waits = [];
  for (let t = 0; t < 34; t++) {
    if (counts[t] >= 4) continue;
    counts[t]++;
    if (canWin(counts, melds)) waits.push(t);
    counts[t]--;
  }
  return waits;
}

function canAgari(player, extraTile = null, type = 'ron') {
  const closed = player.hand.slice();
  if (extraTile != null) closed.push(extraTile);
  const counts = countsFromHand(closed);
  if (!canWin(counts, meldCount(player))) return false;
  const analysis = analyzeWin(closed, type, extraTile, player, { preview: true });
  return analysis.hasRealYaku;
}

function canWin(counts, melds = 0) {
  const total = counts.reduce((a, b) => a + b, 0) + melds * 3;
  if (total % 3 !== 2) return false;
  if (melds === 0 && isChiitoi(counts)) return true;
  if (melds === 0 && isKokushi(counts)) return true;
  return isStandardWin(counts, melds);
}

function isChiitoi(counts) {
  let pairs = 0;
  for (let t = 0; t < 34; t++) {
    if (counts[t] === 2) pairs++;
    else if (counts[t] !== 0) return false;
  }
  return pairs === 7;
}

function isKokushi(counts) {
  const terminals = [0,8,9,17,18,26,27,28,29,30,31,32,33];
  let pair = false;
  for (const t of terminals) {
    if (counts[t] === 0) return false;
    if (counts[t] >= 2) pair = true;
  }
  for (let t = 0; t < 34; t++) {
    if (!terminals.includes(t) && counts[t] > 0) return false;
  }
  return pair;
}

function isStandardWin(sourceCounts, melds = 0) {
  const neededMelds = 4 - melds;
  if (neededMelds < 0) return false;
  const counts = sourceCounts.slice();
  for (let pair = 0; pair < 34; pair++) {
    if (counts[pair] >= 2) {
      counts[pair] -= 2;
      if (canMakeMeldsCount(counts, neededMelds)) {
        counts[pair] += 2;
        return true;
      }
      counts[pair] += 2;
    }
  }
  return false;
}

function canMakeMeldsCount(counts, need) {
  if (need === 0) return counts.every(c => c === 0);
  let t = counts.findIndex(c => c > 0);
  if (t === -1) return need === 0;
  if (counts[t] >= 3) {
    counts[t] -= 3;
    if (canMakeMeldsCount(counts, need - 1)) {
      counts[t] += 3;
      return true;
    }
    counts[t] += 3;
  }
  if (!isHonor(t)) {
    const n = t % 9;
    if (n <= 6 && counts[t + 1] > 0 && counts[t + 2] > 0 && SUIT(t) === SUIT(t + 2)) {
      counts[t]--; counts[t + 1]--; counts[t + 2]--;
      if (canMakeMeldsCount(counts, need - 1)) {
        counts[t]++; counts[t + 1]++; counts[t + 2]++;
        return true;
      }
      counts[t]++; counts[t + 1]++; counts[t + 2]++;
    }
  }
  return false;
}

function canMakeMelds(counts) {
  return canMakeMeldsCount(counts, Math.floor(counts.reduce((a,b)=>a+b,0) / 3));
}

function countsFromHand(hand) {
  const counts = Array(34).fill(0);
  hand.forEach(t => counts[t]++);
  return counts;
}

function sortHand(hand) {
  hand.sort((a, b) => a - b);
}

function finishHand({ winner, from, type, tile }) {
  state.ended = true;
  state.locked = true;
  hideCallButtons();
  $('tsumoBtn').disabled = true;
  $('riichiBtn').disabled = true;
  $('ronBtn').classList.add('hidden');
  $('skipBtn').classList.add('hidden');
  const scoringHand = winner.hand.slice();
  if (type === 'ron' && scoringHand.length % 3 === 1 && tile != null) scoringHand.push(tile);
  const result = analyzeWin(scoringHand, type, tile, winner);
  const points = calculatePoints(result, type, winner, from);
  if (type === 'tsumo') {
    state.players.forEach(p => {
      if (p.index !== winner.index) p.score -= points.pay;
    });
    winner.score += points.pay * 3;
  } else {
    from.score -= points.pay;
    winner.score += points.pay;
  }
  const title = type === 'tsumo' ? 'ツモ' : 'ロン';
  const fromText = from ? ` / 放銃: ${from.name}` : '';
  log(`${winner.name} ${title}！ ${result.yaku.join('・')} / ${points.pay}点${fromText}`, true);
  $('centerMessage').textContent = `${winner.name}の${title}！ ${result.yaku.join('・')}`;
  renderAll();
  const winEvent = type === 'tsumo' ? 'tsumo' : 'ron';
  showCutin(winner, title, eventQuote(winner, winEvent), { kind: winEvent, duration: 2800 })
    .then(() => showResult(winner, title, result, points, from, tile));
}

function analyzeWin(hand, type, tile, winner, options = {}) {
  const closedCounts = countsFromHand(hand);
  const allTiles = allTilesOf({ ...winner, hand }, null);
  const allCounts = countsFromHand(allTiles);
  const yaku = [];
  let han = 0;
  const menzen = meldCount(winner) === 0;

  if (type === 'tsumo' && menzen) { yaku.push('門前清自摸和'); han += 1; }
  if (winner.riichi && menzen) { yaku.push('立直'); han += 1; }
  if (menzen && isChiitoi(closedCounts)) { yaku.push('七対子'); han += 2; }
  if (menzen && isKokushi(closedCounts)) { yaku.push('国士無双'); han += 13; }
  if (allTiles.length && allTiles.every(t => isSimple(t))) { yaku.push('断么九'); han += 1; }

  const yakuhai = yakuhaiCount(winner, allCounts);
  if (yakuhai > 0) { yaku.push(yakuhai > 1 ? `役牌${yakuhai}` : '役牌'); han += yakuhai; }

  if (isToitoi(winner, closedCounts)) { yaku.push('対々和'); han += 2; }
  const flush = flushYaku(allTiles);
  if (flush === 'chinitsu') { yaku.push('清一色'); han += menzen ? 6 : 5; }
  else if (flush === 'honitsu') { yaku.push('混一色'); han += menzen ? 3 : 2; }

  const hasRealYaku = yaku.length > 0;
  const doraCount = state.dora == null ? 0 : allCounts[state.dora];
  if (doraCount) { yaku.push(`ドラ${doraCount}`); han += doraCount; }
  if (!hasRealYaku && !options.preview) yaku.push('役なし（本来は和了不可）');
  const quote = han >= 5 ? '決まった。これは綺麗な終幕。' : null;
  return { yaku, han, quote, hasRealYaku };
}

function yakuhaiCount(player, allCounts) {
  let count = 0;
  [31, 32, 33].forEach(t => { if (allCounts[t] >= 3) count++; });
  const seatWindTile = 27 + player.index;
  const roundWindTile = 27; // 東1局のみ
  if (allCounts[seatWindTile] >= 3) count++;
  if (roundWindTile !== seatWindTile && allCounts[roundWindTile] >= 3) count++;
  return count;
}

function isYakuhaiTileFor(player, tile) {
  if ([31,32,33].includes(tile)) return true;
  return tile === 27 || tile === 27 + player.index;
}

function isToitoi(player, closedCounts) {
  if ((player.melds || []).some(m => m.type === 'chi')) return false;
  const counts = closedCounts.slice();
  for (let pair = 0; pair < 34; pair++) {
    if (counts[pair] >= 2) {
      counts[pair] -= 2;
      let ok = true;
      for (let t = 0; t < 34; t++) {
        if (counts[t] % 3 !== 0) { ok = false; break; }
      }
      counts[pair] += 2;
      if (ok) return true;
    }
  }
  return false;
}

function flushYaku(allTiles) {
  const suits = new Set(allTiles.filter(t => !isHonor(t)).map(SUIT));
  if (suits.size !== 1) return null;
  const hasHonor = allTiles.some(isHonor);
  return hasHonor ? 'honitsu' : 'chinitsu';
}

function calculatePoints(result, type, winner, from) {
  if (result.han >= 13) return { pay: type === 'tsumo' ? 8000 : 32000 };
  if (result.han >= 5) return { pay: type === 'tsumo' ? 4000 : 12000 };
  const base = 1000 + result.han * 1200 + (winner.riichi ? 600 : 0);
  return { pay: Math.ceil(base / 100) * 100 };
}

function exhaustiveDraw() {
  state.ended = true;
  state.locked = true;
  $('centerMessage').textContent = '流局。山が尽きた。';
  const tenpaiNames = state.players.filter(p => isTenpai(p.hand, meldCount(p))).map(p => p.name);
  log(tenpaiNames.length ? `流局。テンパイ: ${tenpaiNames.join('、')}` : '流局。誰も和了できなかった。', true);
  renderAll();
  showDrawResult(tenpaiNames);
}

function showDrawResult(tenpaiNames) {
  if (isMatchFinal()) {
    showFinalResult({ type: 'draw', tenpaiNames });
    return;
  }
  const el = $('resultOverlay');
  if (!el) return;
  const self = state.players[0] || characterById(selectedPlayer);
  const remaining = state.matchLength === Infinity || state.currentHand < state.matchLength;
  el.innerHTML = `
    <div class="result-card draw-result" style="--char-gradient:${self.color || 'linear-gradient(135deg,#1e2438,#30234c)'}">
      <div class="result-art">${cutinPortraitHtml(self, 'result-portrait')}</div>
      <div class="result-copy">
        <p class="eyebrow">RESULT / DRAW</p>
        <h2><span>${self.icon || '🀄'}</span>流局</h2>
        <p class="result-line">${escapeHtml(tenpaiNames.length ? `テンパイ：${tenpaiNames.join('、')}` : 'ノーテン')}</p>
        <blockquote>${escapeHtml(eventQuote(self, 'draw'))}</blockquote>
        <div class="result-actions">
          <button type="button" class="primary" data-result-action="restart">${remaining ? '次局へ' : '新しく対局'}</button>
          <button type="button" class="ghost" data-result-action="close">閉じる</button>
        </div>
      </div>
    </div>`;
  el.classList.remove('hidden');
  el.querySelector('[data-result-action="restart"]')?.addEventListener('click', () => {
    hideResult();
    remaining ? startGame(false) : startGame(true);
  });
  el.querySelector('[data-result-action="close"]')?.addEventListener('click', hideResult);
}


function renderAll() {
  renderSeats();
  renderRivers();
  renderHand();
  renderMeldArea();
  renderRound();
  renderGuide();
}

function renderSeats() {
  const map = [
    ['playerSouth', 0],
    ['playerWest', 1],
    ['playerNorth', 2],
    ['playerEast', 3]
  ];
  map.forEach(([id, idx]) => {
    const p = state.players[idx];
    if (!p) return;
    const el = $(id);
    el.style.setProperty('--char-gradient', p.color);
    const statusText = p.melds && p.melds.length ? `副露${p.melds.length}` : '門前';
    const riichiBadge = p.riichi ? `<span class="riichi-status" title="立直">${riichiStickHtml('riichi-status-stick')}</span>` : '';
    const meldButton = `<button type="button" class="meld-chip ${p.melds?.length ? '' : 'plain'} ${p.riichi ? 'riichi-on' : ''}" ${p.melds?.length ? `data-player-index="${idx}"` : 'disabled'}>${escapeHtml(statusText)}${riichiBadge}</button>`;
    const icon = avatarHtml(p, 'hud');
    const inlineHud = `
      <div class="seat-inner ${idx === 0 ? 'self-hud' : 'opponent-hud'} unified-hud compact-hud">
        ${icon}
        <div class="seat-name">${escapeHtml(p.wind)} ${escapeHtml(p.name)}</div>
        <div class="seat-score">${p.score.toLocaleString()}点</div>
        ${meldButton}
      </div>
    `;

    if (idx === 0) {
      el.innerHTML = `
        ${selfSeatPortraitHtml(p)}
        ${inlineHud}
      `;
    } else {
      el.innerHTML = inlineHud;
    }
  });
  bindMeldPeek();
}

function bindMeldPeek() {
  document.querySelectorAll('.meld-chip[data-player-index]').forEach(btn => {
    const idx = Number(btn.dataset.playerIndex);
    const show = (event) => showMeldPeek(idx, btn);
    const hide = () => hideMeldPeek();
    btn.addEventListener('mouseenter', show);
    btn.addEventListener('mouseleave', hide);
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      const peek = $('meldPeek');
      if (!peek.classList.contains('hidden') && peek.dataset.playerIndex === String(idx)) hideMeldPeek();
      else showMeldPeek(idx, btn);
    });
  });
}

function showMeldPeek(idx, anchor) {
  const p = state.players[idx];
  const peek = $('meldPeek');
  if (!peek || !p || !p.melds?.length) return;
  peek.dataset.playerIndex = String(idx);
  peek.innerHTML = `<div class="meld-peek-card"><div class="meld-peek-head">${escapeHtml(p.name)} / 副露${p.melds.length}</div><div class="meld-peek-body">${p.melds.map(meldHtml).join('')}</div></div>`;
  peek.classList.remove('hidden');
  const rect = anchor.getBoundingClientRect();
  const top = window.scrollY + rect.bottom + 8;
  let left = window.scrollX + rect.left;
  if (window.innerWidth <= 900) left = Math.max(12, window.scrollX + (window.innerWidth - Math.min(320, window.innerWidth - 24)) / 2);
  peek.style.top = `${top}px`;
  peek.style.left = `${left}px`;
}

function hideMeldPeek() {
  const peek = $('meldPeek');
  if (!peek) return;
  peek.classList.add('hidden');
  peek.innerHTML = '';
  delete peek.dataset.playerIndex;
}

document.addEventListener('click', (event) => {
  if (!event.target.closest('.meld-chip') && !event.target.closest('#meldPeek')) hideMeldPeek();
});

function selfSeatPortraitHtml(player) {
  const portrait = player.portrait || `assets/characters/${player.id}.png`;
  return `
    <div class="self-seat-portrait" aria-hidden="true">
      <span class="self-seat-portrait-fallback">${player.icon}</span>
      <img src="${portrait}" alt="" loading="eager" onload="this.parentElement.classList.add('image-loaded')" onerror="this.remove()">
    </div>
  `;
}

function opponentSeatPortraitHtml(player) {
  const portrait = player.portrait || `assets/characters/${player.id}.png`;
  return `
    <div class="seat-portrait" aria-hidden="true">
      <span class="seat-portrait-fallback">${player.icon}</span>
      <img src="${portrait}" alt="" loading="eager" onload="this.parentElement.classList.add('image-loaded')" onerror="this.remove()">
    </div>
  `;
}

function renderRivers() {
  state.players.forEach((p, idx) => {
    const river = $(`river${idx}`);
    river.innerHTML = p.discards.slice(-18).map(t => miniTileHtml(t)).join('');
  });
}

function renderHand() {
  const hand = $('hand');
  const player = state.players[0];
  if (!player) return;
  const guide = getDiscardGuide(player);
  const recommendedTile = guide?.best?.tile;
  hand.innerHTML = '';
  player.hand.forEach((tile, idx) => {
    const btn = document.createElement('button');
    const drawn = tile === player.lastDraw && idx === player.hand.lastIndexOf(player.lastDraw);
    const recommended = recommendedTile != null && tile === recommendedTile && state.current === 0 && !state.locked && !state.ended && player.hand.length % 3 === 2;
    const riichiCandidate = state.riichiPending && leavesTenpaiAfterDiscard(player.hand, idx);
    btn.className = `tile clickable ${tileClass(tile)} ${drawn ? 'drawn' : ''} ${recommended ? 'recommended' : ''} ${riichiCandidate ? 'riichi-candidate' : ''}`;
    btn.title = state.riichiPending
      ? (riichiCandidate ? `${TILE_TEXT[tile]}：これを切ると立直できる` : `${TILE_TEXT[tile]}：これを切るとテンパイが崩れる`)
      : (recommended ? `${TILE_TEXT[tile]}：おすすめ捨て牌` : TILE_TEXT[tile]);
    btn.innerHTML = tileImageHtml(tile);
    btn.disabled = state.current !== 0 || state.locked || state.ended || player.hand.length % 3 !== 2 || (state.riichiPending && !riichiCandidate);
    btn.addEventListener('click', async () => {
      if (btn.disabled) return;
      $('riichiBtn').disabled = true;
      $('tsumoBtn').disabled = true;
      await discardTile(player, idx);
    });
    hand.appendChild(btn);
  });
  if (state.current === 0 && !state.locked && !state.ended && player.hand.length % 3 === 2) {
    $('riichiBtn').disabled = !(canDeclareRiichi(player) && !player.riichi && player.score >= 1000);
  }
}



function renderMeldArea() {
  const area = $('meldArea');
  if (!area) return;
  const player = state.players[0];
  if (!player || !player.melds || !player.melds.length) {
    area.innerHTML = '';
    return;
  }
  area.innerHTML = player.melds.map(meldHtml).join('');
}

function meldHtml(meld) {
  const label = ({ chi: 'チー', pon: 'ポン', kan: 'カン', ankan: '暗槓', kakan: '加槓' }[meld.type]) || '副露';
  return `<span class="meld"><b>${label}</b>${meld.tiles.map(miniTileHtml).join('')}</span>`;
}

function getDiscardGuide(player) {
  if (!player || !player.isHuman) return null;
  if (state.screen !== 'game' || state.current !== 0 || state.locked || state.ended || player.hand.length % 3 !== 2) return null;

  const uniqueIndices = [];
  const seen = new Set();
  player.hand.forEach((tile, idx) => {
    if (!seen.has(tile)) {
      uniqueIndices.push(idx);
      seen.add(tile);
    }
  });

  const candidates = uniqueIndices.map(idx => {
    const tile = player.hand[idx];
    const after = player.hand.slice();
    after.splice(idx, 1);
    const score = evaluateDiscardChoice(after, tile, player, false, player.hand);
    return {
      idx,
      tile,
      after,
      score,
      ukeire: ukeireScore(after),
      safety: safetyLabel(tile),
      reasons: discardReasons(player.hand, after, tile, player)
    };
  }).sort((a, b) => b.score - a.score);

  const best = candidates[0];
  return {
    best,
    alternatives: candidates.slice(1, 3),
    yaku: suggestYaku(best ? best.after : player.hand, player),
    status: handStatus(best ? best.after : player.hand),
    riichiReady: best ? isTenpai(best.after, meldCount(player)) : false
  };
}

function renderGuide() {
  const body = $('guideBody');
  if (!body) return;
  const player = state.players[0];
  if (!player) {
    body.textContent = '手番になると、おすすめの捨て牌と狙えそうな役を表示するよ。';
    return;
  }
  if (state.ended) {
    body.innerHTML = '<p>局終了。もう一回やるなら「最初から」を押してね。</p>';
    return;
  }
  if (state.pendingRon) {
    body.innerHTML = `<div class="guide-main">ロンできる牌：${miniTileHtml(state.pendingRon.tile)}</div><p>初心者なら、まずはロンしてOK。点数より「和了する感覚」を掴むのが大事。</p>`;
    return;
  }
  if (state.pendingCall) {
    const humanChoice = state.pendingCall.choices.find(c => c.caller.isHuman);
    const opts = [];
    if (humanChoice?.options.chi.length) opts.push('チー：順子を作る。鳴くと立直不可。');
    if (humanChoice?.options.pon) opts.push('ポン：同じ牌3枚を作る。役牌なら初心者向け。');
    if (humanChoice?.options.kan) opts.push('カン：同じ牌4枚。派手だけどドラが増えるので少し危険。');
    body.innerHTML = `<div class="guide-main">鳴ける牌：${miniTileHtml(state.pendingCall.tile)}</div><ul class="guide-reasons">${opts.map(o => `<li>${escapeHtml(o)}</li>`).join('')}</ul><p class="guide-note">迷ったら見送ってOK。白・發・中・自風・場風のポンはかなり分かりやすいよ。</p>`;
    return;
  }
  const guide = getDiscardGuide(player);
  if (!guide || !guide.best) {
    const p = state.players[state.current];
    body.innerHTML = `<p>今は${escapeHtml(p ? p.name : '相手')}の手番。${escapeHtml(state.players[0]?.name || '自キャラ')}の番になったら、おすすめ捨て牌を光らせるね。</p>`;
    return;
  }

  const best = guide.best;
  const alternatives = guide.alternatives.map(c => `<span class="guide-chip">${miniTileHtml(c.tile)} ${escapeHtml(TILE_TEXT[c.tile])}</span>`).join('');
  const yaku = guide.yaku.map(y => `<span class="guide-chip accent-chip">${escapeHtml(y)}</span>`).join('');
  const reasons = best.reasons.map(r => `<li>${escapeHtml(r)}</li>`).join('');
  body.innerHTML = `
    <div class="guide-main">おすすめ捨て牌：<span class="guide-tile">${miniTileHtml(best.tile)} ${escapeHtml(TILE_TEXT[best.tile])}</span></div>
    <p class="guide-status">${escapeHtml(guide.status)} / 安全度：${escapeHtml(best.safety)}</p>
    <ul class="guide-reasons">${reasons}</ul>
    <div class="guide-block"><b>狙いやすい役</b><div class="guide-chips">${yaku || '<span class="guide-chip">まずは立直を目指す</span>'}</div></div>
    <div class="guide-block"><b>次点候補</b><div class="guide-chips">${alternatives || '<span class="guide-chip">なし</span>'}</div></div>
    <p class="guide-note">基本は、完成した順子・刻子や大事な対子は崩さない。役が分からなくなったら「役一覧」を開いてね。</p>
  `;
}

function discardReasons(before, after, tile, player) {
  const reasons = [];
  const countsBefore = countsFromHand(before);
  if (isTenpai(after, meldCount(player))) reasons.push(player.melds.length ? 'この一打でテンパイ。ただし鳴いているので、役があるか確認しよう。' : 'この一打でテンパイ。立直できる形を残せる。');
  if (countsBefore[tile] >= 3) reasons.push('注意：同じ牌が3枚揃っているので、本来はかなり残したい牌。ほかが全部もっと悪い時だけ切る。');
  else if (countsBefore[tile] === 2) reasons.push('注意：対子を崩す一打。七対子や役牌が見える時は慎重に。');
  if (isIsolated(tile, countsBefore)) reasons.push('周りとつながりにくい孤立牌なので整理しやすい。');
  if (isHonor(tile) && countsBefore[tile] === 1) reasons.push('字牌が1枚だけなら、序盤は切って手を進めやすい。');
  if (!isSimple(tile) && after.filter(isSimple).length >= 9) reasons.push('断么九を狙うなら、端牌・字牌を減らすのがわかりやすい。');
  if (tile === state.dora) reasons.push('ドラだけど、今の形では少し浮いている。高打点より形を優先。');
  if (safeTileScore(tile) >= 8) reasons.push('場に見えている枚数が多めで、比較的安全寄り。');
  if (!reasons.length) reasons.push('受け入れ枚数と手のまとまりを比べると、この牌がいちばん形を壊しにくい。');
  return reasons.slice(0, 3);
}

function isIsolated(tile, counts) {
  if (counts[tile] >= 2) return false;
  if (isHonor(tile)) return counts[tile] === 1;
  const base = SUIT(tile) * 9;
  const n = tile - base;
  for (const offset of [-2, -1, 1, 2]) {
    const x = n + offset;
    if (x >= 0 && x <= 8 && counts[base + x] > 0) return false;
  }
  return true;
}

function suggestYaku(hand13, player = null) {
  const counts = countsFromHand(hand13);
  const suggestions = [];
  const pairs = counts.filter(c => c >= 2).length;
  const simpleCount = hand13.filter(isSimple).length;
  const terminalHonorUnique = [0,8,9,17,18,26,27,28,29,30,31,32,33].filter(t => counts[t] > 0).length;
  if (player && player.melds && player.melds.length) {
    // 鳴き後は立直できない。役牌・断么九・混一色などを優先。
  } else if (isTenpai(hand13, player ? meldCount(player) : 0)) suggestions.push('立直');
  if (simpleCount >= 10) suggestions.push('断么九');
  if (pairs >= 4) suggestions.push('七対子');
  if (counts[31] >= 2 || counts[32] >= 2 || counts[33] >= 2 || (player && hand13.some(t => isYakuhaiTileFor(player, t)))) suggestions.push('役牌');
  if (terminalHonorUnique >= 8) suggestions.push('国士無双');
  if (state.dora != null && counts[state.dora] > 0) suggestions.push(`ドラ${counts[state.dora]}`);
  if (!suggestions.length) suggestions.push('メンツ手');
  return suggestions.slice(0, 4);
}

function handStatus(hand13) {
  if (isTenpai(hand13)) return 'テンパイ。次に当たり牌が来たら和了できる';
  const u = ukeireScore(hand13);
  if (u >= 34) return 'かなり伸びやすい形';
  if (u >= 22) return 'そこそこまとまっている形';
  if (u >= 12) return 'まだ育て中の形';
  return 'バラバラ気味。まず孤立牌を整理';
}

function safetyLabel(tile) {
  if (state.dora === tile) return '危険寄り（ドラ）';
  const visible = safeTileScore(tile);
  if (visible >= 12) return '高め';
  if (visible >= 6) return '中くらい';
  if (isHonor(tile)) return '低め（字牌の生牌に注意）';
  return 'ふつう';
}

function renderRound() {
  const suffix = state.matchLength === Infinity ? `${state.currentHand}局目` : `${state.currentHand}/${state.matchLength}局`;
  $('roundLabel').textContent = `東${state.round}局　${suffix}`;
  const p = state.players[state.current];
  $('turnLabel').textContent = p ? `${p.name}の手番` : '準備中';
  $('wallLabel').textContent = `山: ${state.wall.length}`;
  $('doraTile').innerHTML = state.dora == null ? '🀫' : tileImageHtml(state.dora);
  $('doraTile').className = `mini-tile ${state.dora != null ? tileClass(state.dora) : ''}`;
}

function tileLabel(tile) {
  return `${TILE_GLYPHS[tile]}${TILE_TEXT[tile]}`;
}

function tileImageHtml(tile) {
  const src = TILE_IMAGES[tile];
  const alt = TILE_TEXT[tile] || '';
  return src ? `<img class="tile-img" src="${src}" alt="${alt}" draggable="false">` : TILE_GLYPHS[tile];
}

function riichiStickHtml(extraClass = '') {
  const cls = extraClass ? ` ${extraClass}` : '';
  return `<img class="riichi-stick${cls}" src="assets/ui/riichi_stick.gif" alt="立直棒" draggable="false">`;
}

function miniTileHtml(tile) {
  return `<span class="mini-tile ${tileClass(tile)}" title="${TILE_TEXT[tile]}">${tileImageHtml(tile)}</span>`;
}

function tileClass(tile) {
  if (tile === 32) return 'green';
  if (tile === 33) return 'red dragon-red';
  if ((tile < 9) || (tile >= 18 && tile < 27)) return 'red';
  return '';
}

function log(message, important = false) {
  const el = $('log');
  const entry = document.createElement('div');
  entry.className = `log-entry ${important ? 'important' : ''}`;
  entry.textContent = message;
  el.prepend(entry);
}

// v42: 汎用/共通セリフを廃止。全イベントを各キャラ専用セリフのみでローテーション。
const CHARACTER_EVENT_LINES = {
  "minaho": {
    "start": [
      "よーし、いこ。めんどい計算はナビに丸投げする！",
      "今日のあたし、牌に愛される予定だから。たぶん。",
      "始めよ〜。勝てたらいっぱい褒めてもらうやつ！",
      "ん、対局開始。かわいい勝ち方したいな〜。"
    ],
    "tsumo": [
      "ツモ！ え、これ来たのえらくない？",
      "きたきた！ あたしのとこに来た！",
      "ツモです♡ ほら、雪みたいにすとんって来た。",
      "やった、引けた！ これ絶対気持ちいいやつ！"
    ],
    "ron": [
      "ロン♡ その牌、あたしのとこ来るやつだった。",
      "それ当たり〜！ 出してくれてありがとう！",
      "ロンですっ。今の、ちょっとかわいく決まった？",
      "はい捕まえた！ 逃がさないもんね。"
    ],
    "riichi": [
      "リーチ！ ここで待つの、ちょっとドキドキする。",
      "逃げない。あたし、ここで待ってる。",
      "立直〜。ねえねえ、これ強そうじゃない？",
      "通してみて？ あたしの雪、そこに置いとくから。"
    ],
    "chi": [
      "チーする！ 近道見つけた！",
      "これもらう〜。つながるの好き。",
      "チー。あたしの道、こっちにする。"
    ],
    "pon": [
      "ポン！ おそろい可愛い！",
      "それ欲しかったやつ！ ありがと！",
      "ポンする。揃うと安心するね。"
    ],
    "kan": [
      "カン！ 派手でかわいいから好き！",
      "えい、カン！ なんか強そう！",
      "カンする〜。場がきらきらした気がする。"
    ],
    "result": [
      "勝ったー！ ほめて、今すぐほめて！",
      "えへへ、あたしの勝ち。ちょっと楽しくなってきた。",
      "やったぁ。めんどいけど勝つと気持ちいいね。",
      "見た？ 今のあたし、けっこうえらかった。"
    ],
    "draw": [
      "流れちゃった。まあ、凍らせて保留ってことで。",
      "んむ……決まらなかった。次はちゃんと来てほしい。",
      "流局かぁ。あたしの牌、迷子になった？",
      "おしまいなら仕方ないね。次、雪で呼ぶ。"
    ],
    "final": [
      "終わったー！ 最後までできたあたし、えらい！",
      "総合結果出た？ 勝ってたら褒めて、負けても甘やかして。",
      "対局終了〜。あたしのこと、ちゃんと見てた？",
      "ふぅ……いっぱい打った。これはご褒美案件です。"
    ]
  },
  "akane": {
    "start": [
      "姫、準備できた？ 俺は最初から勝ちに行くけど。",
      "始めるか。変に手ぇ抜いたら、つまんねぇだろ。",
      "牌が揃ったな。さて、どこから燃やすか。",
      "南帆、見てろよ。勝つ時はちゃんと勝つ。"
    ],
    "tsumo": [
      "ツモ。悪いな、これは俺が引く流れだった。",
      "来たか。火の回りがいい日だな。",
      "自摸。ほら、ちゃんと燃えたろ？",
      "この一枚で決まりだ。姫、目ぇ逸らすなよ。"
    ],
    "ron": [
      "ロン。その牌、置いた瞬間に終わってたぞ。",
      "悪いな、そこはもう俺の火の中だ。",
      "はい、捕まえた。逃げ道なんか最初からねぇよ。",
      "ロン。綺麗に焼けたな、その一打。"
    ],
    "riichi": [
      "立直。ここから先は、俺の火の中だ。",
      "リーチだ。姫、ちゃんと見てろよ。",
      "待ちは決めた。逃げるなら今のうちじゃねぇ？",
      "ここで立直。燃え尽きるまで付き合えよ。"
    ],
    "chi": [
      "チー。細い道でも、通れりゃ十分だろ。",
      "それ貰うわ。火種は拾っとく。",
      "チーする。地味でも勝ち筋なら使う。"
    ],
    "pon": [
      "ポン。揃う時はちゃんと揃うんだよ。",
      "それ、俺の形だ。ありがとな。",
      "ポン。火力上げる準備はできた。"
    ],
    "kan": [
      "カン。少し派手に燃やすか。",
      "槓だ。場ごと熱くしてやるよ。",
      "カン。姫、今のは見栄えいいだろ？"
    ],
    "result": [
      "勝った。ほら、姫。ちゃんと見てただろ？",
      "俺の勝ち。まあ、こういう日もあるってこと。",
      "悪いな、火加減間違えなかっただけだ。",
      "終わり。ったく、南帆が見てると負けらんねぇな。"
    ],
    "draw": [
      "流局か。火種が残ったままってのも悪くねぇ。",
      "決まらなかったな。次で燃やし直す。",
      "流れたか。まあ、焦って焦がすよりマシだろ。",
      "ここは保留。姫、次いくぞ。"
    ],
    "final": [
      "対局終了。姫、最後までよく見てたな。",
      "総合でこうなったか。悪くない熱だった。",
      "終わりだ。勝ってても負けてても、姫が楽しんだなら十分だろ。",
      "お疲れ、南帆。次はもっと派手に燃やすか。"
    ]
  },
  "hin": {
    "start": [
      "南帆小姐，睇住啦。老師今日唔讓㗎。",
      "開局喇。唔好淨係笑，牌都要睇。",
      "今日教你一樣嘢，贏牌都係語言嚟㗎。",
      "好，開始。聲調錯可以改，牌打錯就痛啲。"
    ],
    "tsumo": [
      "自摸。你睇，財氣自己行埋嚟。",
      "嚟喇。呢隻牌好聽話。",
      "自摸呀，南帆小姐。記住呢個感覺。",
      "牌自己返嚟，老師冇呃你。"
    ],
    "ron": [
      "食糊。呢隻牌，你唔應該打出嚟㗎。",
      "胡喇。唔好咁望住我，係你自己送嚟。",
      "呢張係我等緊嘅。多謝晒。",
      "ロン？ 日本語で講都得，食糊就係食糊。"
    ],
    "riichi": [
      "立直。唔好走，聽我講完呢局。",
      "リーチ喇。等牌，都係一種耐性。",
      "聽牌。南帆小姐，呢個字要記住。",
      "等一等。財氣會自己敲門。"
    ],
    "chi": [
      "上。小小一步，都係路嚟㗎。",
      "呢張我要。順住行先會到。",
      "チー喇。唔好怕，老師帶路。"
    ],
    "pon": [
      "碰。乖，牌自己聽話。",
      "呢對要埋。好，齊啲喇。",
      "ポン。你睇，叫佢就嚟。"
    ],
    "kan": [
      "槓。場面大啲，先好玩。",
      "カン喇。唔使驚，老師識收尾。",
      "槓一槓，財路開一開。"
    ],
    "result": [
      "贏喇。南帆小姐，有冇學到呀？",
      "老師話過，今日唔讓。",
      "呢局我收低先。你下次再嚟。",
      "好牌好運，都要識用先得。"
    ],
    "draw": [
      "流局。未完嘅句子，下局再講。",
      "冇人食糊呀？咁就留返下次。",
      "牌山講到一半停咗。可惜喇。",
      "流咗。南帆小姐，呢啲都係練習。"
    ],
    "final": [
      "完場喇。今日功課係，返去再諗三手。",
      "總結果出咗。南帆小姐，唔好只係睇分數，要睇路。",
      "打完喇。老師今日教得好辛苦㗎。",
      "好，收工。下次你要贏返我，知冇？"
    ]
  },
  "yuk": {
    "start": [
      "始めようか。金も牌も、巡らせてこそ価値が出る。",
      "卓が開いたね。さて、どこに利を置こうかな。",
      "配牌確認。無駄を削れば、勝ちは寄ってくるよ。",
      "いい場だ。今日は少し大きく動かそう。"
    ],
    "tsumo": [
      "ツモ。回した分だけ返ってきたね。",
      "引けた。投資としては悪くない結果だ。",
      "自摸だよ。牌も金も、戻り先を知ってる。",
      "ここで来るか。うん、いい利回りだ。"
    ],
    "ron": [
      "ロン。その一枚、僕の口座に入れておくね。",
      "それは支払い確定。ありがとう。",
      "ロンだよ。損切り、少し遅かったね。",
      "その牌はもう回収対象だったんだ。"
    ],
    "riichi": [
      "リーチ。ここに賭ける価値はある。",
      "立直。利は待つ者に来る。",
      "ここで固定する。あとは回収だ。",
      "勝負金は置いた。さあ、誰が払う？"
    ],
    "chi": [
      "チー。小さな利でも積めば道になる。",
      "それ、流れに組み込むよ。",
      "チーだ。資金繰りみたいなものさ。"
    ],
    "pon": [
      "ポン。対子は寝かせず動かす。",
      "それは僕が持つべき形だね。",
      "ポンするよ。価値が揃った。"
    ],
    "kan": [
      "カン。大きく動かすなら今だ。",
      "槓だ。リスク込みで取りに行く。",
      "カンするよ。場の相場を変えよう。"
    ],
    "result": [
      "勝ち。利確は早すぎても遅すぎても駄目なんだ。",
      "僕の取り分だね。綺麗に回収できた。",
      "終局。数字は嘘をつかないよ。",
      "うん、いい卓だった。まだ伸ばせるけどね。"
    ],
    "draw": [
      "流局か。未回収のまま帳簿に残ったね。",
      "決済できなかった。次で取り戻そう。",
      "場が閉じたか。損も得も、まだ眠ってる。",
      "流れたね。こういう保留も計算に入れる。"
    ],
    "final": [
      "総合結果だね。数字に残る勝負は好きだよ。",
      "対局終了。収支を見れば、性格まで出る。",
      "終わったね。次はもっと大きく回そう。",
      "さて、決算だ。南帆ちゃん、どこが伸びたか見てみようか。"
    ]
  },
  "yao": {
    "start": [
      "始めよっか。焦らなくていいよ、いい縁はちゃんと来るから。",
      "卓の空気、悪くないね。ゆっくり結んでいこ。",
      "南帆ちゃん、今日は牌とのご縁を見せてもらうね。",
      "開局だよ。無理に追わなくても、来る子は来るよ。"
    ],
    "tsumo": [
      "ツモ。ほらね、ちゃんと会いに来てくれた。",
      "来たよ。縁がほどけなかったみたい。",
      "自摸だね。優しく待つと、牌も寄ってくるの。",
      "この子、ここに来たかったんだと思う。"
    ],
    "ron": [
      "ロン。それ、私と結ばれてた牌だよ。",
      "ごめんね、そのご縁はこっちだった。",
      "ロンだよ。今の一打、すごく近かったね。",
      "その牌、私のところでほどけたみたい。"
    ],
    "riichi": [
      "立直。ここで待てば、きっと会える。",
      "リーチ。縁が来るまで動かないよ。",
      "ここで待つね。いい牌、来てくれるから。",
      "焦らないで待つよ。結び目はもう作った。"
    ],
    "chi": [
      "チー。細い縁だけど、大事にするね。",
      "それ、つなげてもいい？",
      "チーだよ。道が少し優しくなった。"
    ],
    "pon": [
      "ポン。同じ気配の子、集まってきたね。",
      "それ、こっちに来たがってる。",
      "ポンするね。結び目が増えたよ。"
    ],
    "kan": [
      "カン。少しだけ、大きな縁にしてみる。",
      "槓だよ。ほどけないように結び直すね。",
      "カンするね。場の糸、張り替えるよ。"
    ],
    "result": [
      "勝てたね。やっぱり今日の縁、強かった。",
      "私の勝ち。南帆ちゃん、ちゃんと見えてた？",
      "終わりだよ。いい結び方ができたと思う。",
      "ふふ、無理しない勝ち方もあるんだよ。"
    ],
    "draw": [
      "流局だね。結べなかった縁も、次に回るよ。",
      "ほどけちゃった。次はもう少しそばにいてくれるかな。",
      "場が閉じたね。残った糸は覚えておく。",
      "流れたけど、悪い巡りじゃなかったよ。"
    ],
    "final": [
      "おしまい。南帆ちゃん、最後までよく結べてたね。",
      "総合結果だよ。勝ち負けのあとにも縁は残るの。",
      "対局終了。次に会う牌は、また違う顔をしてるよ。",
      "ふふ、お疲れさま。今日の卓、ちゃんと綺麗だった。"
    ]
  },
  "haruka": {
    "start": [
      "始めよう。焦らなくていい、君は君のままで見ていて。",
      "対局開始だね。僕は静かに進めるよ。",
      "南帆、近くにいて。牌の流れだけ見ていればいい。",
      "準備はできた。余計なことはしない。勝ち筋だけを見る。"
    ],
    "tsumo": [
      "ツモ。……うん、来ると思ってた。",
      "引いたよ。君の前で崩れなくてよかった。",
      "自摸。静かに待った甲斐があったね。",
      "これで決まる。南帆、見ていて。"
    ],
    "ron": [
      "ロン。それは通さない。",
      "その牌、僕が待ってた。逃がさないよ。",
      "ロン。……君の視線があるなら、外せない。",
      "終わりだよ。もう僕の手の中にある。"
    ],
    "riichi": [
      "立直。ここからは僕の待ち時間。",
      "リーチ。南帆、僕だけ見てて。",
      "待ちは決めた。あとは来るだけ。",
      "逃げ道は少しずつ塞いでおいたよ。"
    ],
    "chi": [
      "チー。必要なところだけ繋ぐ。",
      "その牌、使わせてもらうね。",
      "チーだよ。静かに形を寄せる。"
    ],
    "pon": [
      "ポン。ここは揃えておく。",
      "それは僕の形に必要だ。",
      "ポンするよ。もう少し近づく。"
    ],
    "kan": [
      "カン。場が動いても、僕は見失わない。",
      "槓だよ。揺れは抑える。",
      "カンする。南帆、少しだけ音が大きいよ。"
    ],
    "result": [
      "勝ったよ。……君が見ていてくれたから。",
      "僕の勝ち。安心して、ちゃんと終わらせた。",
      "終局だね。君の前で負けたくなかっただけ。",
      "南帆、こっちを見て。結果は出たよ。"
    ],
    "draw": [
      "流局。まだ終わらせる時じゃなかっただけ。",
      "決まらなかったね。僕は覚えてるから大丈夫。",
      "山が尽きた。次はもう少し深く読む。",
      "流れたよ。君は何も心配しなくていい。"
    ],
    "final": [
      "対局終了。南帆、疲れてない？",
      "総合結果だね。君が最後まで見ていたことの方が大事だよ。",
      "終わった。次も、君の隣で打つ。",
      "お疲れさま。帰ったら温かい飲み物を用意するよ。"
    ]
  },
  "masumi": {
    "start": [
      "幕を開けよう。最後まで俺を見ていて。",
      "対局開始だ。南帆、今日はどんな顔を見せてくれる？",
      "照明は落ちた。ここから先は、俺の台本だ。",
      "始めようか。君の視線があるなら、退屈にはしない。"
    ],
    "tsumo": [
      "ツモ。いいタイミングで主役が来たね。",
      "来たよ。この一枚で場面が変わる。",
      "自摸だ。綺麗な入り方をしてくれる。",
      "ほら、結末が俺の手に降りてきた。"
    ],
    "ron": [
      "ロン。その牌、俺の舞台袖で待ってた。",
      "それは俺の台詞だよ。置いた時点で幕が下りる。",
      "ロン。君の一打、すごく綺麗に墜ちたね。",
      "終演だ。今の音、忘れないで。"
    ],
    "riichi": [
      "立直。ここから先は俺の演出。",
      "リーチ。待つ時間も舞台の一部だ。",
      "逃げないで。結末はもう決めてある。",
      "ここで宣言する。視線を外さないで。"
    ],
    "chi": [
      "チー。足りない場面を繋ぐよ。",
      "その牌、俺の台本に入れる。",
      "チーだ。流れを少しだけ書き換える。"
    ],
    "pon": [
      "ポン。役者が揃ってきたね。",
      "それ、俺の舞台に必要なんだ。",
      "ポンするよ。配置は悪くない。"
    ],
    "kan": [
      "カン。ここで照明を強くしようか。",
      "槓だ。派手な転換も嫌いじゃない。",
      "カンする。観客の目が欲しい場面だ。"
    ],
    "result": [
      "俺の勝ち。ねえ、ちゃんと焼きついた？",
      "終演だよ。拍手は南帆からだけでいい。",
      "勝った。君の表情まで含めて、いい場面だった。",
      "幕が下りたね。俺はまだ余韻に浸ってる。"
    ],
    "draw": [
      "流局か。未完成の芝居も、時には美しい。",
      "幕が下りきらなかったね。続きを書き直そう。",
      "決着なし。なら、この緊張だけ持ち帰るよ。",
      "流れたね。君の顔、もう少し見たかったな。"
    ],
    "final": [
      "対局終了。南帆、俺の物語に最後までいてくれたね。",
      "総合結果だ。勝敗より、君の記憶に残ったかが問題だよ。",
      "終わった。次の幕も、俺が用意する。",
      "お疲れさま。ねえ、今夜の俺は何点だった？"
    ]
  },
  "aoi": {
    "start": [
      "行くぞコラ！ 細けぇことは打ちながら考える！",
      "対局開始だ！ オレの勢い、見とけよ！",
      "よっしゃ、始めるぞ。妹、ちゃんと見てろ！",
      "牌なんざ気合いで寄せる！ いくぞ！"
    ],
    "tsumo": [
      "ツモ！ ほら来た！ オレの勝ち筋！",
      "引いたぞコラ！ 勢い舐めんな！",
      "自摸だ！ こういうのは押した方が来るんだよ！",
      "っしゃあ！ この一枚で決める！"
    ],
    "ron": [
      "ロン！ それオレのだ、置いてったな！",
      "捕まえた！ 逃げられると思ったかよ！",
      "ロンだコラ！ 今のは読めてた！ たぶん！",
      "その牌アウト！ オレの勝ちだ！"
    ],
    "riichi": [
      "リーチ！ 逃げんなよ、ここからだ！",
      "立直！ 待つの苦手だけど待つ！",
      "ここで勝負だ！ オレの気合い見せてやる！",
      "リーチだコラ！ 来るまで睨んどく！"
    ],
    "chi": [
      "チー！ 道が見えたら突っ込む！",
      "それ貰う！ つながりゃ勝ちだ！",
      "チーだ！ 迷ってる暇ねぇ！"
    ],
    "pon": [
      "ポン！ 揃ったなら殴れる！",
      "それ寄こせ！ オレの形だ！",
      "ポンだコラ！ 勢いついてきた！"
    ],
    "kan": [
      "カン！ 派手に行こうぜ！",
      "槓だ！ 場ごとぶっ壊してやる！",
      "カンする！ ビビってんじゃねぇぞ！"
    ],
    "result": [
      "勝ったぞ！ ほら、妹、見たか！",
      "オレの勝ち！ 気合いは牌にも効く！",
      "っしゃあ！ 細けぇ理屈より結果だろ！",
      "どうだコラ！ これが直感ってやつだ！"
    ],
    "draw": [
      "流局ぅ？ まだ殴り足りねぇんだけど！",
      "決まんなかったか。次はもっと押す！",
      "山切れかよ！ いいとこだったろ！",
      "流れたな。しゃーねぇ、次で取り返す！"
    ],
    "final": [
      "終わったな！ 妹、ちゃんと楽しんだか？",
      "総合結果だ！ 勝ってても負けてても次やるぞ！",
      "対局終了！ オレはまだ打てる！",
      "お疲れ！ 水飲んで、もっかい行くぞ！"
    ]
  },
  "renya": {
    "start": [
      "ほな、始めよか。風向きは悪ないで。",
      "焦らんでええよ。牌はちゃんと喋っとる。",
      "開局やね。南帆ちゃん、気楽に見とき。",
      "風が回り始めたわ。さて、どこへ流れるかな。"
    ],
    "tsumo": [
      "ツモや。ええ風が戻ってきた。",
      "来たなぁ。この一枚、よう喋るわ。",
      "自摸。風の便りは嘘つかへんね。",
      "ほら、待ってた声が届いたで。"
    ],
    "ron": [
      "ロンや。その言葉、聞き逃さんかったで。",
      "それは通らへん。風がこっちへ運んできた。",
      "ロン。今の一打、響きすぎや。",
      "捕まえたで。逃げる音まで聞こえてた。"
    ],
    "riichi": [
      "立直。ここで待つんが一番ええ。",
      "リーチや。風が戻るまで待と。",
      "ここから動かん。来る場所は決まっとる。",
      "南帆ちゃん、見とき。声が集まってくる。"
    ],
    "chi": [
      "チーや。言葉を一つ繋げるで。",
      "それ貰うわ。風道が通った。",
      "チー。こういう細い道、嫌いやないねん。"
    ],
    "pon": [
      "ポン。重なった声は強いで。",
      "それ、こっちに響いとる。",
      "ポンや。音が揃ったな。"
    ],
    "kan": [
      "カン。風向き、ちょい変えるわ。",
      "槓や。大きい音立つけど堪忍な。",
      "カンするで。場の空気、入れ替えよか。"
    ],
    "result": [
      "勝ちやね。風を読むのも仕事やし。",
      "終わったで。南帆ちゃん、今の流れ見えた？",
      "俺の勝ち。まあ、風が味方しただけや。",
      "ええ終わり方やったな。余韻が残るわ。"
    ],
    "draw": [
      "流局やね。風が結論を運ばんかった。",
      "決まらへんかったか。次の便りを待と。",
      "山が黙ってもうたな。しゃあない。",
      "流れたなぁ。まだ言葉が足りんかったわ。"
    ],
    "final": [
      "対局終了や。南帆ちゃん、よう頑張ったな。",
      "総合結果か。風の跡がちゃんと残っとる。",
      "終わりやね。次は別の風が吹くで。",
      "お疲れさん。今日はええ声が聞けたわ。"
    ]
  },
  "itsuki": {
    "start": [
      "では、始めましょう。場の理はすでに整っています。",
      "おや、よい配牌ですね。観測を始めます。",
      "焦らず参りましょう。結論は牌が示します。",
      "この卓にも法則はあります。見落とさないことです。"
    ],
    "tsumo": [
      "自摸です。理に適った到着ですね。",
      "来ましたね。無駄のない巡りです。",
      "自摸です。結論としては自然でしょう。",
      "この牌がここへ来るのは、少々美しいですね。"
    ],
    "ron": [
      "ロンです。その一打は定義済みでした。",
      "それは通りません。私の待ちです。",
      "ロンです。境界を越えましたね。",
      "その牌で閉じましょう。ご苦労さまでした。"
    ],
    "riichi": [
      "立直です。以後、この待ちを固定します。",
      "ここで立直といたしましょう。",
      "待ちは定まりました。あとは観測のみです。",
      "立直です。手順として問題ありません。"
    ],
    "chi": [
      "チーです。必要な接続ですので。",
      "それはいただきます。形が整います。",
      "チーです。道筋を補正しましょう。"
    ],
    "pon": [
      "ポンです。対子の定義を利用します。",
      "それは私の形に入ります。",
      "ポンです。場の構造が少し変わりますね。"
    ],
    "kan": [
      "カンです。反動は抑えます。",
      "槓いたします。場の定義を更新しましょう。",
      "カンです。少々騒がしくなりますね。"
    ],
    "result": [
      "私の勝ちです。理に適っていましたね。",
      "終局です。妥当な結果でしょう。",
      "結論は出ました。美しい手順でした。",
      "おや、勝ってしまいましたか。予定調和ですね。"
    ],
    "draw": [
      "流局です。観測結果は保留ですね。",
      "山が尽きましたか。結論は未確定です。",
      "未確定のまま閉じました。珍しくはありません。",
      "流れましたね。これもまた理です。"
    ],
    "final": [
      "対局終了です。総合結果をご確認ください。",
      "最終結果です。手順の差がそのまま残りましたね。",
      "終わりました。なかなか興味深い卓でした。",
      "結論は保存しました。南帆、よく見ていましたね。"
    ]
  },
  "miko": {
    "start": [
      "始めましょうか。波を荒らさず、静かに参ります。",
      "対局開始ですね。優しく流れを見ていきます。",
      "ふふ、良い卓です。水面の揺れが綺麗ですね。",
      "焦らず行きましょう。深いところほど静かですから。"
    ],
    "tsumo": [
      "ツモです。波がそっと運んでくれました。",
      "来ましたね。水面に映る月みたいです。",
      "自摸です。静かな流れほどよく届きます。",
      "この一枚、綺麗に手元へ戻りました。"
    ],
    "ron": [
      "ロンです。その波紋はこちらへ届きました。",
      "それは私の待ちです。すみません、通せません。",
      "ロン。水面に触れた瞬間、見えました。",
      "その一打、優しく受け止めますね。"
    ],
    "riichi": [
      "立直です。静かに待てば、きっと届きます。",
      "リーチ。波が戻るまで待ちましょう。",
      "ここで待ちます。焦らなくても大丈夫。",
      "立直。水面を揺らさずに。"
    ],
    "chi": [
      "チーです。流れを少し整えますね。",
      "それ、繋がせてください。",
      "チー。細い水路を作ります。"
    ],
    "pon": [
      "ポンです。音が重なりましたね。",
      "それは私の波に合います。",
      "ポン。形が穏やかになりました。"
    ],
    "kan": [
      "カンです。波が大きくなりますよ。",
      "槓いたします。少しだけ潮目を変えます。",
      "カン。深いところを開きましょう。"
    ],
    "result": [
      "勝てました。荒らさず終われてよかったです。",
      "私の勝ちですね。穏やかな流れでした。",
      "終局です。水面に綺麗な跡が残りました。",
      "ふふ、静かな勝ちも悪くないでしょう？"
    ],
    "draw": [
      "流局ですね。波が岸へ届きませんでした。",
      "決まりませんでしたか。少し潮待ちですね。",
      "山が尽きましたね。次の満ち潮を待ちましょう。",
      "流れました。穏やかな保留、ということで。"
    ],
    "final": [
      "対局終了です。お疲れさまでした、南帆さん。",
      "総合結果ですね。波の重なりが数字になりました。",
      "終わりました。心地よい卓でしたね。",
      "ふふ、次も静かに遊びましょう。"
    ]
  },
  "shion": {
    "start": [
      "始めますわ。巡りの針は、私が見ています。",
      "対局開始ですわね。時の癖を読ませていただくわ。",
      "よろしくてよ。どの未来が残るか、試しましょう。",
      "卓が動きますわ。遅れる者から置いていかれます。"
    ],
    "tsumo": [
      "ツモですわ。ほら、来る時刻でしたもの。",
      "来ましたわね。秒針は嘘をつきません。",
      "自摸。選ばれた未来はこれですわ。",
      "この一枚、予定より少し早い到着ですわね。"
    ],
    "ron": [
      "ロンですわ。その時刻はもう過ぎました。",
      "それは私の待ち。戻る猶予はありませんわ。",
      "ロン。未来を読み違えましたわね。",
      "その一打で時は閉じます。おしまいですわ。"
    ],
    "riichi": [
      "立直。秒針はもう戻りません。",
      "リーチですわ。ここから未来を縛ります。",
      "待つのも支配のひとつですわ。",
      "立直。逃げ道は時間の外へ置きました。"
    ],
    "chi": [
      "チーですわ。時系列を整えます。",
      "それ、私の巡りに入れますわ。",
      "チー。遅れた流れを繋ぎ直します。"
    ],
    "pon": [
      "ポンですわ。重なる瞬間は美しいもの。",
      "その対子、私が揃えます。",
      "ポン。時の拍が合いましたわ。"
    ],
    "kan": [
      "カンですわ。針を少し進めましょう。",
      "槓。未来が荒れますが、面白いでしょう？",
      "カンですわ。時間ごと場を揺らします。"
    ],
    "result": [
      "私の勝ちですわ。必然を拾っただけです。",
      "終局。ふふ、良い時間でしたわ。",
      "勝敗は刻まれました。巻き戻しはなしですわよ。",
      "よろしくてよ。この結果なら退屈しません。"
    ],
    "draw": [
      "流局ですわ。時が結論を拒みました。",
      "決まらなかったのね。針を次へ進めますわ。",
      "山が尽きましたか。停滞もまた周期ですわ。",
      "流れましたわ。未確定の未来として保存しましょう。"
    ],
    "final": [
      "対局終了ですわ。最終時刻を確認なさい。",
      "総合結果ですわね。積み重ねた秒の差が出ましたわ。",
      "終わりましたわ。南帆さん、よく最後まで追いましたね。",
      "ふふ、次の巡りでは何を選ぶのかしら。"
    ]
  },
  "maximilien": {
    "start": [
      "始めよう。牌を雑に扱う者は、血統も雑に扱う。",
      "開局だ。無作法な一打は控えたまえ。",
      "よかろう。卓上にも品位というものがある。",
      "始める。君たちの選別を見届けよう。"
    ],
    "tsumo": [
      "自摸。然るべき牌が然るべき手に来たに過ぎん。",
      "来たか。美しい系譜だ。",
      "ツモだ。偶然と呼ぶには、いささか整いすぎている。",
      "この一枚は私の手元にあるべきだった。"
    ],
    "ron": [
      "ロン。──愚かだな、その牌を通すとは。",
      "それは私の待ちだ。無粋な終わり方だな。",
      "ロンだ。君の判断は、保存に値しない。",
      "その一打で終わりだ。品位を欠いた代償だよ。"
    ],
    "riichi": [
      "立直。逃げ道など最初から用意していない。",
      "リーチだ。待つことも貴族の嗜みだ。",
      "ここで宣言する。以後、無駄な抵抗は不要だ。",
      "立直。結末は品よく訪れる。"
    ],
    "chi": [
      "チーだ。必要な系譜を繋ぐ。",
      "その牌は私の列に加えよう。",
      "チー。無秩序よりは幾分ましだ。"
    ],
    "pon": [
      "ポン。揃うべきものが揃った。",
      "その対子は私の管理下に置く。",
      "ポンだ。形には血筋がある。"
    ],
    "kan": [
      "カン。少々大仰だが、悪くない。",
      "槓だ。場の格を上げよう。",
      "カン。無粋な者ほど、この音に怯える。"
    ],
    "result": [
      "私の勝ちだ。結果として当然であろう。",
      "終局だ。君たちの不足は明白だった。",
      "勝敗は保存された。美しい形でな。",
      "この卓では私が上位だった。それだけの話だ。"
    ],
    "draw": [
      "流局か。結論を出すに値しない場だったな。",
      "山が尽きた。美の完成には至らなかった。",
      "保留だ。未完成品として記録しよう。",
      "決着なし。無粋だが、時にはある。"
    ],
    "final": [
      "対局終了だ。総合結果を静かに受け入れたまえ。",
      "終わったな。品位ある勝敗なら、見る価値はある。",
      "最終結果だ。血統ではなく、手順が露呈したな。",
      "よろしい。君たちの卓上での価値は把握した。"
    ]
  },
  "lucien": {
    "start": [
      "始めよっか。ねえ、どの牌が一番甘いかなぁ。",
      "開局だね！ 侯爵様、ボク頑張るよ。",
      "あは、楽しそう。君の手、震えるかな？",
      "さあ遊ぼ。痛くしないとは言ってないけど。"
    ],
    "tsumo": [
      "ツモ！ ほら、甘いの来た！",
      "来ちゃった。ボクのところに来たかったんだね。",
      "自摸だよ。噛みつきたくなるくらい綺麗。",
      "あははっ、この一枚すっごくいい匂い。"
    ],
    "ron": [
      "ロン！ それ、ボクが欲しかったやつ！",
      "捕まえたぁ。君、今の顔すごくいいよ。",
      "それ当たり。ねえ、もう一回その顔して？",
      "ロンだよ。痛い？ でも綺麗だね。"
    ],
    "riichi": [
      "リーチ！ 待つのも狩りみたいで楽しい！",
      "ここで待ってるね。逃げたら追うよ？",
      "立直！ 早く来て、ねえ早く！",
      "待ってる間に、お腹すいちゃうなぁ。"
    ],
    "chi": [
      "チー！ これで追いかけやすくなったね。",
      "それちょうだい。ボクの道にする。",
      "チーだよ。足音が近くなった。"
    ],
    "pon": [
      "ポン！ 同じ匂いがする！",
      "それ、ボクの群れに入れるね。",
      "ポンだよ。揃うと嬉しくて笑っちゃう。"
    ],
    "kan": [
      "カン！ 大きい音、好き！",
      "槓だよ。びっくりした？ したよね？",
      "カンしちゃう。もっと場を騒がせよ。"
    ],
    "result": [
      "ボクの勝ち！ 侯爵様、褒めてくれるかな。",
      "終わり！ 君の困った顔、ちゃんと覚えたよ。",
      "勝っちゃった。ねえ、もう一回遊ぼ？",
      "あはは、甘かったね。ぜーんぶ飲みたいくらい。"
    ],
    "draw": [
      "流れちゃった。えー、まだ噛んでないのに。",
      "決まらなかったね。つまんない、でも次がある。",
      "山、なくなっちゃった。もっと遊びたかったな。",
      "流局？ じゃあ獲物は次までお預けだね。"
    ],
    "final": [
      "終わったね！ ボク、ちゃんといい子だった？",
      "総合結果だよ。侯爵様に見せてもいい？",
      "対局終了！ ねえねえ、次はもっと甘い卓にしよ。",
      "あは、楽しかった。君の最後の顔、覚えておくね。"
    ]
  },
  "kaya": {
    "start": [
      "始めましょう。迷う顔を見せてくれる？",
      "開局ね。雷は落ちる場所をもう探しているわ。",
      "南帆ちゃん、よく見ていて。綺麗に痺れさせてあげる。",
      "さあ、卓を照らしましょうか。暗いところまで。"
    ],
    "tsumo": [
      "ツモ。ほら、雷は私に落ちたわ。",
      "来たわね。痺れるほど良い牌。",
      "自摸よ。光った場所が正解だったの。",
      "この一枚、綺麗に焦げる音がするわ。"
    ],
    "ron": [
      "ロン。そこ、雷が落ちる場所よ。",
      "それは私の待ち。震えた？",
      "ロンよ。綺麗な悲鳴みたいな一打ね。",
      "その牌、逃がすと思った？"
    ],
    "riichi": [
      "立直。逃げ道に雷を落としておいたわ。",
      "リーチ。さあ、どこへ逃げる？",
      "ここで待つわ。怖がってもいいのよ。",
      "立直。次に光った場所が終点。"
    ],
    "chi": [
      "チー。細い線にも電流は走るの。",
      "それ、私の回路に入れるわ。",
      "チーよ。導線ができたわね。"
    ],
    "pon": [
      "ポン。同じ音が重なると綺麗ね。",
      "それ、こちらに寄越しなさい。",
      "ポンよ。火花が増えたわ。"
    ],
    "kan": [
      "カン。雷鳴は大きい方がいいでしょう？",
      "槓よ。卓ごと痺れさせるわ。",
      "カン。眩しくても目を逸らさないで。"
    ],
    "result": [
      "私の勝ち。ねえ、今の迷い方、綺麗だったわ。",
      "終わりよ。焦げ跡まで可愛いじゃない。",
      "勝ったわ。南帆ちゃん、ちゃんと痺れた？",
      "ふふ、雷に選ばれたのは私だったみたい。"
    ],
    "draw": [
      "流局ね。落ちきらない雷も悪くないわ。",
      "決まらなかったわ。余熱だけ残しておきましょう。",
      "山が尽きたのね。次はもっと明るく照らすわ。",
      "流れたわ。恐怖は持ち越しね。"
    ],
    "final": [
      "対局終了。最後までよく耐えたわね。",
      "総合結果よ。どこで痺れたか、覚えてる？",
      "終わりね。南帆ちゃんの反応、なかなか良かったわ。",
      "ふふ、次はもっと深いところまで雷を入れてあげる。"
    ]
  },
  "takuma": {
    "start": [
      "始めようか。焦らなくていいよ、崩れるところは見えるから。",
      "開局だね。煙草一本ぶんくらい、ゆっくり見よう。",
      "牌も人も、無理に隠すと余計に漏れるんだよ。",
      "始めるよ。君の癖、また少し見せて。"
    ],
    "tsumo": [
      "ツモ。ほら、欲しいものは黙ってても来る。",
      "引けたね。こういう小さい綻び、好きだよ。",
      "自摸。思ったより素直な山だった。",
      "この一枚、いいね。煙みたいに手元へ来た。"
    ],
    "ron": [
      "ロン。それ、出すと思ってた。",
      "今の牌、君らしくて見やすかったよ。",
      "ロン。隠したつもりでも、ちゃんと漏れてる。",
      "それで終わり。焦った顔、懐かしいね。"
    ],
    "riichi": [
      "リーチ。ここで待たれるの、嫌だろ？",
      "立直。少し焦ってくれる？",
      "待つよ。逃げ場を探す顔が見たいし。",
      "リーチ。さあ、どこを切る？"
    ],
    "chi": [
      "チー。小さい綻びから入るよ。",
      "それ、繋げておく。逃げ道っぽいから。",
      "チーだね。近道は嫌いじゃない。"
    ],
    "pon": [
      "ポン。同じものが重なると、嘘が薄くなる。",
      "それ、こっちに置いて。見やすくなるから。",
      "ポンするよ。形がだいぶ正直になった。"
    ],
    "kan": [
      "カン。場が揺れると、本音が出るんだ。",
      "槓だよ。ちょっと煙を濃くしようか。",
      "カン。隠してるもの、見えやすくなるよ。"
    ],
    "result": [
      "勝ったよ。君が崩れる瞬間、よく見えた。",
      "終わり。無理しない方が傷は浅かったのに。",
      "俺の勝ち。ほら、そんな顔しないで。",
      "結果出たね。思ったより素直だったよ。"
    ],
    "draw": [
      "流局か。崩れそうで崩れないのも悪くないね。",
      "決まらなかったね。煙だけ残った。",
      "山が尽きた。じゃあ、続きは次の一本で。",
      "流れたよ。隠し事はまだ残ってるみたい。"
    ],
    "final": [
      "対局終了。最後まで見てると、いろいろ分かるね。",
      "総合結果だよ。君の癖、ちゃんと数字に出てる。",
      "終わったね。煙草吸いたくなる卓だった。",
      "南帆、疲れた？ まあ、そういう顔も見覚えあるよ。"
    ]
  },
  "shinobu": {
    "start": [
      "始めましょう。貴女の一打、すべて記録します。",
      "開局ですねぇ。震えも迷いも、頁に残しますよ。",
      "対局開始です。美しい失敗なら歓迎いたします。",
      "では観察を。牌より先に、表情が語りますから。"
    ],
    "tsumo": [
      "自摸です。良い記録が取れました。",
      "来ましたねぇ。偶然のふりが上手い牌です。",
      "ツモです。この巡り、朱を入れておきましょう。",
      "ふふ、手元へ来た瞬間まで記録済みです。"
    ],
    "ron": [
      "ロンです。その一打、綺麗に残しますね。",
      "それは私の待ちです。震えを見せてください。",
      "ロン。頁を閉じるには十分な牌です。",
      "今の選択、実に記録価値があります。"
    ],
    "riichi": [
      "立直。ここから先は観察時間です。",
      "リーチです。震えを見せてください。",
      "待ちますよ。貴女が選ぶその瞬間まで。",
      "立直。記録の頁を開いておきます。"
    ],
    "chi": [
      "チーです。欠けた行を補います。",
      "それ、記録に差し込みますね。",
      "チー。文脈が繋がりました。"
    ],
    "pon": [
      "ポンです。同じ印が揃いました。",
      "それは私の頁に必要です。",
      "ポン。反復は良い資料になります。"
    ],
    "kan": [
      "カンです。余白を少し乱しましょう。",
      "槓いたします。記録が厚くなりますねぇ。",
      "カン。大きな音ほど残しやすいです。"
    ],
    "result": [
      "私の勝ちです。良い標本になりましたね。",
      "終局。美しい頁が一枚増えました。",
      "勝てました。貴女の迷い、保存しておきます。",
      "ふふ、結果まで含めて記録済みです。"
    ],
    "draw": [
      "流局です。未完の頁も嫌いではありません。",
      "決まりませんでしたねぇ。余白として残しましょう。",
      "山が尽きました。観察は次へ持ち越しです。",
      "流れましたか。途中経過の方が美しいこともあります。"
    ],
    "final": [
      "対局終了です。総記録を閉じますね。",
      "最終結果です。貴女の癖までよく残りました。",
      "終わりました。読み返すのが楽しみです。",
      "南帆さん、お疲れさまです。今日の頁、なかなか濃いですよ。"
    ]
  },
  "kouga": {
    "start": [
      "始めようか。アンタの目、今日はどこで揺れるかな。",
      "開局だね。退屈させないでよ。",
      "フッ……いい卓じゃん。少し遊ぼうか。",
      "始めるよ。綺麗に勝つか、綺麗に崩れるかだ。"
    ],
    "tsumo": [
      "ツモ。来たね、俺を選んで。",
      "引けたよ。アンタの視線、今ちょっと動いた。",
      "自摸。こういう巡り、嫌いじゃない。",
      "この一枚、なかなか色っぽいじゃん。"
    ],
    "ron": [
      "ロン。そこ、俺が見てた場所だよ。",
      "それ当たり。ねえ、焦った？",
      "ロンだ。アンタの隙、甘かったね。",
      "終わり。今の表情、けっこう好きだよ。"
    ],
    "riichi": [
      "リーチ。捕まる準備、できてる？",
      "立直。ここから俺を意識して。",
      "待つよ。逃げる顔も悪くないし。",
      "リーチ。俺の前でどこまで耐える？"
    ],
    "chi": [
      "チー。細い誘いも拾っておくよ。",
      "それ、俺の流れに混ぜる。",
      "チーだね。近づく口実ができた。"
    ],
    "pon": [
      "ポン。同じ匂いが重なった。",
      "それ欲しいな。貰うよ。",
      "ポン。形が少し艶っぽくなった。"
    ],
    "kan": [
      "カン。派手な音、嫌いじゃないでしょ？",
      "槓だよ。場を少し眩ませる。",
      "カンする。視線、逸らさないで。"
    ],
    "result": [
      "俺の勝ち。アンタの表情まで貰った気分。",
      "終わったね。最後まで楽しませてくれた。",
      "勝ったよ。美しい勝敗は嫌いじゃない。",
      "対局終了。俺の余韻、残ってる？"
    ],
    "draw": [
      "流局か。焦らされたね、悪くない。",
      "決まらなかったな。余韻だけ残しておこう。",
      "山切れだね。もっと見てたかったのに。",
      "流れたよ。続きは次にしてあげる。"
    ],
    "final": [
      "終わり。アンタの打ち方、最後まで面白かったよ。",
      "総合結果だね。数字より表情の方が正直だけど。",
      "対局終了。俺のこと、少しは意識した？",
      "いい卓だった。心の隙までよく見えたよ。"
    ]
  }
};

function eventQuote(player, event) {
  const id = player?.id || '';
  const pool = CHARACTER_EVENT_LINES[id]?.[event] || [];
  if (pool.length) {
    const key = `v42:${id}:${event}`;
    EVENT_ROTATION[key] = ((EVENT_ROTATION[key] ?? -1) + 1) % pool.length;
    return pool[EVENT_ROTATION[key]];
  }
  return player?.quote || '';
}

function cutinPortraitHtml(player, className = 'cutin-portrait') {
  const portrait = player.portrait || `assets/characters/${player.id}.png`;
  return `
    <div class="${className}" style="--char-gradient:${player.color}">
      <span class="cutin-fallback">${player.icon}</span>
      <img src="${portrait}" alt="${escapeHtml(player.name)}" loading="eager" onload="this.parentElement.classList.add('image-loaded')" onerror="this.remove()">
    </div>
  `;
}

async function showCutin(player, title, quote, options = {}) {
  const el = $('cutin');
  if (!el || !player) return;
  const duration = options.duration ?? 3200;
  el.className = `cutin cutin-${options.kind || 'full'}`;
  el.innerHTML = `
    <div class="cutin-card" style="--char-gradient:${player.color}">
      ${cutinPortraitHtml(player)}
      <div class="cutin-copy">
        <p class="eyebrow">${escapeHtml(player.name)} / CUT IN</p>
        <h2>${escapeHtml(title)}</h2>
        <p class="cutin-quote">${escapeHtml(quote)}</p>
        <small>タップで進む</small>
      </div>
    </div>
  `;
  await new Promise(resolve => {
    let closed = false;
    let allowClick = false;
    const close = () => {
      if (closed) return;
      closed = true;
      clearTimeout(timer);
      el.classList.add('hidden');
      el.removeEventListener('click', clickClose);
      resolve();
    };
    const clickClose = () => { if (allowClick) close(); };
    const timer = setTimeout(close, duration);
    setTimeout(() => { allowClick = true; }, 450);
    el.addEventListener('click', clickClose);
  });
}

async function showMiniCutin(player, title, quote) {
  const el = $('miniCutin');
  if (!el || !player) return;
  el.style.setProperty('--char-gradient', player.color);
  el.innerHTML = `
    ${cutinPortraitHtml(player, 'mini-cutin-portrait')}
    <div class="mini-cutin-copy">
      <p>${escapeHtml(player.name)}</p>
      <strong>${escapeHtml(title)}</strong>
      <span>${escapeHtml(quote)}</span>
    </div>
  `;
  el.classList.remove('hidden');
  await sleep(1800);
  el.classList.add('hidden');
}

function hideResult() {
  const el = $('resultOverlay');
  if (!el) return;
  el.classList.add('hidden');
  el.innerHTML = '';
}

function showResult(winner, title, result, points, from, tile) {
  if (isMatchFinal()) {
    showFinalResult({ type: 'win', winner, title, result, points, from, tile });
    return;
  }
  const el = $('resultOverlay');
  if (!el || !winner) return;
  const yakuText = result?.yaku?.length ? result.yaku.join('・') : '役なし';
  const fromText = from ? `放銃：${from.name}` : '自摸和了';
  const tileText = tile != null ? `${TILE_GLYPHS[tile]} ${TILE_TEXT[tile]}` : '';
  el.innerHTML = `
    <div class="result-card" style="--char-gradient:${winner.color}">
      <div class="result-art">${cutinPortraitHtml(winner, 'result-portrait')}</div>
      <div class="result-copy">
        <p class="eyebrow">RESULT / WINNER</p>
        <h2><span>${winner.icon}</span>${escapeHtml(winner.name)}</h2>
        <div class="result-badges">
          <span>${escapeHtml(title)}</span>
          <span>${escapeHtml(yakuText)}</span>
          <span>${escapeHtml(points.pay)}点</span>
        </div>
        <p class="result-line">${escapeHtml(tileText)} ${escapeHtml(fromText)}</p>
        <blockquote>${escapeHtml(eventQuote(winner, 'result'))}</blockquote>
        <div class="result-actions">
          <button type="button" class="primary" data-result-action="restart">${(state.matchLength === Infinity || state.currentHand < state.matchLength) ? '次局へ' : '新しく対局'}</button>
          <button type="button" class="ghost" data-result-action="close">結果を閉じる</button>
        </div>
      </div>
    </div>
  `;
  el.classList.remove('hidden');
  el.querySelector('[data-result-action="restart"]')?.addEventListener('click', () => {
    hideResult();
    (state.matchLength === Infinity || state.currentHand < state.matchLength) ? startGame(false) : startGame(true);
  });
  el.querySelector('[data-result-action="close"]')?.addEventListener('click', hideResult);
}


function isMatchFinal() {
  return state.matchLength !== Infinity && state.currentHand >= state.matchLength;
}

function rankedPlayers() {
  const sorted = state.players
    .map(p => ({ player: p, score: Number(p.score) || 0 }))
    .sort((a, b) => (b.score - a.score) || (a.player.index - b.player.index));
  let lastScore = null;
  let lastRank = 0;
  return sorted.map((entry, index) => {
    const rank = entry.score === lastScore ? lastRank : index + 1;
    lastScore = entry.score;
    lastRank = rank;
    return { ...entry, rank };
  });
}

function scoreDeltaText(score) {
  const delta = score - 25000;
  if (delta === 0) return '±0';
  return `${delta > 0 ? '+' : ''}${delta.toLocaleString('ja-JP')}`;
}

function finalLastLine(context) {
  if (context?.type === 'draw') {
    const names = context.tenpaiNames?.length ? `テンパイ：${context.tenpaiNames.join('、')}` : 'ノーテン';
    return `最終局：流局 / ${names}`;
  }
  if (context?.type === 'win') {
    const yakuText = context.result?.yaku?.length ? context.result.yaku.join('・') : '役なし';
    const fromText = context.from ? `放銃：${context.from.name}` : '自摸和了';
    return `最終局：${context.winner.name}の${context.title} / ${yakuText} / ${context.points.pay}点 / ${fromText}`;
  }
  return '全局終了。最終スコアが確定しました。';
}

function showFinalResult(context = {}) {
  const el = $('resultOverlay');
  if (!el) return;
  const ranking = rankedPlayers();
  const champion = ranking[0]?.player || state.players[0] || characterById(selectedPlayer);
  const matchText = state.matchLength === Infinity ? `${state.currentHand}局終了` : `${state.matchLength}局終了`;
  const rankingHtml = ranking.map(entry => {
    const p = entry.player;
    const delta = scoreDeltaText(entry.score);
    return `<li class="final-rank-row ${entry.rank === 1 ? 'champion' : ''}">
      <span class="final-rank-place">${entry.rank}位</span>
      <span class="final-rank-name"><span>${escapeHtml(p.icon || '🀄')}</span>${escapeHtml(p.name)}</span>
      <strong>${entry.score.toLocaleString('ja-JP')}点</strong>
      <em>${escapeHtml(delta)}</em>
    </li>`;
  }).join('');
  const quote = eventQuote(champion, 'final');
  el.innerHTML = `
    <div class="result-card final-result" style="--char-gradient:${champion.color || 'linear-gradient(135deg,#1e2438,#30234c)'}">
      <div class="result-art">${cutinPortraitHtml(champion, 'result-portrait')}</div>
      <div class="result-copy">
        <p class="eyebrow">FINAL RESULT</p>
        <h2><span>🏆</span>${escapeHtml(champion.name)}</h2>
        <div class="result-badges">
          <span>${escapeHtml(matchText)}</span>
          <span>優勝 ${escapeHtml(champion.name)}</span>
          <span>${champion.score.toLocaleString('ja-JP')}点</span>
        </div>
        <p class="result-line">${escapeHtml(finalLastLine(context))}</p>
        <ol class="final-ranking">${rankingHtml}</ol>
        <blockquote>${escapeHtml(quote)}</blockquote>
        <div class="result-actions">
          <button type="button" class="primary" data-result-action="restart">同じ設定でもう一戦</button>
          <button type="button" class="ghost" data-result-action="select">対戦相手を選び直す</button>
          <button type="button" class="ghost" data-result-action="close">結果を閉じる</button>
        </div>
      </div>
    </div>
  `;
  el.classList.remove('hidden');
  log(`対局終了。優勝は${champion.name}（${champion.score.toLocaleString('ja-JP')}点）。`, true);
  el.querySelector('[data-result-action="restart"]')?.addEventListener('click', () => {
    hideResult();
    startGame(true);
  });
  el.querySelector('[data-result-action="select"]')?.addEventListener('click', () => returnToSelectFromGame('opponents'));
  el.querySelector('[data-result-action="close"]')?.addEventListener('click', hideResult);
}

function escapeHtml(str) {
  return String(str).replace(/[&<>'"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[ch]));
}


function openYakuModal(category = activeYakuCategory) {
  activeYakuCategory = category;
  renderYakuTabs();
  renderYakuList();
  $('yakuModal').classList.remove('hidden');
}

function closeYakuModal() {
  $('yakuModal').classList.add('hidden');
}

function renderYakuTabs() {
  const tabs = $('yakuTabs');
  if (!tabs) return;
  tabs.innerHTML = '';
  YAKU_CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `yaku-tab ${cat.id === activeYakuCategory ? 'active' : ''}`;
    btn.textContent = cat.label;
    btn.addEventListener('click', () => {
      activeYakuCategory = cat.id;
      renderYakuTabs();
      renderYakuList();
    });
    tabs.appendChild(btn);
  });
}

function renderYakuList() {
  const list = $('yakuList');
  if (!list) return;
  const items = YAKU_LIST.filter(y => y.cat === activeYakuCategory);
  list.innerHTML = items.map(yaku => {
    const badges = yaku.badges.map(b => {
      const cls = b === '判定済' ? 'impl' : b === '初心者向け' ? 'easy' : '';
      return `<span class="yaku-badge ${cls}">${escapeHtml(b)}</span>`;
    }).join('');
    return `
      <article class="yaku-item">
        <div class="yaku-title-row">
          <div class="yaku-name">${escapeHtml(yaku.name)}</div>
          <div class="yaku-han">${escapeHtml(yaku.han)}</div>
        </div>
        <div class="yaku-desc">${escapeHtml(yaku.desc)}</div>
        <div class="yaku-tip">${escapeHtml(yaku.tip)}</div>
        <div class="yaku-badges">${badges}</div>
      </article>
    `;
  }).join('');
}

function registerPwa() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    $('installBtn').classList.remove('hidden');
  });
}

$('riichiBtn').addEventListener('click', () => {
  const p = state.players[0];
  if (!p || p.riichi || !canDeclareRiichi(p) || p.score < 1000) return;
  state.riichiPending = true;
  $('riichiBtn').disabled = true;
  $('centerMessage').textContent = '立直する牌を選んでね。光っている牌だけ捨てられるよ。';
  log('南帆が立直宣言。テンパイを維持できる捨て牌だけ選べるよ。', true);
  renderAll();
});

document.addEventListener('DOMContentLoaded', () => {
  renderCharacterChoices();
  setupEventListeners();
  showTopScreen();
  window.matchMedia('(max-width: 900px)').addEventListener?.('change', setTopBackgroundAsset);
  registerPwa();
});
