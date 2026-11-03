// 영어로 보는 사람에게는, 화면에 닿는 한글을 그 자리에서 영어로 바꿔 보여 준다.
// 본문 코드는 한글 그대로 두고 (몸짓은 번호로 주고받으니 언어가 달라도 맞는다), 글이 화면·캔버스·공유에 닿는 길목만 지킨다.
(() => {
  const q = new URLSearchParams(location.search).get('lang');
  let lang = null;
  try { if (q === 'en' || q === 'ko') localStorage.setItem('sewol.lang', q); lang = localStorage.getItem('sewol.lang'); } catch {}
  lang = q === 'en' || q === 'ko' ? q : lang || (/^ko\b/i.test(navigator.language || '') ? 'ko' : 'en');
  window.SEWOL_LANG = lang;
  if (lang !== 'en') return;
  document.documentElement.lang = 'en';
  // 영어 낱말은 길어서, 소원 글자 간격을 좁히고 십장생 칸에는 한자를 보인다
  document.head.insertAdjacentHTML('beforeend', '<style>.wishpick .wg button{letter-spacing:0;font-size:14px}.long .chips i{font-size:0}.long .chips i::before{content:attr(data-ch);font-size:12px}@media (max-width:400px){html[lang=en] .place b{font-size:13.5px}html[lang=en] .tools button{padding:0 5px;min-width:30px}}</style>');

  const HAN = /[가-힣]/;
  const D = {
    // 겉
    '세월낚시터': 'Fishing for Time', '반계 강가': 'Still Water', '위수 · 세월낚시터': 'Wei River · Fishing for Time',
    '건너가기': 'Cross', '돌아오기': 'Return', '세월 장부': 'Ledger of Time', '공유': 'Share', '이번에 낚은 세월': 'TIME CAUGHT THIS SITTING',
    '소원등에 적을 두 글자를 골라요': 'Choose a wish to write on your lantern',
    '낚싯대 드리우기': 'Cast line', '낚싯대 거두기': 'Reel in', '읍하기': 'Bow', '손 흔들기': 'Wave', '차 한잔': 'Tea', '시 한 수': 'Poem', '소원등': 'Lantern', '장부에 적기': 'Record',
    '미끼 없는 곧은 바늘입니다. 화면을 끌면 강가를 둘러볼 수 있어요.': 'A straight hook, no bait. Drag the screen to look around the riverbank.',
    '찌가 흔들려도 괜찮아요. 거둬도 세월은 계속 흘러요.': "It's fine if the float bobs. Even if you reel in, time keeps flowing.",
    '닫기': 'Close', '메뉴': 'Menu', '내가 장부에 적은 세월': 'Time I recorded', '강가 모두가 적은 세월': 'Time recorded by everyone',
    '순위는 한자리에서 가장 오래 앉아 있던 세월 순이에요. 이번 주 장부는 월요일마다 새로 펼쳐요.': "Ranked by the longest single sitting. This week's ledger opens fresh every Monday.",
    '강가에서 만난 오랜 벗': 'Old friends met by the river', '이번 주': 'This week', '모든 세월': 'All time',
    '아직 장부에 오른 사람이 없어요. 세월을 낚은 뒤 ‘장부에 적기’를 누르면 첫 줄에 오릅니다.': "No one is in the ledger yet. Catch some time, tap 'Record', and yours will be the first line.",
    '이번 주엔 아직 아무도 적지 않았어요. 첫 줄의 주인이 되어 보세요.': 'No one has recorded this week yet. The first line could be yours.',
    '공유 장부가 아직 연결되지 않았어요': "The shared ledger isn't connected yet", '이름 모를 강태공': 'Nameless Angler',
    '세월 장부에 적었어요 · 조과(釣果)': 'RECORDED IN THE LEDGER · YOUR CATCH', '세월 카드': 'Time Card', '계속 앉아 있기': 'Keep sitting',
    '때가 걸렸다': 'The moment bit',
    '십 년을 기다린 강가에 서백 희창의 수레가 멈췄습니다.': 'After ten years of waiting, the carriage of Lord Ji Chang of the West stopped at the riverbank.',
    '“노인장, 무엇을 낚고 계십니까.” “세월을 낚고 있었지요. 방금 왕을 낚았소.”': '"Old man, what are you fishing for?" "For time. And just now, I caught a king."',
    '노인장, 무엇을 낚고 계십니까': 'Old man, what are you fishing for?',
    '건너편 강가로 건너가기': 'Cross to the far bank', '이쪽 강가로 돌아오기': 'Return to this bank', '물소리 켜기': 'Turn on river sounds', '물소리 끄기': 'Turn off river sounds', '강가 공유하기': 'Share the riverbank',
    '그리는 중…': 'Drawing…', '다시 눌러 주세요': 'Tap again', '공유가 안 됐어요': "Couldn't share", '저장 · 문구 복사됨': 'Saved · text copied', '저장했어요': 'Saved',
    '반계 강가 · 세월 장부': 'Still Water · Ledger of Time', '곧은 바늘로 이만큼의 세월을 낚았다': 'This much time, caught on a straight hook',
    '봄': 'Spring', '여름': 'Summer', '가을': 'Autumn', '겨울': 'Winter', '밤': 'Night', '새벽': 'Dawn', '낮': 'Day', '해질녘': 'Dusk', '눈': 'Snow', '비': 'Rain',
    '숨 한 번에 하루가 흐릅니다': 'One breath, one day',

    // 시 한 수
    '願者上鉤 — 원하는 놈만 물어라': '願者上鉤 — only the willing bite',
    '곧은 바늘엔 고기 말고 때가 걸린다': 'A straight hook catches not fish, but the right moment',
    '강물은 서두르지 않아도 바다에 닿는다': 'The river never hurries, yet it reaches the sea',
    '오늘도 공치는 중이오': 'Catching nothing again today',
    '낚는 건 고기가 아니라 세월이라네': "It's not fish I'm catching, it's time",
    '찌가 안 움직이면 마음도 안 움직인다': 'When the float is still, so is the heart',
    '물고기야, 나는 너를 원하지 않는다': "Little fish, I don't want you",
    '빈 바구니가 제일 가볍다': 'An empty basket is the lightest',
    '물은 깊을수록 소리가 없다': 'The deeper the water, the quieter it runs',
    '오늘 못 낚은 것은 내일의 몫이다': "What I didn't catch today belongs to tomorrow",
    '세월은 미끼 없이도 문다': 'Time bites even without bait',
    '흐르는 물에 이름을 쓰다': 'Writing my name on flowing water',
    '고기는 물속에, 나는 물가에. 서로 편하다': "Fish in the water, me on the bank. We're both at ease",
    '기다림도 한 마리 물고기라': 'Waiting, too, is a kind of fish',
    '산은 앉아 있고 강은 걸어간다': 'The mountain sits; the river walks on',
    '구름이 바늘에 걸렸다 풀려 간다': 'A cloud snags on the hook, then slips free',
    '천 년을 흘러도 강은 늙지 않는다': 'A thousand years of flowing, and the river never ages',
    '내 수염이 길어지는 동안 강은 그대로다': 'My beard grows long; the river stays the same',
    '바쁜 놈은 고기를 낚고 한가한 놈은 하루를 낚는다': 'The busy catch fish; the idle catch the day',
    '강은 한 번도 같은 물로 흐르지 않는다': 'The river never flows with the same water twice',
    '미끼 없는 바늘에 마음만 걸린다': 'On a baitless hook, only the heart gets caught',
    '물결이 잦아들면 하늘이 비친다': 'When the ripples settle, the sky appears',
    '찌가 졸면 나도 존다': 'When the float dozes, so do I',
    '고기 대신 노을을 한 바구니 낚았다': 'Instead of fish, I caught a basket of sunset',
    '서두르는 물은 소리만 크다': 'Hurried water only makes noise',
    '바람이 지나간 자리에 고요가 앉는다': 'Where the wind has passed, stillness sits down',
    '오늘의 빈손이 내일의 넉넉함이다': "Today's empty hands are tomorrow's plenty",
    '강 건너 사람도 나만큼 한가하겠지': "The one across the river must be as idle as I am",
    '흘러가게 두면 다 흘러간다': 'Let it flow, and it all flows by',
    '앉은 자리가 꽃자리라': 'Wherever you sit is a place of flowers',
    '물 위에 뜬 달은 건져도 젖지 않는다': "The moon on the water won't get wet, even if you scoop it up",

    // 차
    '(후루룩…)': '(slurp…)', '차가 식기 전에 강이 먼저 식는구나': 'The river cools before the tea does', '(따뜻하다)': '(so warm)', '차 맛이 강물 맛이구려': 'This tea tastes of the river',
    '(호오— 김을 분다)': '(hoo— blows on the steam)', '한 모금에 하루가 간다': 'One sip, and a day goes by', '(두 손으로 감싸 쥔다)': '(cups it in both hands)',
    '강바람에 차 향이 섞이는구나': 'The tea smell mixes with the river breeze', '(찻잔에 하늘이 담겼다)': '(the sky sits in the teacup)', '천천히 마셔야 오래 따뜻하다': 'Drink slowly and it stays warm longer',
    '차 한잔 드시오': 'Have a cup of tea', '식기 전에 드시구려': 'Drink it before it cools', '강바람이 차오. 한잔 하시오': 'The river wind is cold. Have a cup',
    '손이 시리면 이걸 쥐시오': 'If your hands are cold, hold this', '세월 낚는 데는 차가 제일이오': "Nothing beats tea for fishing time", '내 몫까지 한잔 더 데웠소': 'I warmed an extra cup, more than my share',
    '물 끓인 김에 한잔 더 따랐소': 'The water was boiling, so I poured another', '쉬엄쉬엄 하시오. 차나 한잔': 'Take it easy. Have some tea',
    '이 차는 공짜요. 세월만 조금 내시오': 'The tea is free. Just pay a little time', '추운데 고생 많소. 한잔 드시오': "It's cold out here. Have a cup",

    // 읍·손
    '(읍)': '(bows)', '강가의 벗들께 인사드리오': 'Greetings, friends of the river', '(고개를 숙인다)': '(lowers head)', '오늘도 무사히 공치시오': 'May you catch nothing safely today',
    '(공손히 손을 모은다)': '(folds hands politely)', '오늘도 평안하시오': 'Be at peace today', '(허리를 깊이 숙인다)': '(bows deeply)', '좋은 강가에서 뵙소': 'Good to meet you by this fine river',
    '같이 앉아 있어 든든하오': "It's good to have company here",
    '(손을 흔든다)': '(waves)', '어이— 거기 계시오?': 'Hey— are you there?', '반갑소!': 'Good to see you!', '여기요, 여기!': 'Over here!', '거기 바람은 어떻소?': "How's the wind over there?",
    '고기 좀 무오?': 'Anything biting?', '나도 여기 있소!': "I'm here too!", '거기 강물은 어떻소?': "How's the water over there?", '(삿갓을 들어 보인다)': '(raises straw hat)',
    '천천히 낚으시오!': 'Fish slowly!', '오늘 날 좋구려!': 'Lovely day, isn\'t it!',

    // 강가 소식
    '잉어가 곧은 바늘을 보고 웃으며 지나갔어요': 'A carp saw your straight hook and swam off laughing',
    '바람이 찌를 살짝 흔들고 갔어요': 'The wind gave your float a little nudge',
    '백로 한 마리가 당신을 바위로 착각했어요': 'An egret mistook you for a rock',
    '건너편 산그림자가 한 뼘 길어졌어요': "The mountain's shadow across the river grew a hand longer",
    '물고기가 바늘을 툭 치고 고개를 저었어요': 'A fish tapped your hook and shook its head',
    '아무 일도 일어나지 않았어요. 아주 좋아요': 'Nothing happened. Very good',
    '강물이 같은 말을 또 하고 있어요': 'The river is saying the same thing again',
    '버들잎 하나가 찌 옆에 앉았다 떠났어요': 'A willow leaf rested by your float, then drifted on',
    '건너편에서 누가 하품을 한 것 같아요': 'Someone across the river seems to have yawned',
    '물총새가 당신 바늘을 구경하고 갔어요': 'A kingfisher came to look at your hook',
    '바람이 삿갓을 살짝 들었다 놓았어요': 'The wind lifted your hat and set it back down',
    '물고기 셋이 회의를 하고 흩어졌어요': 'Three fish held a meeting and dispersed',
    '구름 그림자가 강을 건너갔어요': "A cloud's shadow crossed the river",
    '찌가 꾸벅 졸았어요': 'Your float nodded off',
    '강물이 조금 더 느려진 것 같아요': 'The river seems a little slower now',
    '저 멀리서 개 짖는 소리가 났어요': 'A dog barked somewhere far away',
    '잠자리가 낚싯대 끝에서 쉬어 갔어요': 'A dragonfly rested on the tip of your rod',
    '물방울 하나가 찌 위에 앉았다 굴러떨어졌어요': 'A drop of water sat on your float, then rolled off',
    '송사리 떼가 발밑을 한 바퀴 돌고 갔어요': 'A school of minnows circled by your feet',
    '바람에 실려 온 꽃잎 하나가 물에 떴어요': 'A petal carried by the wind landed on the water',
    '삿갓 그늘이 조금 옆으로 옮겨 갔어요': "Your hat's shadow shifted a little to the side",

    // 이정표
    '첫날. 바늘이 곧아도 마음은 굽지 않았어요': 'Day one. The hook is straight, and so is your heart',
    '사흘. 바늘이 물에 익숙해졌어요': 'Three days. The hook has grown used to the water',
    '한 주가 흘렀어요': 'A week has flowed by',
    '보름. 찌가 당신 숨소리에 맞춰 흔들려요': 'Two weeks. The float bobs in time with your breathing',
    '한 달. 물새가 당신 어깨에 앉을까 고민해요': 'One month. A water bird wonders whether to land on your shoulder',
    '두 달. 강가 풀이 당신을 알아봐요': 'Two months. The riverside grass recognizes you',
    '백 일. 수염이 한 치 자랐어요': 'A hundred days. Your beard has grown an inch',
    '반년. 강 건너 마을에서 당신 얘기를 해요': 'Half a year. The village across the river talks about you',
    '일 년을 낚았어요': "You've caught a whole year",
    '이 년. 물새가 삿갓을 제 집으로 여겨요': 'Two years. A water bird thinks your hat is its home',
    '삼 년. 이제 물고기들이 인사를 해요': 'Three years. The fish greet you now',
    '사 년. 강물이 당신 이름을 외웠어요': 'Four years. The river has learned your name',
    '오 년. 찌가 당신을 닮아가요': 'Five years. The float is starting to look like you',
    '육 년. 수염이 찌에 닿을락 말락해요': 'Six years. Your beard almost reaches the float',
    '칠 년. 건너편 산이 당신을 닮아가요': 'Seven years. The mountain across the river is starting to look like you',
    '팔 년. 멀리서 수레바퀴 소리가 들리는 것 같아요': 'Eight years. You think you hear carriage wheels far away',
    '구 년. 바람결에 깃발 소리가 들려요': 'Nine years. Banners flutter on the wind',
    '구 년 반. 강 건너 먼지가 일어요': 'Nine and a half years. Dust rises across the river',

    // 낚싯대 거둘 때
    '내가 낚는 건 물고기가 아니라 세월이오': "It's not fish I catch, but time",
    '고기는 놓아주고 시간만 건졌소': 'I let the fish go and kept only the time',
    '허허, 오늘도 강물만 올라오는구려': 'Heh heh, only river water comes up again today',
    '원하는 놈만 물라 했거늘': 'I did say only the willing should bite',
    '빈 바늘이 제일 무거운 법이오': 'An empty hook is the heaviest of all',
    '물고기야, 너는 가던 길 가거라': 'Go on your way, little fish',
    '오늘도 바늘이 곧게 잘 있구려': 'The hook is still nice and straight today',
    '고기 대신 물방울 몇 개 건졌소': 'Caught a few drops of water instead of fish',
    '걸린 건 바람 한 줄기뿐이오': 'All I hooked was a wisp of wind',
    '허허, 바늘이 나보다 꼿꼿하구려': 'Heh heh, the hook stands straighter than I do',
    '빈손이 제일 가볍소': 'Empty hands are the lightest',
    '조금만 더 있다 오너라, 세월아': 'Stay a little longer, time',

    // 절기
    '소한': 'Minor Cold', '작은 추위가 오는 날이에요': 'The day the lesser cold arrives', '소한 추위가 대한보다 맵다더니 정말이구려': 'They say Minor Cold bites harder than Major Cold. True enough',
    '대한': 'Major Cold', '가장 큰 추위라는 날이에요': 'The day of the greatest cold', '대한이 지나면 봄이 머지않소': "Once Major Cold passes, spring isn't far",
    '입춘': 'Start of Spring', '봄이 문턱을 넘는 날이에요': 'The day spring steps over the threshold', '입춘이오. 바늘 끝에 봄이 걸리겠구려': 'Start of Spring. Spring may catch on the tip of the hook',
    '우수': 'Rain Water', '눈이 비로 바뀌는 날이에요': 'The day snow turns to rain', '얼음이 풀리면 강 소리도 달라지지': 'When the ice melts, the river sounds different',
    '경칩': 'Awakening of Insects', '개구리가 깨어나는 날이에요': 'The day the frogs wake up', '개구리도 깼는데 고기는 여전히 안 무는구려': "Even the frogs are up, and still the fish won't bite",
    '춘분': 'Spring Equinox', '낮과 밤의 길이가 같은 날이에요': 'The day night and day are equal', '오늘은 낮도 밤도 공평하오': 'Today, day and night are fair to each other',
    '청명': 'Clear and Bright', '하늘이 맑아지는 날이에요': 'The day the sky turns clear', '청명이라 물빛이 좋소': "It's Clear and Bright. The water looks lovely",
    '곡우': 'Grain Rain', '곡식을 깨우는 비가 오는 날이에요': 'The day rain wakes the grain', '곡우엔 비가 와야 풍년이라오': 'Rain on Grain Rain means a good harvest',
    '입하': 'Start of Summer', '여름이 시작되는 날이에요': 'The day summer begins', '입하라. 버들잎이 짙어지는구려': 'Start of Summer. The willow leaves are deepening',
    '소만': 'Grain Buds', '만물이 차오르는 날이에요': 'The day all things fill out', '세월도 조금씩 차오르는 중이오': 'Time, too, is filling up little by little',
    '망종': 'Grain in Ear', '씨를 뿌리는 날이에요': 'The day for sowing seeds', '다들 씨 뿌리는데 우리는 세월을 뿌리는구려': "Everyone's sowing seeds, and here we are sowing time",
    '하지': 'Summer Solstice', '낮이 가장 긴 날이에요': 'The longest day of the year', '해가 길어 세월이 천천히 가오': 'The days are long, so time goes slowly',
    '소서': 'Minor Heat', '작은 더위가 오는 날이에요': 'The day the lesser heat arrives', '삿갓 밑이 제일 시원하오': "The coolest spot is under the hat",
    '대서': 'Major Heat', '가장 더운 날이에요': 'The hottest day', '이 더위엔 고기도 그늘에서 쉬오': 'In this heat, even the fish rest in the shade',
    '입추': 'Start of Autumn', '가을이 시작되는 날이에요': 'The day autumn begins', '바람 끝이 달라졌구려': 'The edge of the wind has changed',
    '처서': 'End of Heat', '더위가 물러나는 날이에요': 'The day the heat retreats', '처서 지나면 모기 입도 비뚤어진다오': "After End of Heat, they say even mosquitoes' mouths go crooked",
    '백로': 'White Dew', '풀잎에 이슬이 맺히는 날이에요': 'The day dew forms on the grass', '아침 이슬이 찌에도 맺혔소': 'Morning dew has formed on the float too',
    '추분': 'Autumn Equinox', '다시 낮과 밤이 같아지는 날이에요': 'The day night and day are equal again', '이제부터 밤이 길어지오. 세월 낚기 좋은 때지': 'The nights grow long from here. A good season for fishing time',
    '한로': 'Cold Dew', '찬 이슬이 내리는 날이에요': 'The day cold dew falls', '강물이 차가워졌소': 'The river has turned cold',
    '상강': 'Frost Descent', '서리가 내리는 날이에요': 'The day frost comes down', '서리가 내리면 단풍도 끝물이오': 'When frost falls, the autumn leaves are nearly done',
    '입동': 'Start of Winter', '겨울이 문턱을 넘는 날이에요': 'The day winter steps over the threshold', '입동이오. 차 한잔이 더 따뜻한 때지': 'Start of Winter. Tea tastes warmer now',
    '소설': 'Minor Snow', '첫눈이 올 법한 날이에요': 'The day the first snow might come', '소설이라. 삿갓에 첫눈이 앉겠구려': 'Minor Snow. The first snow may land on my hat',
    '대설': 'Major Snow', '눈이 많이 내리는 날이에요': 'The day of heavy snow', '눈이 쌓이듯 세월도 쌓이오': 'Time piles up, just like snow',
    '동지': 'Winter Solstice', '밤이 가장 긴 날이에요': 'The longest night of the year', '밤이 가장 긴 날. 세월 낚기엔 그만이오': 'The longest night. Perfect for fishing time',

    // 오가는 이들
    '허허, 일 년째 그 자리시구려': "Heh heh, a whole year in that same spot", '허허, 세월이 그리 됐소': 'Heh heh, has it been that long',
    '나무하러 오가며 늘 보았소': "I've seen you every time I passed by gathering wood", '고기 대신 땔감이라도 좀 드릴까?': 'Shall I give you some firewood instead of fish?', '허허, 마음만 받겠소': "Heh heh, the thought is enough",
    '할아버지, 뭐 잡아요?': 'Grandpa, what are you catching?', '바늘이 곧은데요?': 'But your hook is straight?', '세월이요? 세월은 어떻게 생겼어요?': 'Time? What does time look like?',
    '우리도 내일 또 올게요!': "We'll come back tomorrow too!", '허허, 너희만 할 때 낚기 시작했지': 'Heh heh, I started fishing when I was your age',
    '…방금 지나간 거, 붕어 맞지요?': '…That was a carp that just went by, right?', '부캉이가 지나갔어요. 곧은 바늘이라 다행이에요': "Something big just went by. Good thing the hook is straight",
    '강에 상어라니. 세월이 오래되면 별게 다 지나가나 봐요': 'A shark, in a river. Sit long enough and you see everything',
    '방금 그건 못 본 걸로 해요': "Let's pretend we didn't see that", '…강이 바다였던가요?': '…Was this river a sea?', '방금 지나간 그 친구는 미끼가 필요 없겠어요': "That fellow who just passed doesn't need bait",
    '허허… 못 본 걸로 하겠소': "Heh heh… I'll pretend I didn't see that", '저건 내 바늘엔 안 걸리오': "That one won't fit my hook", '물고기도 체급이 있구려': 'So fish come in weight classes',
    '…오늘은 일찍 들어가야겠소': '…I think I\'ll head home early today', '곧은 바늘이라 천만다행이오': 'Thank heavens my hook is straight', '저 친구도 세월을 낚으러 왔나 보오': 'Maybe that fellow came to fish for time too',
    '하, 저건 왕보다 먼저 왔구려': 'Ha, that one came before the king did', '🦈 …방금 뭐가 지나갔어요': '🦈 …Something just went by',
    '저 거북이도 세월 낚는 중이오': "That turtle's fishing for time too", '거북이는 나보다 오래 앉아 있었을 거요': "That turtle has surely sat longer than I have",
    '허허, 백 년 묵은 벗이 왔구려': 'Heh heh, a hundred-year-old friend has come', '거북이야, 너는 몇 해째냐': 'Turtle, how many years has it been for you?',
    '천천히 가는 놈이 제일 멀리 가오': 'The slow ones go the farthest', '저 등껍질에 세월이 다 새겨져 있소': 'All the years are carved into that shell',
    '(깡총!)': '(hop!)', '(코를 씰룩)': '(twitches nose)', '(귀가 쫑긋)': '(ears perk up)', '(…당근?)': '(…carrot?)', '(화들짝)': '(startled)',
    '토끼가 깜짝 놀라 세 번 뛰었어요': 'A rabbit got startled and hopped three times', '토끼가 당신을 한참 쳐다보다 갔어요': 'A rabbit stared at you for a long while, then left',
    '토끼도 세월은 안 무나 봐요': "Seems rabbits don't bite on time either", '토끼가 삿갓을 커다란 버섯으로 착각했어요': 'A rabbit mistook your hat for a giant mushroom',
    '(고개를 꾸벅)': '(nods)', '(물끄러미 바라본다)': '(gazes quietly)', '(킁킁)': '(sniff sniff)', '(귀를 쫑긋)': '(perks ears)',
    '아기 노루가 고개를 꾸벅 숙였어요. 읍을 배웠나 봐요': 'A baby deer bowed its head. It must have learned to bow',
    '아기 노루가 당신 삿갓 냄새를 맡고 갔어요': 'A baby deer sniffed your hat and left', '아기 노루가 당신을 오래된 바위로 여기는 눈치예요': 'A baby deer seems to think you are an old rock',
    '…건드리지 마세요. 못 본 걸로 하기로 했잖아요': "…Don't poke it. We agreed we didn't see it", '(후다닥)': '(scurry)', '(쏙)': '(tucks in)', '거북이가 고개를 쏙 집어넣었어요': 'The turtle tucked its head in',

    // 소원
    '무탈': 'Safety', '건강': 'Health', '평안': 'Peace', '행복': 'Joy', '안녕': 'Wellness', '사랑': 'Love', '화목': 'Harmony', '합격': 'Pass',
    '취업': 'A job', '쾌유': 'Healing', '순산': 'Safe birth', '장수': 'Long life', '재회': 'Reunion', '성공': 'Success', '풍요': 'Plenty', '감사': 'Thanks',
    '등불이 먼 물굽이를 돌아 사라졌어요. 다시 띄울 수 있어요.': 'The lantern rounded a far bend and vanished. You can float another.',
    '빈 등을 건졌어요. 띄운 등이 다 떠내려가면 소원을 적어 띄울 수 있어요.': 'You fished up an empty lantern. Once your lantern has drifted away, you can write a wish and float it.',
    '빈 등을 건졌어요. 소원 하나 적어 띄워 보시겠소?': 'You fished up an empty lantern. Care to write a wish and float it?',
    '등불이 아직 강을 따라 떠가고 있어요. 다 떠내려가면 다시 띄울 수 있어요.': 'Your lantern is still drifting down the river. Once it has gone, you can float another.',
    '당신의 돌로 백여덟 개가 채워져, 돌탑이 산 위로 올라갔어요. 당신의 소원이 이뤄지길 바랍니다.': 'Your stone made one hundred and eight, and the stone tower rose up the mountain. May your wish come true.',
    '오늘은 이미 돌을 얹으셨어요. 소원이 꼭 이뤄지길 바랍니다.': "You've already placed a stone today. May your wish come true.",
    '돌 하나를 얹었어요. 당신의 소원이 이뤄지길 바랍니다.': 'You placed a stone. May your wish come true.',
    '솟대 오리가 당신의 소원을 하늘에 전하러 고개를 들었어요': 'The wooden duck on the pole lifted its head to carry your wish to the sky',
    '이 강가에 온 이들이 무탈하기를': 'May all who come to this river be well',
    '솟대가 마을을 지키듯, 당신의 하루도 지켜 주기를': 'As the pole guards the village, may it guard your day',
    '나무 오리가 바람을 타고 좋은 소식을 물어 올 거예요': 'The wooden duck will ride the wind and bring back good news',

    // 십장생
    '해': 'Sun', '산': 'Mountain', '물': 'Water', '돌': 'Stone', '구름': 'Cloud', '소나무': 'Pine', '거북': 'Turtle', '학': 'Crane', '사슴': 'Deer',
    '오랜 벗을 모두 만났어요. 오래오래 평안하소서.': "You've met all your old friends. May you be at peace for a long, long time.",
    '허허, 오랜 벗들을 다 만났구려. 오래오래 평안하시오': "Heh heh, you've met all the old friends. Be at peace for a long, long time",
    '학이 내려왔구려. 오래 살라는 뜻이오': 'A crane came down. It means: live long', '(뚜루루)': '(trrroo)', '학이 당신의 장수를 빌어 주었어요': 'The crane wished you a long life',
    '깍깍': 'caw caw', '깍!': 'caw!', '까치가 반가운 소식을 물어다 줄 거예요': 'The magpie will bring you good news',
    '정월대보름': 'First Full Moon', '한가위': 'Chuseok', '보름달이 떴구려. 소원 하나 빌어 보시오': "The full moon is up. Make a wish", '보름달이 떴어요': 'The full moon is up',

    // 날씨
    '비가 오기 시작했어요. 곧은 바늘은 젖어도 곧아요.': "It's started to rain. A straight hook stays straight, even wet.",
    '눈이 내려요. 삿갓 위에 세월이 쌓여요.': "It's snowing. Time is piling up on your hat.",
    '눈이 그쳤어요. 강가가 하얘졌어요.': 'The snow has stopped. The riverbank is white.',
    '비가 그쳤어요. 강 냄새가 짙어요.': 'The rain has stopped. The river smells rich.',

    // 낚시·장부
    '다시 앉았어요. 아까 낚던 세월에 이어서 흘러요.': 'You sat back down. Time picks up where it left off.',
    '곧은 바늘을 드리웠어요. 이제 기다리기만 하면 돼요.': "You've cast your straight hook. Now all you have to do is wait.",
    '아무것도 걸리지 않았어요. 마음이 조금 급했나 봐요.': 'Nothing bit. Maybe your heart was in a little hurry.',
    '물안개 한 줌': 'A handful of river mist', '아침 물안개가 바늘 끝에 잠깐 걸렸다 흩어졌어요.': 'Morning mist caught on the tip of your hook for a moment, then scattered.',
    '버들잎 한 장': 'A willow leaf', '강가 버드나무가 계절 하나를 내려보냈어요.': 'The riverside willow sent down a season.',
    '계절 하나': 'A season', '흰 수염 한 올': 'A white whisker', '수염이 자란 만큼 마음도 길어졌어요.': 'As your beard grew, so did your patience.',
    '강물 소리 한 병': 'A bottle of river sound', '오래 앉아 있던 사람만 담을 수 있는 소리예요.': 'A sound only those who sit long enough can bottle.',
    '왕의 수레': "The King's Carriage", '곧은 바늘에 때가 걸렸어요. 태공의 경지에 이르렀습니다.': 'The moment caught on your straight hook. You have reached the level of Taigong.',
    '곧은 바늘엔 물고기가 걸리지 않아요. 걸리는 건 세월뿐이에요.': 'No fish bite a straight hook. Only time does.',
    '아직 적을 세월이 없어요. 하루는 앉아 계셔야 해요.': 'No time to record yet. Sit for at least a day.',
    '빈 바늘': 'An Empty Hook',
    '수복강녕': 'Long life and fortune', '오래 살고 복되며 몸과 마음이 편안하기를': 'May you live long, be blessed, and be at ease in body and mind',
    '만사형통': 'All goes well', '하는 일마다 술술 풀리기를': 'May everything you do go smoothly',
    '무병장수': 'Long and healthy', '아픈 데 없이 오래오래': 'Long years, free of pain',
    '소원성취': 'Wishes fulfilled', '바라는 일이 꼭 이루어지기를': 'May what you hope for come true',
    '안과태평': 'Safe and peaceful', '탈 없이 평안하게 지나가기를': 'May your days pass safely and in peace',
    '길상여의': 'Good fortune', '좋은 일이 뜻대로 찾아오기를': 'May good things come just as you wish',
    '소문만복': 'Laughter brings luck', '웃는 집에 복이 가득하기를': 'May a laughing home be full of luck',
    '심상사성': 'As the heart wills', '마음먹은 일이 그대로 이루어지기를': 'May what you set your heart on come to be',
    '🎣 찌가 기다리고 있어요': '🎣 Your float is waiting',

    // 오가는 나무꾼·심마니
    '지게 진 나무꾼': 'Woodcutter', '약초 캐는 심마니': 'Herb Gatherer',
    '이 길은 천천히 걸어야 제맛이오': 'This path is best walked slowly', '지게가 가벼운 날은 마음도 가볍소': 'When the load is light, so is the heart',
    '오늘은 산이 말이 많구려': 'The mountain is chatty today', '이 산엔 약초보다 세월이 더 많소': 'This mountain has more time than herbs',
    '쉬엄쉬엄 가시오. 약초도 천천히 자라오': 'Take it slow. Herbs grow slowly too', '저 산 너머 노루가 또 기웃거리는군': 'That deer is peeking over the hill again',
    '바람이 바뀌었소. 계절이 오려나 보오': 'The wind has changed. A new season must be coming',
    '강물 소리에 귀가 씻기는구려': 'The river sound washes out my ears', '산그림자가 한 뼘 길어졌구려': "The mountain's shadow grew a hand longer",
    '고기가 안 무는 날이 제일 좋은 날이오': 'Days the fish don\'t bite are the best days', '어제 낚은 세월은 어디 두셨소?': 'Where did you keep the time you caught yesterday?',
    '십 년을 앉아 있으면 왕이 온다더이다': 'They say if you sit for ten years, a king comes', '여기선 아무것도 안 해도 괜찮소': "Here, it's fine to do nothing at all",
    '허허, 오늘도 평안하시오': 'Heh heh, be at peace today', '천천히 걸어도 다 닿는다오': 'Walk slowly, and you still get there',
    '물은 낮은 데로 흘러도 부끄러워하지 않소': 'Water flows to low places and is never ashamed', '오늘 바람이 순하구려': 'The wind is gentle today',
    '이 길을 몇십 년을 걸어도 질리질 않소': "Decades on this path, and I'm still not tired of it", '고기가 안 물면 하늘을 보면 되오': "If the fish won't bite, look at the sky",
    '저기 구름 좀 보시오. 느긋하기도 하지': 'Look at that cloud. In no hurry at all', '강가에선 다들 조금씩 착해진다오': 'By the river, everyone gets a little kinder',
    '늙으니 좋은 게 하나 있소. 급할 게 없소': "There's one good thing about getting old. Nothing's urgent", '물새가 오늘은 기분이 좋은가 보오': 'The water birds seem happy today',
    '평안하시오': 'Peace be with you', '허허, 오래 앉으셨구려': "Heh heh, you've been sitting a long while", '오늘 강이 좋지요?': 'The river is lovely today, isn\'t it?',
    '세월 많이 낚으시오': 'May you catch plenty of time', '(꾸벅)': '(nods)', '반갑소': 'Good to see you', '허허, 낯이 익구려': 'Heh heh, you look familiar',
    '좋은 자리 잡으셨소': "You've picked a good spot", '바람 괜찮소?': 'Wind all right?', '오늘도 오셨구려': "You've come again today", '(삿갓을 살짝 든다)': '(tips straw hat)',
    '🍵 차 한잔이 도착했어요': '🍵 A cup of tea has arrived',
    '고맙소, 잘 마시겠소': "Thank you, I'll enjoy it", '고맙소, 따뜻하구려': "Thank you, it's warm", '허허, 이거 귀한 걸': 'Heh heh, what a treat',
    '잘 마시겠소. 덕분에 손이 녹소': 'I\'ll enjoy it. My hands are thawing, thanks to you', '아이고, 고맙소': 'Oh my, thank you', '차 향이 좋구려. 고맙소': 'Lovely smell. Thank you',
    '(맞읍)': '(bows back)', '(마주 고개를 숙인다)': '(bows in return)', '허허, 예를 아시는구려': 'Heh heh, you know your manners', '(공손히 맞읍한다)': '(returns the bow politely)',
    '허허, 반갑소': 'Heh heh, good to see you', '어이— 여기 있소': "Hey— I'm over here", '(삿갓을 흔든다)': '(waves straw hat)', '반갑구려!': 'Well, hello!',
    '새 벗이 오셨구려. 어서 앉으시오': 'A new friend has come. Sit, sit', '허허, 강가가 북적이는구려': 'Heh heh, the riverbank is getting lively',
    '어서 오시오. 좋은 때 오셨소': "Welcome. You've come at a good time", '반가운 얼굴이 하나 늘었구려': "One more friendly face",

    // 지나가며 건네는 말
    '애쓰셨소. 오늘 하루도 잘 견뎠구려': 'You worked hard. You made it through another day',
    '잘하고 있소. 정말이오': "You're doing well. I mean it",
    '천천히 가도 괜찮소. 늦은 게 아니오': "It's fine to go slowly. You're not late",
    '오늘 못 한 건 내일 해도 되오': "What you couldn't do today can wait for tomorrow",
    '여기 앉아 있는 것만으로도 충분하오': 'Just sitting here is enough',
    '걱정은 강물에 띄워 보내시오. 알아서 흘러가오': 'Set your worries on the river. It will carry them off',
    '힘든 날도 지나가오. 강물처럼': 'Hard days pass too. Like the river',
    '누가 뭐래도 그대 걸음으로 가면 되오': 'Whatever anyone says, go at your own pace',
    '숨 한번 크게 쉬어 보시오. 허허, 그렇지': 'Take a deep breath. Heh heh, there you go',
    '고생 많았소. 오늘은 좀 쉬어도 되오': "You've been through a lot. You can rest today",
    '그대가 와서 강가가 환해졌구려': 'The riverbank got brighter when you came',
    '잘 될 거요. 이 늙은이가 장담하오': 'It will turn out fine. This old man promises',
    '비 온 뒤에 땅이 굳는 법이오': 'After the rain, the ground grows firm',
    '조급해 마시오. 꽃도 제때 피오': "Don't rush. Flowers bloom in their own time",
    '그대만 그런 게 아니오. 다들 그렇게 사오': "It's not just you. We all live like that",
    '오늘 하루, 참 잘 버텼소': 'You held up so well today',
    '쉬어 가는 것도 길이오': 'Resting along the way is part of the road',
    '마음이 무거우면 여기 잠깐 내려놓고 가시오': 'If your heart is heavy, set it down here for a while',
    '밥은 챙겨 드셨소? 그게 제일이오': 'Have you eaten? That comes first',
    '어제보다 오늘이 조금 나으면 그걸로 됐소': "If today is a little better than yesterday, that's enough",
    '큰 고기는 늘 기다리는 사람한테 오오': 'The big fish always come to those who wait',
    '지금 이대로도 괜찮은 사람이오': "You're fine just as you are",
    '그대 등이 아까보다 한결 편해 보이오': 'Your shoulders look lighter than before',
    '애쓰지 않아도 되는 데가 하나쯤은 있어야지. 여기가 그렇소': "Everyone needs one place where they don't have to try. This is it",
    '허허, 좋은 시로다': 'Heh heh, a fine poem', '그 시 한 줄에 강이 잠잠해졌소': 'The river went still at that line', '나도 한 수 배워 가오': "I've learned something myself",
    '음, 바늘보다 시가 더 곧구려': 'Hm, your poem is straighter than your hook', '허허, 그 시 어디서 배웠소?': 'Heh heh, where did you learn that poem?',
    '듣기 좋구려. 한 번만 더 읊어 주시오': 'That was nice. Recite it once more', '강물도 귀를 기울였겠소': 'Even the river must have listened', '시 한 수에 차 한잔이 생각나는구려': 'A poem like that makes me want tea',
    '또 오셨구려. 오늘도 평안하시오': "You've come again. Be at peace today",
    '어서 오시오. 여기선 아무것도 안 해도 괜찮소': "Welcome. Here, it's fine to do nothing at all",
    '심심하면 낚싯대나 드리워 보시게': "If you're bored, try casting a line", '허허, 그거면 됐소': "Heh heh, that's all it takes",
    '건너편 돌탑에 돌 하나 얹고 왔소': 'I just placed a stone on the tower across the river', '세월이 쌓였구려. 장부에 적어 두시오': "Time has piled up. Write it in the ledger",
    '어이—': 'Hey—', '어이— 평안하시오?': 'Hey— doing well?', '(손을 크게 흔든다)': '(waves big)', '잘 적으셨소': 'Well recorded', '허허, 또 한 줄 적으셨구려': 'Heh heh, another line in the ledger',
    '천천히 하시오. 강은 기다려 준다오': 'Take your time. The river will wait', '숨 한 번 쉬고 가시오': 'Take a breath first', '서두르지 않아도 세월은 온다오': "Time comes even if you don't hurry",
    '허허, 쉬엄쉬엄 하시오': 'Heh heh, take it easy', '바람 소리나 한번 들어 보시오': 'Listen to the wind for a while', '찌처럼 가만히 있어 보시오': 'Try being still, like the float',
    '마음이 급하면 차 한잔 하시오': "If you're in a hurry, have some tea", '강물처럼 천천히 가시오': 'Go slowly, like the river',

    // 건너가기·공유
    '나룻배를 타고 건너편 강가에 앉았어요. 반계 강가가 마주 보여요.': 'You took the ferry and sat on the far bank. Still Water Riverbank is right across from you.',
    '다시 반계 강가로 건너왔어요.': "You're back on Still Water Riverbank.",
    '물고기는 안 잡혀요. 곧은 바늘로 세월만 낚는 강가예요. 바위 하나 비워 둘게요.': "No fish get caught here. It's a riverbank where you fish only for time, with a straight hook. I'll save you a rock.",
    '링크를 복사했어요. 벗에게 건네 보세요.': 'Link copied. Pass it to a friend.',
    '👤 누가 강가에 와서 앉았어요': '👤 Someone came and sat by the river', '👋 강 건너에서 손을 흔들어요': '👋 Someone is waving from across the river',
    '자리를 비운 사이엔 강물만 흘렀어요. 세월은 앉아 있어야 낚여요.': 'While you were away, only the river flowed. Time can only be caught while you sit.',
    '반계 강가에 오신 걸 환영해요. 바위 하나 비워 두었어요.': "Welcome to Still Water Riverbank. I've saved you a rock.",

    // 머리말
    '미끼 없는 곧은 바늘로 세월을 낚는 강가. 숨 한 번에 하루가 흐르고, 십 년을 버티면 왕이 찾아옵니다.': 'A riverbank where you fish for time with a straight, baitless hook. One breath is one day, and if you last ten years, a king comes.',
    '물고기는 안 잡혀요. 곧은 바늘로 세월만 낚는 강가.': 'No fish get caught. A riverbank where you fish only for time.',
    '해질녘 강가에 삿갓 쓴 낚시꾼들이 앉아 있고, 노루와 토끼가 곁을 지나간다': 'Anglers in straw hats sit by the river at dusk as a deer and a rabbit pass by'
  };
  // 이름은 꾸밈말 + 이름말을 따로 옮긴다 (이름말 '백로'는 절기 '백로'와 겹친다)
  const ADJ = { '느긋한': 'Easygoing', '졸린': 'Sleepy', '멍때리는': 'Spaced-out', '한가한': 'Idle', '수염 긴': 'Long-bearded', '말 없는': 'Quiet', '배부른': 'Well-fed', '꾸벅꾸벅': 'Nodding', '콧노래 부르는': 'Humming', '기다리는': 'Waiting', '허허 웃는': 'Chuckling', '무념무상': 'Serene', '조용한': 'Silent', '게으른': 'Lazy', '흔들리지 않는': 'Unshaken', '세월 좋은': 'Carefree' };
  const NOUN = { '백로': 'Egret', '잉어': 'Carp', '두루미': 'Crane', '거북이': 'Turtle', '강태공': 'Angler', '버들치': 'Minnow', '물총새': 'Kingfisher', '왜가리': 'Heron', '송사리': 'Killifish', '메기': 'Catfish', '청둥오리': 'Mallard', '수달': 'Otter', '붕어': 'Goldfish', '뱃사공': 'Ferryman', '나룻배': 'Ferryboat', '조약돌': 'Pebble' };
  const ORD = { '첫': 1, '두': 2, '세': 3, '네': 4, '다섯': 5, '여섯': 6, '일곱': 7, '여덟': 8, '아홉': 9, '열': 10 };
  const nth = n => n + (n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th');
  const pl = (n, w) => `${n} ${w}${n == 1 ? '' : 's'}`;
  const dur = s => s
    .replace(/(\d+)년 (\d+)개월 (\d+)일/g, (_, y, m, d) => `${pl(y, 'yr')} ${pl(m, 'mo')} ${pl(d, 'day')}`)
    .replace(/(\d+)년 (\d+)개월/g, (_, y, m) => `${pl(y, 'yr')} ${pl(m, 'mo')}`)
    .replace(/(\d+)개월 (\d+)일/g, (_, m, d) => `${pl(m, 'mo')} ${pl(d, 'day')}`)
    .replace(/(\d+)일(?=$|[ ·을째.])/g, (_, d) => pl(d, 'day'));
  const P = [
    [/^(.+) \(나\)$/, m => `${t(m[1])} (you)`],
    [/^강태공 (\d+)$/, m => `Angler ${m[1]}`],
    [/^(?:(첫|두|세|네|다섯|여섯|일곱|여덟|아홉|열) |(\d+))번째 찾아오셨구려\. 오늘도 평안하시오$/, m => `Your ${nth(m[1] ? ORD[m[1]] : +m[2])} visit. Be at peace today`],
    [/^오늘은 (.+)\((.+)\)\. (.+)$/, m => `Today is ${t(m[1])} (${m[2]}). ${t(m[3])}`],
    [/^‘(.+)’ 등불을 강에 띄웠어요\. 바람이 이뤄지길\.$/, m => `You floated a lantern of '${t(m[1])}' down the river. May it come true.`],
    [/^돌 하나를 얹었어요\. ([\d,]+)번째 돌이에요\. 당신의 소원이 이뤄지길 바랍니다\.$/, m => `You placed a stone, number ${m[1]}. May your wish come true.`],
    [/^오랜 벗 (.+)[을를] 만났어요 · (\d+)\/9$/, m => `You met an old friend, the ${t(m[1])} · ${m[2]}/9`],
    [/^(.+) 보름달이 떴구려$/, m => `The ${t(m[1])} moon is up`],
    [/^(.+) 보름달이 떴어요$/, m => `The ${t(m[1])} moon is up`],
    [/^(봄|여름|가을|겨울)[이을] (왔어요|통째로 낚았어요\. 물고기는 여전히 한 마리도 없어요\.)$/, m => m[2] === '왔어요' ? `${t(m[1])} has come` : `You caught a whole ${t(m[1]).toLowerCase()}. Still not a single fish.`],
    [/^장부에 적은 세월 (.+)$/, m => `Recorded ${m[1]}`],
    [/^이번에 적은 세월 (.+)$/, m => `Recorded this time: ${m[1]}`],
    [/^반계 강가에서 곧은 바늘로 세월 (.+)을 낚아 장부에 적었다\. 조과: (.+)\.$/, m => `On Still Water Riverbank, I caught ${m[1]} of time on a straight hook and wrote it in the ledger. Catch: ${t(m[2])}.`],
    [/^반계 강가에서 (.+)째 세월을 낚는 중이에요\. 바위 하나 비워 둘게요\.$/, m => `I've been fishing for time on Still Water Riverbank for ${m[1]}. I'll save you a rock.`],
    [/^덕담 · (.+)\((.+)\) — (.+)$/, m => `Blessing · ${t(m[1])} (${m[2]}) — ${t(m[3])}`],
    [/^조과\(釣果\) · (.+)$/, m => `Catch (釣果) · ${t(m[1])}`],
    [/^세월카드-(\d+) days?\.png$/, m => `fishing-for-time-card-${m[1]}days.png`],
    [/^(.+)님께 차 한잔을 건넸어요$/, m => `You offered ${t(m[1])} a cup of tea`],
    [/^(.+)님이 차 한잔을 건넸어요$/, m => `${t(m[1])} offered you a cup of tea`],
    [/^(.+)님이 차를 받고 고개 숙여 고마워해요$/, m => `${t(m[1])} took the tea and bowed in thanks`],
    [/^강 건너에서 (.+)님이 손을 흔들어요$/, m => `${t(m[1])} is waving from across the river`]
  ];
  const cache = new Map(), miss = new Set();
  function name(s) {
    const w = s.split(' ');
    for (let i = 1; i < w.length; i++) {
      const a = w.slice(0, i).join(' '), b = w.slice(i).join(' ');
      if (ADJ[a] && NOUN[b]) return `${ADJ[a]} ${NOUN[b]}`;
    }
    return null;
  }
  function t(s) {
    if (typeof s !== 'string' || !HAN.test(s)) return s;
    if (cache.has(s)) return cache.get(s);
    const core = s.trim();
    if (core !== s) { const r = s.replace(core, t(core)); cache.set(s, r); return r; }
    const d = dur(s);
    let r = D[d];
    if (r == null) for (const [re, f] of P) { const m = d.match(re); if (m) { r = f(m); break; } }
    if (r == null) r = name(d);
    if (r == null && d.includes(' · ')) r = d.split(' · ').map(t).join(' · ');
    if (r == null) { const w = d.split(' '); if (w.length > 1 && w.every(x => D[x] || !HAN.test(x))) r = w.map(x => D[x] || x).join(' '); }
    if (r == null && !HAN.test(d)) r = d;
    if (r == null) { r = s; miss.add(s); }
    if (cache.size < 4000) cache.set(s, r);
    return r;
  }
  window.SEWOL_T = t; window.SEWOL_MISS = miss;

  // 화면에 닿는 글 — 글자 마디와 몇 가지 속성
  const ATTRS = ['aria-label', 'title', 'placeholder', 'alt'];
  const fixText = n => { const pe = n.parentNode; if (pe && (pe.nodeName === 'SCRIPT' || pe.nodeName === 'STYLE')) return; if (HAN.test(n.data)) { const r = t(n.data); if (r !== n.data) n.data = r; } };
  const fixEl = el => { for (const a of ATTRS) { const v = el.getAttribute && el.getAttribute(a); if (v && HAN.test(v)) el.setAttribute(a, t(v)); } };
  const walk = root => {
    if (root.nodeType === 3) return fixText(root);
    if (root.nodeType !== 1 || root.tagName === 'SCRIPT' || root.tagName === 'STYLE') return;
    fixEl(root);
    const it = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, { acceptNode: n => n.nodeType === 1 && (n.tagName === 'SCRIPT' || n.tagName === 'STYLE') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    for (let n = it.nextNode(); n; n = it.nextNode()) n.nodeType === 3 ? fixText(n) : fixEl(n);
  };
  new MutationObserver(list => {
    for (const m of list) {
      if (m.type === 'characterData') fixText(m.target);
      else if (m.type === 'attributes') fixEl(m.target);
      else m.addedNodes.forEach(walk);
    }
  }).observe(document.documentElement, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  walk(document.documentElement);
  document.addEventListener('DOMContentLoaded', () => walk(document.documentElement));

  // 캔버스(세월 카드)에 그리는 글
  const C2 = CanvasRenderingContext2D.prototype, fill = C2.fillText, meas = C2.measureText;
  const tc = s => (s = String(s), s.length > 2 ? t(s) : s); // 소원등에 쓰는 한두 글자는 붓글씨 그대로
  C2.fillText = function (s, ...a) { return fill.call(this, tc(s), ...a); };
  C2.measureText = function (s) { return meas.call(this, tc(s)); };
  // 공유·복사로 나가는 글
  const ta = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value');
  Object.defineProperty(HTMLTextAreaElement.prototype, 'value', { get: ta.get, set(v) { ta.set.call(this, t(v)); }, configurable: true });
  if (navigator.share) { const sh = navigator.share.bind(navigator); navigator.share = o => sh({ ...o, title: t(o.title), text: t(o.text) }); }
  if (navigator.clipboard && navigator.clipboard.writeText) { const wt = navigator.clipboard.writeText.bind(navigator.clipboard); navigator.clipboard.writeText = s => { const i = s.lastIndexOf(' http'); return wt(i > 0 ? t(s.slice(0, i)) + s.slice(i) : t(s)); }; }
  const OF = window.File; window.File = function (bits, nm, o) { return new OF(bits, t(nm), o); }; window.File.prototype = OF.prototype;
})();
