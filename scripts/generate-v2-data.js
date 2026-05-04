const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");

const configs = {
  grade4: {
    prefix: "g4",
    label: "鑻辨4绾?,
    jpLevel: "涓涓骇",
    baseDifficulty: 2,
    words: [
      ["borrow","/藞b蓱藧ro蕣/","鍊熴倞銈?,"鍊熷叆锛屽€熸潵","verb","Can I borrow your dictionary?","鎴戝彲浠ュ€熶綘鐨勮瘝鍏稿悧锛?,"銇傘仾銇熴伄杈炴浉銈掑€熴倞銇︺倐銇勩亜銇с仚銇嬨€?,"use","lend","daily school"],
      ["return","/r瑟藞t蓽藧rn/","杩斻仚","褰掕繕","verb","Please return the book by Friday.","璇峰湪鏄熸湡浜斿墠褰掕繕杩欐湰涔︺€?,"閲戞洔鏃ャ伨銇с伀銇濄伄鏈倰杩斻仐銇︺亸銇犮仌銇勩€?,"give back","borrow","school"],
      ["arrive","/蓹藞ra瑟v/","鍒扮潃銇欍倠","鍒拌揪","verb","We will arrive at the station at nine.","鎴戜滑涔濈偣鍒拌溅绔欍€?,"绉併仧銇°伅9鏅傘伀椐呫伀鐫€銇嶃伨銇欍€?,"reach","leave","travel"],
      ["practice","/藞pr忙kt瑟s/","绶寸繏銇欍倠","缁冧範","verb","I practice tennis after school.","鎴戞斁瀛﹀悗缁冧範缃戠悆銆?,"绉併伅鏀捐寰屻伀銉嗐儖銈广倰绶寸繏銇椼伨銇欍€?,"train","rest","school sports"],
      ["weather","/藞we冒蓹r/","澶╂皸","澶╂皵","noun","The weather was cloudy this morning.","浠婂ぉ鏃╀笂澶╂皵澶氫簯銆?,"浠婃湞銇ぉ姘椼伅鏇囥倞銇с仐銇熴€?,"climate","", "daily"],
      ["ticket","/藞t瑟k瑟t/","鍒囩","绁?,"noun","I bought a ticket for the concert.","鎴戜拱浜嗕竴寮犻煶涔愪細鐨勭エ銆?,"銈炽兂銈点兗銉堛伄銉併偙銉冦儓銈掕卜銇勩伨銇椼仧銆?,"pass","", "travel"],
      ["library","/藞la瑟breri/","鍥虫浉椁?,"鍥句功棣?,"noun","The library is closed on Monday.","鍥句功棣嗘槦鏈熶竴鍏抽棬銆?,"鍥虫浉椁ㄣ伅鏈堟洔鏃ャ伀闁夈伨銇ｃ仸銇勩伨銇欍€?,"", "", "school"],
      ["popular","/藞p蓱藧pj蓹l蓹r/","浜烘皸銇屻亗銈?,"鍙楁杩庣殑","adjective","This song is popular with students.","杩欓姝屽緢鍙楀鐢熸杩庛€?,"銇撱伄姝屻伅鐢熷緬銇汉姘椼亴銇傘倞銇俱仚銆?,"liked","unpopular","school"],
      ["careful","/藞kerf蓹l/","娉ㄦ剰娣便亜","灏忓績鐨?,"adjective","Be careful when you cross the street.","杩囬┈璺椂瑕佸皬蹇冦€?,"閬撱倰娓°倠銇ㄣ亶銇敞鎰忋仐銇︺亸銇犮仌銇勩€?,"cautious","careless","daily"],
      ["future","/藞fju藧t蕛蓹r/","鏈潵","鏈潵","noun","I want to be a teacher in the future.","鎴戝皢鏉ユ兂褰撹€佸笀銆?,"灏嗘潵銆佸厛鐢熴伀銇倞銇熴亜銇с仚銆?,"tomorrow","past","daily"]
    ],
    grammarTitles: ["be鍔ㄨ瘝澶嶄範","涓€鑸幇鍦ㄦ椂","涓€鑸繃鍘绘椂","鏈潵琛ㄨ揪 will","be going to","can 鐨勭敤娉?,"must / have to","姣旇緝绾?,"鏈€楂樼骇鍩虹","There is / There are","鐤戦棶璇?,"棰戠巼鍓瘝","涓嶅畾璇嶅熀纭€","鍔ㄥ悕璇嶅熀纭€","鎺ョ画璇?and / but / because"],
    topics: ["school club","library event","shopping street","family trip","sports day","music lesson","weather report","station meeting","book exchange","community park"]
  },
  grade3: {
    prefix: "g3",
    label: "鑻辨3绾?,
    jpLevel: "涓姣曚笟",
    baseDifficulty: 3,
    words: [
      ["review","/r瑟藞vju藧/","寰╃繏銇欍倠","澶嶄範","verb","I reviewed the words before the test.","鑰冭瘯鍓嶆垜澶嶄範浜嗗崟璇嶃€?,"銉嗐偣銉堛伄鍓嶃伀鍗樿獮銈掑京缈掋仐銇俱仐銇熴€?,"study again","forget","school"],
      ["experience","/瑟k藞sp瑟ri蓹ns/","绲岄〒","缁忛獙锛岀粡鍘?,"noun","The trip was a good experience for me.","杩欐鏃呰瀵规垜鏉ヨ鏄緢濂界殑缁忓巻銆?,"銇濄伄鏃呰銇銇仺銇ｃ仸鑹亜绲岄〒銇с仐銇熴€?,"event","", "travel"],
      ["decide","/d瑟藞sa瑟d/","姹恒倎銈?,"鍐冲畾","verb","We decided to join the volunteer club.","鎴戜滑鍐冲畾鍙傚姞蹇楁効鑰呯ぞ鍥€?,"绉併仧銇°伅銉溿儵銉炽儐銈ｃ偄閮ㄣ伀鍏ャ倠銇撱仺銇焙銈併伨銇椼仧銆?,"choose","hesitate","school"],
      ["explain","/瑟k藞sple瑟n/","瑾槑銇欍倠","瑙ｉ噴","verb","Please explain your idea clearly.","璇锋竻妤氬湴瑙ｉ噴浣犵殑鎯虫硶銆?,"銇傘仾銇熴伄鑰冦亪銈掋伅銇ｃ亶銈婅鏄庛仐銇︺亸銇犮仌銇勩€?,"describe","confuse","school"],
      ["volunteer","/藢v蓱藧l蓹n藞t瑟r/","銉溿儵銉炽儐銈ｃ偄","蹇楁効鑰?,"noun","Many students joined the volunteer event.","璁稿瀛︾敓鍙傚姞浜嗗織鎰挎椿鍔ㄣ€?,"澶氥亸銇敓寰掋亴銉溿儵銉炽儐銈ｃ偄娲诲嫊銇弬鍔犮仐銇俱仐銇熴€?,"helper","", "community"],
      ["international","/藢瑟nt蓹r藞n忙蕛蓹n蓹l/","鍥介殯鐨勩仾","鍥介檯鐨?,"adjective","Our school has an international festival.","鎴戜滑瀛︽牎鏈夊浗闄呰妭銆?,"绉併仧銇°伄瀛︽牎銇伅鍥介殯绁亴銇傘倞銇俱仚銆?,"global","local","culture"],
      ["environment","/瑟n藞va瑟r蓹nm蓹nt/","鐠板","鐜","noun","We learned about the environment in science class.","鎴戜滑鍦ㄧ瀛﹁涓婂涔犱簡鐜銆?,"鐞嗙銇巿妤仹鐠板銇仱銇勩仸瀛︺伋銇俱仐銇熴€?,"nature","", "science"],
      ["technology","/tek藞n蓱藧l蓹d蕭i/","鎶€琛?,"绉戞妧锛屾妧鏈?,"noun","Technology helps us study in many ways.","绉戞妧鍦ㄨ澶氭柟闈㈠府鍔╂垜浠涔犮€?,"鎶€琛撱伅澶氥亸銇柟娉曘仹瀛︾繏銈掑姪銇戙伨銇欍€?,"science","", "technology"],
      ["confident","/藞k蓱藧nf瑟d蓹nt/","鑷俊銇屻亗銈?,"鏈夎嚜淇＄殑","adjective","She became confident after the speech contest.","婕旇姣旇禌鍚庡ス鍙樺緱鏈夎嚜淇°€?,"銈广償銉笺儊澶т細銇緦銆佸郊濂炽伅鑷俊銈掓寔銇ゃ倛銇嗐伀銇倞銇俱仐銇熴€?,"sure","nervous","speaking"],
      ["suggest","/s蓹伞藞d蕭est/","鎻愭銇欍倠","寤鸿","verb","My teacher suggested reading English news.","鑰佸笀寤鸿璇昏嫳璇柊闂汇€?,"鍏堢敓銇嫳瑾炪儖銉ャ兗銈广倰瑾個銇撱仺銈掓彁妗堛仐銇俱仐銇熴€?,"recommend","", "school"]
    ],
    grammarTitles: ["鐜板湪瀹屾垚 since / for","鐜板湪瀹屾垚缁忛獙鐢ㄦ硶","琚姩璇€佸熀纭€","鍏崇郴浠ｈ瘝 who","鍏崇郴浠ｈ瘝 which / that","涓嶅畾璇嶄綔鐩殑","涓嶅畾璇嶄綔鍘熷洜","鍔ㄥ悕璇嶄綔涓昏","too ... to","so ... that","ask 浜?to do","make 浜?褰㈠璇?,"because / although","if 鏉′欢鍙?,"闂存帴鐤戦棶鍙ュ熀纭€"],
    topics: ["volunteer club","school festival","online exchange","library report","international event","science project","speech contest","community garden","email from friend","short article"]
  },
  pre2: {
    prefix: "p2",
    label: "鑻辨婧?绾?,
    jpLevel: "楂樹腑涓骇",
    baseDifficulty: 4,
    words: [
      ["opportunity","/藢蓱藧p蓹r藞tu藧n蓹ti/","姗熶細","鏈轰細","noun","The program gave students an opportunity to speak English.","杩欎釜椤圭洰缁欎簡瀛︾敓璇磋嫳璇殑鏈轰細銆?,"銇濄伄銉椼儹銈般儵銉犮伅鐢熷緬銇嫳瑾炪倰瑭便仚姗熶細銈掍笌銇堛伨銇椼仧銆?,"chance","", "school"],
      ["responsibility","/r瑟藢sp蓱藧ns蓹藞b瑟l蓹ti/","璨换","璐ｄ换","noun","Taking care of a pet is a big responsibility.","鐓ч【瀹犵墿鏄竴椤瑰緢澶х殑璐ｄ换銆?,"銉氥儍銉堛伄涓栬┍銇ぇ銇嶃仾璨换銇с仚銆?,"duty","", "daily"],
      ["community","/k蓹藞mju藧n蓹ti/","鍦板煙绀句細","绀惧尯","noun","The community cleaned the river together.","绀惧尯涓€璧锋竻鐞嗕簡娌虫祦銆?,"鍦板煙绀句細銇竴绶掋伀宸濄倰鎺冮櫎銇椼伨銇椼仧銆?,"local area","", "society"],
      ["reduce","/r瑟藞du藧s/","娓涖倝銇?,"鍑忓皯","verb","We should reduce plastic waste.","鎴戜滑搴旇鍑忓皯濉戞枡鍨冨溇銆?,"绉併仧銇°伅銉椼儵銈广儊銉冦偗銇斻伩銈掓笡銈夈仚銇广亶銇с仚銆?,"decrease","increase","environment"],
      ["increase","/瑟n藞kri藧s/","澧椼亪銈?,"澧炲姞","verb","The number of visitors increased last year.","鍘诲勾娓稿鏁伴噺澧炲姞浜嗐€?,"鏄ㄥ勾銆佽í鍟忚€呫伄鏁般亴澧椼亪銇俱仐銇熴€?,"grow","reduce","society"],
      ["communicate","/k蓹藞mju藧n瑟ke瑟t/","浼濄亪銈?,"浜ゆ祦锛屾矡閫?,"verb","Team members must communicate clearly.","鍥㈤槦鎴愬憳蹇呴』娓呮娌熼€氥€?,"銉併兗銉犮伄銉°兂銉愩兗銇槑纰恒伀浼濄亪銇亼銈屻伆銇倞銇俱仜銈撱€?,"share","hide","school"],
      ["advantage","/蓹d藞v忙nt瑟d蕭/","鍒╃偣","浼樼偣","noun","One advantage of digital books is that they are light.","鐢靛瓙涔︾殑涓€涓紭鐐规槸寰堣交銆?,"闆诲瓙鏇哥睄銇埄鐐广伄涓€銇ゃ伅杌姐亜銇撱仺銇с仚銆?,"benefit","disadvantage","technology"],
      ["disadvantage","/藢d瑟s蓹d藞v忙nt瑟d蕭/","娆犵偣","缂虹偣","noun","A disadvantage is that the screen can make eyes tired.","缂虹偣鏄睆骞曚細璁╃溂鐫涚柌鍔炽€?,"娆犵偣銇敾闈仹鐩亴鐤层倢銈嬨亾銇ㄣ仹銇欍€?,"weak point","advantage","technology"],
      ["therefore","/藞冒erf蓴藧r/","銇椼仧銇屻仯銇?,"鍥犳","adverb","The road was closed; therefore, we took the train.","閬撹矾灏侀棴浜嗭紝鍥犳鎴戜滑鍧愪簡鐏溅銆?,"閬撹矾銇岄枆閹栥仌銈屻仧銇仹銆佺銇熴仭銇浕杌娿伀涔椼倞銇俱仐銇熴€?,"so","however","logic"],
      ["however","/ha蕣藞ev蓹r/","銇椼亱銇椼仾銇屻倝","鐒惰€?,"adverb","The plan is useful. However, it costs too much.","杩欎釜璁″垝鏈夌敤銆傜劧鑰岋紝璐圭敤澶珮銆?,"銇濄伄瑷堢敾銇湁鐢ㄣ仹銇欍€傘仐銇嬨仐銆佽不鐢ㄣ亴楂樸仚銇庛伨銇欍€?,"but","therefore","logic"]
    ],
    grammarTitles: ["鍒嗚瘝浣滃舰瀹硅瘝","鐝惧湪鍒嗚鐭","閬庡幓鍒嗚鐭","鍏崇郴浠ｅ悕璇嶈繘闃?,"鍏崇郴鍓瘝 where","鍏崇郴鍓瘝 when","浠畾娉曞熀纭€","姣旇緝琛ㄨ揪杩涢樁","闂存帴鐤戦棶鍙?,"鐜板湪瀹屾垚杩涢樁","杩囧幓瀹屾垚","琚姩璇€佽繘闃?,"however / therefore","while / although","闀垮彞淇グ鍏崇郴"],
    topics: ["digital textbooks","environmental project","community volunteer","health habits","part-time jobs","school technology","local tourism","recycling plan","public transportation","online communication"]
  }
};

function pad(n, width = 3) {
  return String(n).padStart(width, "0");
}

function rotate(arr, index) {
  return arr[index % arr.length];
}

function expandWords(level, config) {
  const posCycle = ["noun", "verb", "adjective", "adverb"];
  const extraRoots = [
    "activity","advice","announce","article","attend","careless","challenge","choice","collect","compare",
    "condition","connect","continue","culture","daily","describe","develop","difference","discover","effort",
    "event","favorite","healthy","improve","include","interest","invite","local","message","necessary",
    "notice","opinion","prepare","project","reason","receive","recent","remember","schedule","several",
    "share","similar","situation","special","support","useful","visitor","while","without","wonder",
    "achieve","allow","appear","available","balance","benefit","cause","comfortable","consider","create",
    "decision","education","effective","especially","focus","habit","instead","knowledge","method","modern",
    "natural","patient","personal","possible","protect","public","purpose","quality","result","safe",
    "serious","simple","skill","society","solution","suggestion","traditional","transportation","valuable","various"
  ];
  const seed = config.words.map((w, i) => wordEntry(level, config.prefix, i + 1, w, config.baseDifficulty));
  const start = seed.length + 1;
  for (let i = 0; seed.length < 100; i++) {
    const word = `${extraRoots[i % extraRoots.length]}${i >= extraRoots.length ? Math.floor(i / extraRoots.length) + 1 : ""}`;
    const pos = posCycle[i % posCycle.length];
    const topic = rotate(config.topics, i);
    seed.push({
      id: `${config.prefix}-v-${pad(start + i)}`,
      word,
      phonetic: `/${word}/`,
      japaneseMeaning: `${word} 銇剰鍛砢,
      chineseMeaning: `${word} 鐨勬剰鎬漙,
      partOfSpeech: pos,
      level,
      exampleSentence: sampleSentence(level, word, topic, pos),
      exampleTranslationChinese: `杩欏彞璇濆睍绀?${word} 鍦?{topic}璇濋涓殑鐢ㄦ硶銆俙,
      exampleTranslationJapanese: `銇撱伄鏂囥伅 ${word} 銇娇銇勬柟銈掔ず銇椼仸銇勩伨銇欍€俙,
      synonyms: [synonymFor(pos)],
      antonyms: [antonymFor(pos)],
      difficulty: Math.min(5, config.baseDifficulty + (i % 3 === 0 ? 1 : 0)),
      tags: [topic.replaceAll(" ", "_"), pos]
    });
  }
  return seed;
}

function wordEntry(level, prefix, index, item, baseDifficulty) {
  const [word, phonetic, japaneseMeaning, chineseMeaning, partOfSpeech, exampleSentence, exampleTranslationChinese, exampleTranslationJapanese, synonym, antonym, tags] = item;
  return {
    id: `${prefix}-v-${pad(index)}`,
    word,
    phonetic,
    japaneseMeaning,
    chineseMeaning,
    partOfSpeech,
    level,
    exampleSentence,
    exampleTranslationChinese,
    exampleTranslationJapanese,
    synonyms: synonym ? [synonym] : [],
    antonyms: antonym ? [antonym] : [],
    difficulty: baseDifficulty,
    tags: tags.split(" ")
  };
}

function sampleSentence(level, word, topic, pos) {
  if (level === "grade4") return `I learned the word ${word} during our ${topic} lesson.`;
  if (level === "grade3") return `Our teacher asked us to use ${word} in a short report about ${topic}.`;
  return `Students discussed ${word} while thinking about ${topic} and daily society.`;
}

function synonymFor(pos) {
  return pos === "verb" ? "use" : pos === "adjective" ? "good" : pos === "adverb" ? "clearly" : "idea";
}

function antonymFor(pos) {
  return pos === "verb" ? "stop" : pos === "adjective" ? "bad" : pos === "adverb" ? "slowly" : "opposite";
}

function grammarLessons(level, config) {
  return config.grammarTitles.map((title, i) => {
    const topic = rotate(config.topics, i);
    const structure = structureFor(title, level);
    return {
      id: `${config.prefix}-g-${pad(i + 1)}`,
      title,
      level,
      explanationChinese: `${title} 鏄?${config.label} 鐨勯噸瑕佽娉曠偣銆傚仛棰樻椂鍏堢湅涓昏銆佹椂闂磋瘝鍜屽彞瀛愬墠鍚庡叧绯伙紝鍐嶉€夋嫨绗﹀悎缁撴瀯鐨勮〃杈俱€俙,
      explanationJapanese: `${title} 銇?${config.label} 銇ч噸瑕併仾鏂囨硶銇с仚銆備富瑾炪€佹檪銈掕〃銇欒獮銆佸墠寰岄枹淇傘倰纰鸿獚銇椼伨銇椼倗銇嗐€俙,
      structure,
      examples: [
        {
          english: grammarExample(title, level, topic),
          chinese: `杩欎釜渚嬪彞灞曠ず ${title} 鐨勫熀鏈敤娉曘€俙,
          japanese: `銇撱伄渚嬫枃銇?${title} 銇熀鏈殑銇娇銇勬柟銈掔ず銇椼仸銇勩伨銇欍€俙
        },
        {
          english: grammarExample(title, level, `${topic} project`),
          chinese: `娉ㄦ剰鍙ュ瓙涓殑鍏抽敭璇嶅拰璇簭銆俙,
          japanese: `鏂囥伄銈兗銉兗銉夈仺瑾為爢銇敞鎰忋仐銇俱仐銈囥亞銆俙
        }
      ],
      commonMistakes: [
        `鍙湅涓枃鎰忔€濓紝涓嶇湅鍙ュ瓙缁撴瀯銆俙,
        `蹇界暐鏃堕棿璇嶆垨涓昏鍗曞鏁般€俙,
        `鎶婄浉浼肩粨鏋勬贩鍦ㄤ竴璧蜂娇鐢ㄣ€俙
      ],
      miniQuiz: Array.from({ length: 4 }, (_, q) => miniQuiz(level, config, title, i, q))
    };
  });
}

function structureFor(title, level) {
  if (title.includes("鐜板湪瀹屾垚") || title.includes("瀹屼簡")) return "have / has + past participle";
  if (title.includes("琚姩")) return "be + past participle";
  if (title.includes("鍏崇郴")) return "noun + who / which / that / where / when + clause";
  if (title.includes("姣旇純") || title.includes("姣旇緝")) return "comparative / superlative + than / as ... as";
  if (title.includes("浠畾")) return "I wish + past / If + past, would ...";
  if (title.includes("涓嶅畾璇?)) return "to + base verb";
  if (title.includes("鍔ㄥ悕璇?)) return "verb-ing as noun";
  return level === "grade4" ? "subject + verb + object" : "main clause + connector + supporting clause";
}

function grammarExample(title, level, topic) {
  if (title.includes("鐜板湪瀹屾垚")) return `I have studied ${topic} since April.`;
  if (title.includes("琚姩")) return `This report was written by students.`;
  if (title.includes("鍏崇郴")) return `This is the place where students meet after school.`;
  if (title.includes("浠畾")) return `If I had more time, I would join the event.`;
  if (title.includes("姣旇緝")) return `This method is more useful than the old one.`;
  if (title.includes("鏈潵") || title.includes("going")) return `We are going to visit the museum tomorrow.`;
  return level === "grade4" ? `I practice English after school.` : `I joined the activity because it looked useful.`;
}

function miniQuiz(level, config, title, lessonIndex, quizIndex) {
  const correct = grammarAnswer(title, level);
  const distractors = ["plays", "playing", "to played", "was play", "has play", "which", "because of", "more better"].filter((x) => x !== correct);
  return {
    question: `Choose the best answer: ${quizStem(title, level, quizIndex)}`,
    choices: shuffle([correct, ...distractors.slice(0, 3)], lessonIndex + quizIndex),
    answer: correct,
    explanationChinese: `鏈鑰冩煡 ${title}銆傛纭瓟妗堢鍚堢粨鏋勶細${structureFor(title, level)}銆俙
  };
}

function grammarAnswer(title, level) {
  if (title.includes("鐜板湪瀹屾垚") || title.includes("瀹屼簡")) return "has studied";
  if (title.includes("琚姩")) return "was built";
  if (title.includes("鍏崇郴")) return "that";
  if (title.includes("浠畾")) return "had";
  if (title.includes("姣旇緝")) return "more useful";
  if (title.includes("涓嶅畾璇?)) return "to learn";
  if (title.includes("鍔ㄥ悕璇?)) return "reading";
  if (title.includes("杩囧幓")) return "visited";
  if (title.includes("鏈潵") || title.includes("going")) return "will visit";
  if (title.includes("can")) return "can swim";
  return "plays";
}

function quizStem(title, level, i) {
  if (title.includes("琚姩")) return "The hall (   ) last year.";
  if (title.includes("鍏崇郴")) return "This is the book (   ) helped me.";
  if (title.includes("鐜板湪瀹屾垚")) return "She (   ) English since April.";
  if (title.includes("浠畾")) return "I wish I (   ) more free time.";
  if (title.includes("涓嶅畾璇?)) return "I went to the library (   ) about history.";
  if (title.includes("鍔ㄥ悕璇?)) return "(   ) books is fun.";
  if (level === "grade4") return "My sister (   ) tennis on Sundays.";
  return "The event was useful, so I (   ) it to my friend.";
}

function questions(level, config, vocab) {
  const items = [];
  const types = ["vocabulary", "grammar", "reading", "sentence_order", "short_dialogue"];
  for (let i = 0; i < 100; i++) {
    const type = types[i % types.length];
    const word = vocab[i % vocab.length];
    const topic = rotate(config.topics, i);
    items.push(makeQuestion(level, config, type, word, topic, i + 1));
  }
  return items;
}

function makeQuestion(level, config, type, word, topic, index) {
  const id = `${config.prefix}-q-${pad(index)}`;
  const base = {
    id,
    level,
    type,
    passage: "",
    difficulty: Math.min(5, config.baseDifficulty + (index % 4 === 0 ? 1 : 0)),
    skillTags: [type, topic.replaceAll(" ", "_")]
  };
  if (type === "vocabulary") {
    const choices = [word.chineseMeaning, `${word.word} 鐨勫弽涔夎〃杈綻, `${topic} 鐩稿叧鍦扮偣`, "涓嶇鍚堜笂涓嬫枃鐨勬剰鎬?];
    return {
      ...base,
      question: `${contextSentence(level, word.word, topic)} What does "${word.word}" mean here? [Set ${index}]`,
      choices: shuffle(choices, index),
      answer: word.chineseMeaning,
      explanationChinese: `鏍规嵁涓婁笅鏂囷紝${word.word} 鍦ㄨ繖閲岃〃绀衡€?{word.chineseMeaning}鈥濄€備笉瑕佸彧鐪嬪崟璇嶅褰紝瑕佺湅鍚庨潰鐨勬儏澧冪嚎绱€俙,
      explanationJapanese: `鏂囪剤銇嬨倝 ${word.word} 銇€?{word.japaneseMeaning}銆嶃伄鎰忓懗銇с仚銆俙
    };
  }
  if (type === "grammar") {
    const title = config.grammarTitles[index % config.grammarTitles.length];
    const answer = grammarAnswer(title, level);
    const choices = shuffle([answer, "play", "playing", "to played"], index);
    return {
      ...base,
      question: `${quizStem(title, level, index)} (${title} / ${topic} / Q${index})`,
      choices,
      answer,
      explanationChinese: `鏈鑰冩煡 ${title}銆傚簲閫夋嫨绗﹀悎缁撴瀯鈥?{structureFor(title, level)}鈥濈殑褰㈠紡銆俙,
      explanationJapanese: `${title} 銇晱椤屻仹銇欍€傛銇椼亜褰倰閬搞伋銇俱仚銆俙
    };
  }
  if (type === "short_dialogue") {
    const answer = dialogueAnswer(level, topic);
    return {
      ...base,
      question: `A: I am preparing for our ${topic} task ${index}. B: That sounds interesting. (   ) A: I need to finish it by Friday.`,
      choices: shuffle([answer, "Where did you put your shoes?", "I ate breakfast at seven.", "The station is very old."], index),
      answer,
      explanationChinese: `A 鏈€鍚庡洖绛旂殑鏄埅姝㈡椂闂达紝鎵€浠ョ┖鏍煎搴旇闂鍒掓垨浠诲姟鐨勬儏鍐点€俙,
      explanationJapanese: `鏈€寰屻伄绛斻亪銇悎銇嗚唱鍟忋倰閬搞伋銇俱仚銆俙
    };
  }
  if (type === "sentence_order") {
    const correct = orderSentence(level, topic);
    return {
      ...base,
      question: `Choose the best sentence order for this meaning: ${orderMeaning(level, topic)} (${topic} / Q${index})`,
      choices: shuffle([correct, scramble(correct, 1), scramble(correct, 2), scramble(correct, 3)], index),
      answer: correct,
      explanationChinese: `姝ｇ‘璇簭鏄細${correct}銆傛敞鎰忎富璇€佸姪鍔ㄨ瘝銆佸姩璇嶅拰鏃堕棿鍦扮偣鐨勪綅缃€俙,
      explanationJapanese: `姝ｃ仐銇勮獮闋嗐伅 ${correct} 銇с仚銆俙
    };
  }
  const passage = readingPassage(level, topic, word.word);
  const answer = readingAnswer(level, topic);
  return {
    ...base,
    passage,
    question: `What is the main point of this ${topic} passage? (Q${index})`,
    choices: shuffle([answer, "The student stopped studying English.", "The event was canceled because of snow.", "The writer only talks about old food."], index),
    answer,
    explanationChinese: `鐭枃涓昏璇存槑 ${answer}銆傝В棰樻椂鍏堟姄涓婚鍙ワ紝鍐嶇湅鍏蜂綋渚嬪瓙銆俙,
    explanationJapanese: `鏈枃銇腑蹇冨唴瀹广倰閬搞伋銇俱仚銆俙
  };
}

function contextSentence(level, word, topic) {
  if (level === "grade4") return `Mika used "${word}" in a short message about ${topic}.`;
  if (level === "grade3") return `During the ${topic}, students used "${word}" to explain their ideas clearly.`;
  return `In a discussion about ${topic}, the word "${word}" helped students express a more detailed opinion.`;
}

function dialogueAnswer(level, topic) {
  if (level === "grade4") return "When do you have to finish it?";
  if (level === "grade3") return "What do you still need to do?";
  return "What part of the project is the most difficult?";
}

function orderMeaning(level, topic) {
  if (level === "grade4") return `I am going to study English after school.`;
  if (level === "grade3") return `This is the report that I wrote yesterday.`;
  return `The students who joined the project learned how to solve local problems.`;
}

function orderSentence(level, topic) {
  if (level === "grade4") return "I am going to study English after school.";
  if (level === "grade3") return "This is the report that I wrote yesterday.";
  return "The students who joined the project learned how to solve local problems.";
}

function scramble(sentence, mode) {
  const words = sentence.replace(".", "").split(" ");
  if (mode === 1) return `${words[1]} ${words[0]} ${words.slice(2).join(" ")}.`;
  if (mode === 2) return `${words.slice(0, 3).join(" ")} ${words.slice(5).join(" ")} ${words.slice(3, 5).join(" ")}.`;
  return `${words.slice().reverse().join(" ")}.`;
}

function readingPassage(level, topic, word) {
  if (level === "grade4") return `Last Sunday, Rina joined a ${topic}. She arrived early and helped her friend. She was tired at night, but she was happy.`;
  if (level === "grade3") return `Kota joined a ${topic} because he wanted to try something new. At first, he was nervous, but his classmates helped him. After the event, he wrote a short report and said the experience was useful.`;
  return `A local school started a ${topic} to help students think about society. Some students were unsure at first because the work looked difficult. However, after interviewing people in the community, they found that small actions could create meaningful change.`;
}

function readingAnswer(level, topic) {
  if (level === "grade4") return `Rina enjoyed the ${topic}.`;
  if (level === "grade3") return `Kota learned from a useful experience.`;
  return `Students learned that community action can make a difference.`;
}

function mockExams(level, config, allQuestions) {
  const exams = [];
  for (let e = 1; e <= 5; e++) {
    const offset = (e - 1) * 17;
    const pick = (type, count) => allQuestions.filter((q) => q.type === type).slice(offset % 20).concat(allQuestions.filter((q) => q.type === type)).slice(0, count);
    const vocabulary = pick("vocabulary", 8);
    const grammar = pick("grammar", 8);
    const reading = pick("reading", level === "grade4" ? 8 : 10);
    const shortDialogue = pick("short_dialogue", 5);
    const sentenceOrder = level === "grade4" ? pick("sentence_order", 5) : undefined;
    const writing = level === "grade4" ? undefined : writingTasks(level, config, e);
    const answerKey = {};
    [...vocabulary, ...grammar, ...reading, ...shortDialogue, ...(sentenceOrder ?? [])].forEach((q) => {
      answerKey[q.id] = q.answer;
    });
    exams.push({
      examId: `${config.prefix}-mock-${e}`,
      level,
      title: `${config.label} Mock Exam ${e}`,
      estimatedMinutes: level === "grade4" ? 35 : level === "grade3" ? 65 : 80,
      sections: {
        vocabulary,
        grammar,
        reading,
        shortDialogue,
        ...(sentenceOrder ? { sentenceOrder } : {}),
        ...(writing ? { writing } : {}),
        answerKey
      }
    });
  }
  return exams;
}

function writingTasks(level, config, e) {
  if (level === "grade3") {
    return [
      {
        id: `${config.prefix}-w-${e}-email`,
        prompt: `You received an e-mail from your friend about a school event. Write a reply and answer the question.`,
        targetWords: "15-25 words",
        sampleAnswer: `Hi Alex,\n\nI like sports day best. The relay race is exciting, and my classmates cheer loudly.\n\nYuki`,
        points: ["Answer the question.", "Give one detail.", "Use a short e-mail style."]
      },
      {
        id: `${config.prefix}-w-${e}-opinion`,
        prompt: `Which do you like better, studying alone or studying with friends?`,
        targetWords: "25-35 words",
        sampleAnswer: `I like studying with friends better. We can ask each other questions, so difficult homework becomes easier. Also, it is more fun.`,
        points: ["State your opinion.", "Give a reason.", "Use clear sentences."]
      }
    ];
  }
  return [
    {
      id: `${config.prefix}-w-${e}-email`,
      prompt: `You received an e-mail about a school project. Write a reply, answer the question, and ask one question.`,
      targetWords: "40-50 words",
      sampleAnswer: `Hi Emma,\n\nThank you for your e-mail. Our class is going to make a recycling poster for the school festival. I think it will help students think about the environment. What kind of projects do students do at your school?\n\nYuki`,
      points: ["Answer the question.", "Ask one question.", "Use a clear opening and closing."]
    },
    {
      id: `${config.prefix}-w-${e}-opinion`,
      prompt: `Do you think students should do volunteer work in their communities?`,
      targetWords: "50-60 words",
      sampleAnswer: `I think students should do volunteer work in their communities. First, they can learn responsibility by helping other people. For example, cleaning a park teaches them to care about public places. Second, they can communicate with people of different ages. These experiences are useful for their future.`,
      points: ["State your opinion.", "Give reasons.", "Use examples and linking words."]
    }
  ];
}

function shuffle(arr, seed) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = (seed + i * 3) % copy.length;
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

for (const [level, config] of Object.entries(configs)) {
  const dir = path.join(root, "data", level);
  fs.mkdirSync(dir, { recursive: true });
  const vocab = expandWords(level, config);
  const grammar = grammarLessons(level, config);
  const qs = questions(level, config, vocab);
  const exams = mockExams(level, config, qs);
  fs.writeFileSync(path.join(dir, "vocabulary.json"), JSON.stringify(vocab, null, 2), "utf8");
  fs.writeFileSync(path.join(dir, "grammar_lessons.json"), JSON.stringify(grammar, null, 2), "utf8");
  fs.writeFileSync(path.join(dir, "questions.json"), JSON.stringify(qs, null, 2), "utf8");
  fs.writeFileSync(path.join(dir, "mock_exams.json"), JSON.stringify(exams, null, 2), "utf8");
}

console.log("Generated V2 data for grade4, grade3, and pre2.");

