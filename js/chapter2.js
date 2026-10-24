// 第2章「十八年前の警告」
(() => {
  const d = window.KOEI_GAME_DATA;
  const flagNames = [
    "chapter2Started", "chapter2Clear", "c2_fakePaperChecked",
    "c2_roomUnlocked", "c2_roomSearched", "c2_phoneKnown", "c2_kamiyaContacted",
    "c2_kamiyaHired", "c2_accidentHintKnown", "c2_accidentArticle", "c2_kugaKnown",
    "c2_warning", "c2_soichiroSawWarning", "c2_directContact", "c2_kugaLocated",
    "c2_travelMemoLinked", "c2_fakePaperSolved", "c2_destinationSolved", "c2_reported",
    "c2_shard", "c2_shardRejected", "c2_designHintKnown", "c2_sayaDesignReactionKnown",
    "c2_bookmark", "c2_templeVisited", "c2_kugaMemoRechecked", "c2_fragmentRechecked",
    "c2_travelMemoRechecked", "c2_portWitness", "c2_libraryChecked", "c2_kamiyaNotesFound",
    "c2_hotelStaffMet", "c2_soichiroMet", "c2_librarianMet", "c2_stationWitness",
    "c2_trainDirection", "c2_portWarningKnown", "c2_libraryHint", "c2_sayaHint",
    "c2_templeAccidentRechecked", "c2_potteryOwnerMet", "lakeAccidentHintKnown", "lakeAccidentKnown",
    "soichiroAccidentKnown", "kugaKnown", "kamiyaPhoneKnown", "kamiyaContacted",
    "kamiyaOfficeUnlocked", "designTheftHintKnown", "sayaDesignReactionKnown",
    "travelMemoLinkedToOmiHachiman", "c2_fakePaperPhotoChecked", "c2_travelMemoReconfirmed",
    "lakeBuoyKnown", "otsuPortUnlocked", "otsuPortHintKnown", "c2_photoInspected",
    "telegramAccessKnown", "satsukiNearTelegramKnown",
    "c2_soichiroAccidentTalked", "fragmentMemoKnown", "potteryShardKnown",
    "kamiyaNotesPermissionKnown", "kamiyaNotesKnown", "notShigarakiKnown",
    "satsukiAskedKamiyaKnown", "omiHachimanHintKnown", "travelMemoKnown",
    "kugaWantedSatsukiKnown", "directContactKnown", "fakeTelegramKnown", "c2_ishiyamaderaLeadKnown",
    "c2_fragmentRevisitedAfterLibrary", "c2_roomVisitedOnce", "c2_roomRevisitedAfterLibrary", "c2_reportReturnPromptShown",
    "kugaWarningHintKnown", "warningCopyExistKnown", "warningDocumentKnown", "soichiroSignatureKnown"
  ];
  flagNames.forEach(key => { d.initialFlags[key] ??= false; });
  if (!Array.isArray(d.initialFlags.c2UnlockedLocations)) d.initialFlags.c2UnlockedLocations = [];
  Object.assign(d.initialEvidence, {
    travelMemo:false, potteryShard:false, fragmentMemo:false, oldAccidentArticle:false,
    kugaWarning:false, kamiyaNotes:false, ishiyamaderaBookmark:false
  });
  Object.assign(d.characters, {
    librarian:{name:"司書"}, templeStaff:{name:"寺の人"},
    kamiya:{name:"神谷朔",image:"images/faces/face_kamiya.webp"},
    portReception:{name:"大津港事務所受付",image:"images/faces/face_otsu_port_reception.webp"},
    potteryOwner:{name:"信楽の陶器店主",image:"images/faces/face_pottery_owner.webp"}
  });
  const E=(name,image,description)=>({name,image:`images/evidence/${image}.webp`,description});
  Object.assign(d.evidenceMaster,{
    travelMemo:E("交通メモ","ev_travel_memo","『京都から電車で40分ぐらい』『駅からバス』と記された紗月のメモ。"),
    potteryShard:E("陶器片","ev_pottery_shard","淡い釉薬と模様の一部が残る小さな陶器片。"),
    fragmentMemo:E("断片メモ","ev_fragment_memo","『18年前』『船』『K』とだけ記されたメモの切れ端。"),
    oldAccidentArticle:E("十八年前の事故記事","ev_old_accident_article","琵琶湖の船の事故を報じた古い地方新聞記事。桐生宗一郎と久我清志の名がある。"),
    kugaWarning:E("運航停止の警告文書","ev_kuga_warning","部品交換が終わるまで運航停止を求める社内文書のコピー。"),
    kamiyaNotes:E("神谷の取材メモ","ev_kamiya_notes","紗月からの依頼、灯浮標写真、久我への接触などが記された取材メモ。"),
    ishiyamaderaBookmark:E("石山寺のしおり","ev_ishiyamadera_bookmark","石山寺と記された古いしおり。")
  });
  const spot=(label,bg,sceneId,unlockFlag)=>({label,background:`images/backgrounds/${bg}.webp`,sceneId,links:[],unlockFlag});
  Object.assign(d.movementMap.spots,{
    C2_HOTEL:spot("披露宴受付前","bg_hotel_gift_area","C2_HOTEL","chapter2Started"),
    C2_KIRYUYA:spot("桐生屋・店内","bg_kiryuya_inside","C2_KIRYUYA","c2_fakePaperChecked"),
    C2_ROOM:spot("紗月の部屋","bg_satsuki_room","C2_ROOM","c2_roomUnlocked"),
    C2_PORT:spot("大津港","bg_otsu_port","C2_PORT","otsuPortUnlocked"),
    C2_LIBRARY:spot("図書館・郷土資料コーナー","bg_library_local_archive","C2_LIBRARY","lakeAccidentHintKnown"),
    C2_TEMPLE:spot("石山寺","bg_ishiyamadera","C2_TEMPLE","c2_ishiyamaderaLeadKnown"),
    C2_SHIGARAKI:spot("信楽・陶器店","bg_shigaraki_pottery_shop","C2_SHIGARAKI","c2_shard"),
    C2_KAMIYA:spot("神谷朔の仕事場","bg_kamiya_office","C2_KAMIYA","kamiyaOfficeUnlocked"),
    C2_STATION:spot("京都駅・売店","bg_kyoto_station_shop","C2_STATION","c2_travelMemo")
  });
  const line=narrator=>({narrator});
  const say=(speaker,text)=>({speaker,text});
  const action=(id,label,lines=[],extra={})=>({id,label,lines:lines.map(x=>Array.isArray(x)?say(x[0],x[1]):line(x)),...extra});
  const evidenceAction=(id,label,text,key,flag,extra={})=>{
    const {setFlags={},...rest}=extra;
    return action(id,label,[text],{
      ...rest,setFlags:{[flag]:true,...setFlags},evidence:{[key]:true},
      image:`images/evidence/${({travelMemo:"ev_travel_memo",potteryShard:"ev_pottery_shard",fragmentMemo:"ev_fragment_memo",ishiyamaderaBookmark:"ev_ishiyamadera_bookmark",oldAccidentArticle:"ev_old_accident_article",kugaWarning:"ev_kuga_warning",kamiyaNotes:"ev_kamiya_notes"})[key]}.webp`
    });
  };
  const location=(spotId,location,bg,idleText,commands)=>({type:"location",spotId,location,background:`images/backgrounds/${bg}.webp`,idleText,commands});
  const deduction=(question,choices,correctText,wrongText,requiresAll)=>({
    mode:"deduction",question,choices,correctText,wrongText,requiresAll
  });
  const paperQuiz=deduction("写真付きの紙を祝電に紛れ込ませたのは誰か？",[
    {text:"久我清志",correct:false},{text:"神谷朔",correct:false},{text:"日野沙耶",correct:false},
    {text:"桐生紗月",correct:true,setFlags:{c2_fakePaperSolved:true}}
  ],"紙を用意したのは桐生紗月だと考えられます。","紙が正式な電報ではないこと、祝電に触れられた人物、紗月の調査と久我との連絡を確かめましょう。",["fakeTelegramKnown","telegramAccessKnown","satsukiNearTelegramKnown","satsukiAskedKamiyaKnown","directContactKnown"]);
  paperQuiz.correctLines=[
    ["shichijo","この紙は、正式な電報ではありませんでした。"],
    ["shichijo","紗月さんは披露宴受付付近にいて、祝電に触れられる状況にあった。"],
    ["shichijo","そして、十八年前の事故を自分で調べていた。"],
    ["shichijo","久我さんとも直接連絡を取っていました。"],
    ["shichijo","この紙を祝電に紛れ込ませたのは、紗月さん自身だ。"]
  ];
  const destinationQuiz=deduction("紗月が向かった可能性が最も高い場所は？",[
    {text:"大津",correct:false},{text:"石山寺",correct:false},{text:"信楽",correct:false},
    {text:"近江八幡",correct:true,setFlags:{c2_destinationSolved:true}}
  ],"紗月が向かった可能性が高いのは近江八幡です。","京都駅で得た方面情報、久我の所在地、二人の連絡、交通メモを確認しましょう。",["biwakoLineDirectionKnown","omiHachimanHintKnown","travelMemoLinkedToOmiHachiman","directContactKnown"]);
  destinationQuiz.correctLines=[
    ["shichijo","京都駅では、紗月さんは琵琶湖線方面へ向かった可能性がある。"],
    ["shichijo","久我清志は近江八幡にいる。"],
    ["shichijo","紗月さんと久我は、神谷さんを介さず直接連絡を取っていた。"],
    ["shichijo","そして、紗月さんの交通メモ。"],
    ["shichijo","『京都から電車で40分ぐらい』"],
    ["shichijo","『駅からバス』"],
    ["shichijo","これらを合わせれば、近江八幡へ向かった可能性が高い。"]
  ];
  destinationQuiz.afterLines=[
    ["soichiro","何か分かったんですか。"],
    ["shichijo","いくつか、確認したいことがあります。"],
    ["soichiro","……紗月のことですか。"],
    ["shichijo","ええ。"],
    ["soichiro","紗月は……近江八幡に？"],
    ["shichijo","その可能性が高いです。"],
    ["shichijo","写真付きの紙を用意したのは紗月さんだと考えています。神谷さんを通じて久我さんと連絡を取り、近江八幡へ向かった可能性があります。"],
    ["soichiro","久我に会いに行ったと？"],
    ["shichijo","少なくとも、その可能性を確かめる必要があります。"],
    ["soichiro","そうですか……。紗月は、十八年前のことを自分で確かめようとしているのですね。"],
    ["shichijo","次は久我さん本人に会い、話を聞く必要があります。"]
  ];
  destinationQuiz.afterSetFlags={c2_reported:true};
  paperQuiz.nextQuiz=destinationQuiz;
  const c2FinalRequirements=[...new Set([
    ...paperQuiz.requiresAll,...destinationQuiz.requiresAll,
    "lakeAccidentKnown","c2_warning","c2_soichiroSawWarning","c2_portWarningKnown"
  ])];

  const scenes=d.scenes;
  scenes.OP02={type:"chapter",chapterNumber:2,background:"images/backgrounds/bg_otsu_port.webp",startScene:"C2_HOTEL"};
  scenes.C2_HOTEL=location("C2_HOTEL","披露宴受付前","bg_hotel_gift_area","披露宴会場の受付前。式を終えた後の慌ただしさが残り、祝電や祝いの品が置かれている。",{
    talk:[
      action("soichiro_at_reception","桐生宗一郎",[["shichijo","この写真付きの紙について、心当たりは？"],["soichiro","ありません。"],["shichijo","紗月さんについて、何か分かりましたか。"],["soichiro","いえ……まだ何も。"]],{notFlags:["lakeAccidentKnown","c2_soichiroMet"],setFlags:{c2_soichiroMet:true}}),
      action("soichiro_revisit_before_accident","桐生宗一郎",[["soichiro","今のところ、私から話せることはありません。"]],{requiresAll:["c2_soichiroMet"],notFlags:["lakeAccidentKnown","c2_reportReturnPromptShown"]}),
      action("soichiro_after_accident_at_reception","桐生宗一郎",[["shichijo","十八年前の船事故について調べています。"],["soichiro","……。"],["shichijo","記事に、あなたの名前がありました。"],["soichiro","そうですか。"],["shichijo","事故に関係していた？"],["soichiro","……関係していました。"]],{requiresAll:["lakeAccidentKnown"],notFlags:["c2_soichiroAccidentTalked","c2_reportReturnPromptShown"],setFlags:{c2_soichiroMet:true,c2_soichiroAccidentTalked:true}}),
      action("soichiro_revisit_after_accident","桐生宗一郎",[["soichiro","何か分かったんですか。"],["shichijo","まだ確認したいことがあります。"]],{requiresAll:["lakeAccidentKnown","c2_soichiroAccidentTalked"],notFlags:["c2_reportReturnPromptShown"]}),
      action("soichiro_final_report","桐生宗一郎",[["soichiro","何か分かったんですか。"],["shichijo","いくつか、確認したいことがあります。"],["soichiro","……紗月のことですか。"],["shichijo","ええ。"]],{requiresAll:c2FinalRequirements,notFlags:["c2_reported"],quiz:paperQuiz}),
      action("hotel_staff","ホテル係員",[["shichijo","この祝電には、誰でも触れられたんですか。"],["hotelStaff","誰でも、というわけではありません。"],["hotelStaff","ご家族や新郎新婦、それに準備をしていたスタッフなら近くを通ることはありました。"],["shichijo","紗月さんは？"],["hotelStaff","前の日に、この辺りにいらしたのは覚えています。"]],{setFlags:{c2_hotelStaffMet:true,telegramAccessKnown:true,satsukiNearTelegramKnown:true}})
    ],
    ask:[
      action("paper_origin","写真付きの紙について",["紙は祝電の中に紛れていた。水面に何かが浮いている写真と、『あの日のことを、すべて話してください。』という文面。"],{requiresAll:["telegramFound"],setFlags:{c2_fakePaperChecked:true}}),
      action("soichiro_kuga_at_reception","久我清志について",[["shichijo","久我清志という人物について。"],["soichiro","……。"],["shichijo","知っていますね。"],["soichiro","以前、一緒に仕事をしていた人物です。"]],{requiresAll:["kugaKnown"],notFlags:["c2_reportReturnPromptShown"],setFlags:{c2_soichiroMet:true}}),
      action("soichiro_accident_at_reception","十八年前の事故について",[["shichijo","十八年前の船事故について調べています。"],["soichiro","……。"],["shichijo","記事に、あなたの名前がありました。"],["soichiro","そうですか。"],["shichijo","事故に関係していた？"],["soichiro","……関係していました。"],["shichijo","当時、運航に関わる書類を見ていたんですね。"],["soichiro","久我さんのことも、記事に書かれている以上の話は、まだできません。"]],{requiresAll:["soichiroAccidentKnown"],notFlags:["c2_reportReturnPromptShown"],setFlags:{c2_soichiroMet:true}}),
    ],
    look:[
      action("inspect_buoy_photo","写真を詳しく見る",[["shichijo","湖のようだ。"],["shichijo","水の上に、何か標識のようなものが浮いている。"],["shichijo","ただ、この写真だけでは、どこで撮られたものかは分からない。"]],{requiresAll:["telegramFound","c2_fakePaperChecked"],notFlags:["c2_photoInspected"],setFlags:{c2_fakePaperChecked:true,c2_photoInspected:true},image:"images/evidence/ev_photo_telegram.webp"}),
      action("inspect_buoy_photo_again","写真を見直す",["湖のような水面と、何か標識のようなものが写っている。写真だけでは場所は分からない。"],{requiresAll:["c2_photoInspected"]})
    ],
    search:[action("paper_search","受付周辺を調べる",["正式な電報を示す封筒や受付票は見当たらない。この紙は、通常の祝電とは別に用意されたものかもしれない。"],{setFlags:{c2_fakePaperChecked:true,fakeTelegramKnown:true},once:true})]
  });
  scenes.C2_KIRYUYA=location("C2_KIRYUYA","桐生屋・店内","bg_kiryuya_inside","焼き物や資料が並ぶ、静かな桐生屋の店内。",{
    talk:[
      action("sojiro_talk","宗次郎",[["sojiro","紗月の部屋は、そのままにしてあります。"],["sojiro","何か手掛かりになるなら、調べてください。"]],{notFlags:["c2_roomUnlocked"],setFlags:{c2_roomUnlocked:true},once:true}),
      action("saya_talk_ishiyamadera","最近の紗月について",[["shichijo","最近、紗月さんと何か変わった話をしませんでしたか。"],["saya","変わった話……。"],["saya","……そういえば、石山寺のことを聞かれたことがあります。"],["shichijo","石山寺？"],["saya","ええ。"],["saya","昔、お母さまと行ったことがあるとか。"],["shichijo","それ以外には？"],["saya","詳しいことまでは聞いていません。"],["shichijo","石山寺……。"],["shichijo","今回のことと関係があるのか、一度確かめてみましょう。"],["narrator","石山寺へ行けるようになった。"]],{notFlags:["c2_ishiyamaderaLeadKnown"],setFlags:{c2_sayaHint:true,c2_ishiyamaderaLeadKnown:true}}),
      action("saya_talk_after_lead","日野沙耶",[["saya","紗月は以前、母のことを調べていたみたい。詳しいことは私も知らないわ。"]],{requiresAll:["c2_ishiyamaderaLeadKnown"],notFlags:["c2_sayaHint"],setFlags:{c2_sayaHint:true}})
    ],
    ask:[action("saya_design","デザインについて",[["shichijo","信楽の陶器店で、少し気になる話を聞きました。"],["saya","気になる話？"],["shichijo","最近は、形や模様を真似されることもあるそうですね。"],["saya","……それが？"],["shichijo","桐生屋でも、似たようなことはありませんか。"],["saya","知りません。"]],{requiresAll:["designTheftHintKnown"],setFlags:{sayaDesignReactionKnown:true,c2_sayaDesignReactionKnown:true}})],
    look:[action("shop_display","店内を見る",["棚には産地も作り手も異なる器が並ぶ。ひとつずつ手に取って見比べられる店だ。"])],
  });

  scenes.C2_ROOM=location("C2_ROOM","紗月の部屋","bg_satsuki_room","机や本棚、身の回りの品が残された紗月の部屋。",{
    talk:[],
    ask:[],
    look:[
      action("room_overview","部屋全体を見る",[["shichijo","机、本棚、旅行の資料……。"],["shichijo","何か残っているかもしれない。"]])
    ],
    search:[
      action("search_room_desk","机の上",[
        ["narrator","机の上に、行き先を書き留めたようなメモがある。"],
        ["shichijo","「京都から電車で40分ぐらい」。"],
        ["shichijo","「駅からバス」。"],
        ["shichijo","行き先までは書いていない。"]
      ],{notFlags:["c2_travelMemo"],setFlags:{c2_travelMemo:true,travelMemoKnown:true},evidence:{travelMemo:true},image:"images/evidence/ev_travel_memo.webp"}),
      action("search_room_drawer","引き出し",[
        ["narrator","引き出しの奥に、小さなメモの切れ端が残っている。"],
        ["shichijo","「18年前」「船」「K」……。"],
        ["shichijo","これだけでは、まだ意味は分からない。"]
      ],{notFlags:["c2_fragment"],setFlags:{c2_fragment:true,fragmentMemoKnown:true},evidence:{fragmentMemo:true},image:"images/evidence/ev_fragment_memo.webp"}),
      action("room_bookmark_lead","本棚の本を調べる",[
        ["narrator","本の間から、古いしおりが落ちた。"],
        ["shichijo","石山寺のしおりか。"],
        ["narrator","石山寺へ行けるようになった。"]
      ],{notFlags:["c2_bookmark","c2_ishiyamaderaLeadKnown"],setFlags:{c2_bookmark:true,c2_ishiyamaderaLeadKnown:true},evidence:{ishiyamaderaBookmark:true},image:"images/evidence/ev_ishiyamadera_bookmark.webp"}),
      evidenceAction("room_bookmark_after_lead","本棚の本を調べる","本の間に、石山寺と記された古いしおりが挟まっていた。","ishiyamaderaBookmark","c2_bookmark",{requiresAll:["c2_ishiyamaderaLeadKnown"],notFlags:["c2_bookmark"]}),
      action("room_shard","小物類を調べる",[
        ["narrator","小物の間に、小さな陶器の欠片がある。"],
        ["shichijo","焼き物の欠片か……。"],
        ["shichijo","焼き物といえば、この辺りなら信楽か？"],
        ["shichijo","一度、見てもらう価値はありそうだ。"],
        ["narrator","信楽・陶器店へ行けるようになった。"]
      ],{notFlags:["c2_shard"],setFlags:{c2_shard:true,potteryShardKnown:true},evidence:{potteryShard:true},image:"images/evidence/ev_pottery_shard.webp"}),
      action("recheck_fragment_accident","引き出しのメモを読み直す",[["shichijo","十八年前。"],["shichijo","船。"],["shichijo","事故の記事と同じ言葉が並んでいる。"],["shichijo","紗月さんも、事故のことを調べていたのかもしれない。"]],{requiresAll:["lakeAccidentKnown","c2_fragment","c2_roomRevisitedAfterLibrary"],notFlags:["c2_fragmentRevisitedAfterLibrary"],setFlags:{c2_fragmentRechecked:true,c2_fragmentRevisitedAfterLibrary:true}}),
      action("recheck_k","「K」のメモを読み直す",[["shichijo","K……。"],["shichijo","久我を指している可能性はある。"]],{requiresAll:["kugaKnown","c2_fragmentRechecked"],notFlags:["c2_kugaMemoRechecked"],setFlags:{c2_kugaMemoRechecked:true}}),
      action("recheck_travel","交通メモを読み直す",[["shichijo","京都から電車で40分ぐらい。"],["shichijo","駅からバス。"],["shichijo","久我がいる近江八幡なら、この条件には合う。"],["shichijo","ただ、これだけではまだ断定できない。"]],{requiresAll:["omiHachimanHintKnown","travelMemoKnown"],notFlags:["travelMemoLinkedToOmiHachiman"],setFlags:{c2_travelMemoLinked:true,c2_travelMemoReconfirmed:true,travelMemoLinkedToOmiHachiman:true}}),
      action("find_kamiya_contact","机のメモ類",[
        ["shichijo","もう一度、机の周りを確認してみましょう。"],
        ["narrator","メモを一枚ずつ確認する。"],
        ["narrator","何枚か重なった紙の間に、小さな紙片が挟まっていた。"],
        ["narrator","「神谷　朔」「090-XXXX-XXXX」と書かれている。"],
        ["shichijo","神谷……。"]
      ],{requiresAll:["lakeAccidentKnown","kugaKnown","c2_roomRevisitedAfterLibrary","c2_fragmentRevisitedAfterLibrary"],notFlags:["kamiyaPhoneKnown"],setFlags:{kamiyaPhoneKnown:true,c2_phoneKnown:true}}),
      action("call_kamiya","電話をかける",[["shichijo","もしもし。神谷朔さんでしょうか。"],["kamiya","はい。"],["shichijo","私、七条智門と申します。紗月さんの件でお聞きしたいことがあります。"],["kamiya","……紗月さんの件ですか。"],["shichijo","あなたの名前と電話番号が、紗月さんの部屋に残っていました。"],["kamiya","そうですか。"],["kamiya","電話では話しにくいことがあります。こちらへ来てもらえますか。"]],{requiresAll:["kamiyaPhoneKnown"],notFlags:["kamiyaContacted"],setFlags:{kamiyaContacted:true,kamiyaOfficeUnlocked:true,c2_kamiyaContacted:true}})
    ]
  });
  // 再確認は訪問回数でなく、得た知識によって意味が変わる。

  scenes.C2_PORT=location("C2_PORT","大津港","bg_otsu_port","湖面と岸壁が広がり、船が行き交う大津港。",{
    talk:[action("port_reception","大津港事務所受付",[["shichijo","少しお聞きしたいことがあります。"],["portReception","はい、何でしょう。"]],{notFlags:["c2_portWitness"],setFlags:{c2_portWitness:true}})],
    ask:[
      action("ask_kuga_warning","久我清志について",[["shichijo","久我清志という人について、何か知っていますか。"],["portReception","久我さん……。"],["portReception","名前は覚えていますよ。"],["shichijo","事故の前、ここで働いていた？"],["portReception","ええ。そういえば……事故の前、かなり揉めていたって話がありました。"],["shichijo","揉めていた？"],["portReception","船を出すなって、強く言っていたそうです。"]],{requiresAll:["kugaKnown","c2_portWitness"],setFlags:{kugaWarningHintKnown:true,c2_kugaWarningHintKnown:true,c2_portWarningKnown:true}})
    ],
    look:[action("look_port","港を見渡す",["観光船の桟橋と岸壁。写真に写っているものと同じ場所だとは断定できない。"])],
    search:[action("port_record","掲示資料",["現在の案内に十八年前の運航記録はない。"])]
  });

  scenes.C2_LIBRARY=location("C2_LIBRARY","図書館・郷土資料コーナー","bg_library_local_archive","古い新聞や郷土資料が棚に並ぶ、静かな閲覧室。",{
    talk:[action("librarian","司書に相談",[["librarian","十八年前の地方紙なら、縮刷版をこちらで確認できます。"]],{setFlags:{c2_librarianMet:true}})],
    ask:[action("ask_archive","地方紙の縮刷版について",[["shichijo","十八年前の、この辺りの船事故について調べたいんですが。"],["librarian","十八年前ですね。"],["librarian","その年代でしたら、地方紙の縮刷版があります。"],["shichijo","どこにありますか。"],["librarian","こちらの棚です。"]],{setFlags:{c2_librarianMet:true,c2_libraryHint:true}})],
    look:[action("archive_shelf","郷土資料棚",["当時の地方紙や新聞縮刷版が並んでいる。閲覧できるのは公開されている資料のようだ。"])],
    search:[action("archive_article","地方紙の縮刷版",[
      ["narrator","十八年前の日付を追っていく。"],
      ["narrator","数ページ進めたところで、湖上事故の記事が目に入った。"],
      ["shichijo","……これか。"],
      ["shichijo","……桐生宗一郎。"],
      ["narrator","記事をさらに読み進める。"],
      ["shichijo","久我清志……。"]
    ],{requiresAll:["c2_libraryHint"],notFlags:["c2_accidentArticle"],setFlags:{c2_libraryChecked:true,c2_accidentArticle:true,lakeAccidentKnown:true,soichiroAccidentKnown:true,kugaKnown:true,c2_kugaKnown:true},evidence:{oldAccidentArticle:true},image:"images/evidence/ev_old_accident_article.webp"})]
  });

  scenes.C2_KAMIYA=location("C2_KAMIYA","神谷朔の仕事場","bg_kamiya_office","取材ノートや資料ファイルが机に積まれた、小さな仕事場。",{
    talk:[
      action("kamiya_talk_first","神谷朔",[["kamiya","紗月さんから、少し調べものを頼まれていました。"],["shichijo","どんなことを？"],["kamiya","それについては、本人からどこまで聞いているのか分からないので。"],["kamiya","まず、あなたが何を調べているのか教えてもらえますか。"]],{notFlags:["lakeAccidentKnown","c2_kamiyaFirstVisitDone"],setFlags:{c2_kamiyaHired:true,c2_kamiyaFirstVisitDone:true}}),
      action("kamiya_talk_accident","十八年前の事故について",[["kamiya","紗月さんから、少し調べものを頼まれていました。"],["shichijo","何を調べていたんです？"],["kamiya","あなたは、どこまでご存じですか。"],["shichijo","十八年前の船事故です。"],["kamiya","……そこまで分かっているんですね。"],["kamiya","紗月さんから頼まれたのは、その事故についてです。"],["shichijo","なぜ、その事故を？"],["kamiya","お母さまが何か関係しているようでした。"],["kamiya","ただ、その理由までは話してくれませんでした。"]],{requiresAll:["lakeAccidentKnown"],notFlags:["satsukiAskedKamiyaKnown"],setFlags:{c2_kamiyaHired:true,satsukiAskedKamiyaKnown:true,c2_satsukiAskedKamiyaKnown:true}})
    ],
    ask:[
      action("kamiya_kuga","久我清志について",[["shichijo","記事に久我清志という名前がありました。"],["kamiya","……久我さんですか。"],["shichijo","会ったことが？"],["kamiya","探しました。"],["shichijo","話は聞けましたか。"],["kamiya","最初は、ほとんど。"],["shichijo","最初は？"],["kamiya","詳しい話をするつもりはない、と言われました。"]],{requiresAll:["kugaKnown","c2_kamiyaHired"],setFlags:{c2_kugaFound:true}}),
      action("kamiya_notes_permission","取材ノートについて",[["shichijo","机の上の取材ノートを見てもいいですか。"],["kamiya","ええ。紗月さんから頼まれて調べた時のメモです。"],["kamiya","必要なら、そのメモを見てください。"]],{requiresAll:["c2_kamiyaHired"],notFlags:["kamiyaNotesPermissionKnown"],setFlags:{kamiyaNotesPermissionKnown:true}}),
      action("kamiya_warning_copy","警告文書について",[["shichijo","大津港で、久我さんが事故前に船を出すなと言っていたと聞きました。"],["kamiya","……そこまで聞きましたか。"],["shichijo","本人からも、その話を？"],["kamiya","ええ。"],["kamiya","久我さんは、自分は止めようとした、と言っていました。"],["shichijo","証拠は？"],["kamiya","あります。"],["kamiya","その証拠として、これを見せてくれました。"],["narrator","久我が保管していた警告文書のコピーを手に入れた。"]],{requiresAll:["c2_kugaFound","kugaWarningHintKnown"],notFlags:["warningCopyExistKnown"],setFlags:{c2_warning:true,warningCopyExistKnown:true,warningDocumentKnown:true,soichiroSignatureKnown:true},evidence:{kugaWarning:true},image:"images/evidence/ev_kuga_warning.webp"}),
      action("kamiya_direct_contact","紗月と久我の連絡について",[["kamiya","最初の取材では、それ以上は聞けませんでした。"],["shichijo","では、紗月さんはどうやって久我と連絡を？"],["kamiya","後になって、久我さんから連絡があったんです。"],["shichijo","久我から？"],["kamiya","『紗月本人となら話す』と。"],["shichijo","それで、連絡先を？"],["kamiya","私は久我さんの連絡先を紗月さんに渡しました。その後は二人が直接連絡を取っていました。"]],{requiresAll:["warningCopyExistKnown"],notFlags:["c2_directContact"],setFlags:{c2_directContact:true,kugaWantedSatsukiKnown:true,directContactKnown:true}}),
      action("kamiya_location","久我の居場所について",[["shichijo","久我さんは今、どこに？"],["kamiya","近江八幡です。"],["shichijo","近江八幡……。"]],{requiresAll:["c2_directContact"],setFlags:{c2_kugaLocated:true,omiHachimanHintKnown:true}})
    ],
    look:[action("kamiya_room","仕事場を見る",[["shichijo","机の上に、取材ノートや資料が積まれている。"],["shichijo","かなり調べていたようだ。"]])],
    search:[evidenceAction("kamiya_notes","取材ノート","紗月からの依頼について、神谷が調査した内容が記録されている。久我への接触や取材拒否の経緯も残る。","kamiyaNotes","c2_kamiyaNotesFound",{requiresAll:["kamiyaNotesPermissionKnown"],setFlags:{kamiyaNotesKnown:true}})]
  });

  scenes.C2_SHIGARAKI=location("C2_SHIGARAKI","信楽・陶器店","bg_shigaraki_pottery_shop","棚に器や壺が並ぶ。店主は焼き物を手に取って確かめている。",{
    talk:[action("pottery_owner","店主に話しかける",[["potteryOwner","いらっしゃい。何か見てもらいたいものがありますか。"]],{setFlags:{c2_potteryOwnerMet:true}})],
    ask:[action("pottery_general","最近の焼き物について",[["shichijo","最近の焼き物について、少し聞いてもいいですか。"],["potteryOwner","最近はいろんなものがありますからね。"],["potteryOwner","土地ごとの特徴だけでは分からないものも増えました。"]],{requiresAll:["c2_potteryOwnerMet"]})],
    look:[action("pottery_shelves","器の棚",["皿、鉢、壺。手に取って見比べられるよう、棚は整えられている。"])],
    search:[action("pottery_counter","カウンター",["カウンターの上には、焼き物を確認するための道具や布が置かれている。"],{requiresAll:["c2_shard"]})]
  });

  scenes.C2_TEMPLE=location("C2_TEMPLE","石山寺","bg_ishiyamadera","古い山門の向こうに、静かな参道が続いている。",{
    talk:[action("temple_staff","寺の人に尋ねる",[["templeStaff","何かお探しですか。"],["shichijo","少し、人を捜しています。"]],{setFlags:{c2_templeVisited:true}})],
    ask:[action("temple_sighting","紗月を見かけた人は？",[["shichijo","この女性を見たことはありませんか。"],["templeStaff","最近は……ちょっと分かりませんね。"],["shichijo","以前でも構いません。"],["templeStaff","以前……。"],["templeStaff","ああ。似た方なら、昔見た覚えがあります。"],["shichijo","一人でしたか。"],["templeStaff","いえ。年上の女性と一緒だったと思います。"],["shichijo","母親でしょうか。"],["templeStaff","そうだったかもしれません。"]],{requiresAll:["c2_ishiyamaderaLeadKnown"]}),action("ask_naomi","このしおりについて",[["shichijo","このしおりについて、何か分かりますか。"],["templeStaff","石山寺の古いしおりですね。"]],{requiresAll:["c2_bookmark"]}),action("temple_revisit","紗月の母について",[["shichijo","以前、紗月さんと一緒にいた女性について、もう少し覚えていることはありませんか。"],["templeStaff","詳しいことまでは覚えていません。"],["templeStaff","ただ、親子で来られていたようには見えました。"],["shichijo","何か話していましたか。"],["templeStaff","そこまでは……"],["templeStaff","でも、昔のことを思い出しながら話しているような雰囲気でしたね。"]],{requiresAll:["c2_ishiyamaderaLeadKnown","c2_accidentArticle"],setFlags:{c2_templeAccidentRechecked:true}})],
    look:[action("temple_gate","山門と境内",["古い山門の向こうに、静かな参道が続いている。"])],
    search:[]
  });

  scenes.C2_STATION=location("C2_STATION","京都駅・売店","bg_kyoto_station_shop","人の行き交う京都駅構内の売店。",{
    talk:[action("station_witness","売店の店員",[["shopClerk","急いでいたことは覚えています。在来線改札の方へ向かったように見えました。どの列車かまでは分かりません。"]],{setFlags:{c2_trainDirection:true,c2_stationWitness:true}})],
    ask:[action("station_direction","琵琶湖線方面について",[["shichijo","在来線改札の方へ向かったとのことですが、琵琶湖線方面だった可能性は？"],["shopClerk","そうですね。"],["shopClerk","方向としては、その可能性はあると思います。"],["shichijo","どの列車に乗ったかまでは？"],["shopClerk","そこまでは分かりません。"]],{setFlags:{c2_trainDirection:true}})],
    look:[action("station_concourse","改札方向",["人の流れは在来線改札へ続いている。"])],
    search:[action("station_board","時刻表",["時刻表だけでは乗車した列車を特定できない。"],{setFlags:{c2_trainDirection:true}})]
  });

  // 現地で会った相手だけを「みせる」に出す。第2章のしょうこは一覧確認専用。
  const presentTargets={
    C2_HOTEL:[["hotelStaff","ホテル係員","c2_hotelStaffMet"],["soichiro","桐生宗一郎","c2_soichiroMet"]],
    C2_PORT:[["portReception","大津港事務所受付","c2_portWitness"]],
    C2_SHIGARAKI:[["potteryOwner","信楽の陶器店主","c2_potteryOwnerMet"]],
    C2_KAMIYA:[["kamiya","神谷朔","c2_kamiyaHired"]],
    C2_LIBRARY:[["librarian","司書","c2_librarianMet"]],
    C2_TEMPLE:[["templeStaff","寺の人","c2_templeVisited"]],
    C2_STATION:[["shopClerk","京都駅売店員","c2_stationWitness"]]
  };
  d.chapter2PresentTargets=presentTargets;
  d.chapter2SpotIds=Object.keys(d.movementMap.spots).filter(id=>id.startsWith("C2_"));
  Object.keys(scenes).filter(id=>id.startsWith("C2_")).forEach(id=>{ scenes[id].commands.evidence=[]; });
})();
