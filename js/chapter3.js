// 第3章「港に残された影」— 最新完全指示書に基づく章専用データ
(() => {
  const d = window.KOEI_GAME_DATA;
  const flagNames = [
    "chapter3Started", "chapter3Clear", "c3TaxiDriverMet", "c3TaxiWitnessKnown",
    "c3HachimanboriUnlocked", "c3ShrineUnlocked", "c3KugaApartmentUnlocked",
    "c3KugaRoomEntered", "c3KugaSatsukiAsked", "c3MeetingReasonAsked", "c3AccidentAsked",
    "c3CanalShopkeeperMet", "c3ShrineStaffMet",
    "c3MahoPhotoSeen", "c3MahoAsked", "c3KugaTrustConfirmed", "c3PhoneSeen", "c3LockerKeyHeld",
    "c3ReturnedFromRoom", "c3KugaHasLeftHome", "c3TimeEvening", "c3CanalSatsukiSeen",
    "c3SatsukiAtShrineKnown", "c3ShrineAloneKnown", "c3WomanWaitingKnown", "c3TowardsParkingKnown",
    "c3ParkUnlocked", "c3ParkSurveyDone", "c3ParkScuffFound", "c3ParkTireTracksFound", "c3BloodFound", "c3WhiteNailFound", "c3ParkScuffSeen", "c3ParkTireTracksSeen", "c3BloodSeen", "c3WhiteNailSeen",
    "c3KugaUnreachable", "c3KugaCalledAgain", "c3TimeNight", "c3LockerAreaSearched",
    "c3Locker623Found", "c3LockerOpened", "c3SmallKeyFound", "c3KugaMemoRead",
    "c3NewsArticleRead", "c3InspectionRecordRead", "c3PassbookRead", "c3LockerRecordsReviewed",
    "c3HikonePortUnlocked", "c3BodyConfirmed", "c3EveningTransitionShown"
  ];
  flagNames.forEach(key => { d.initialFlags[key] ??= false; });
  d.initialFlags.c3SchemaVersion = 2;
  if (!Array.isArray(d.initialFlags.c3UnlockedLocations)) d.initialFlags.c3UnlockedLocations = [];
  Object.assign(d.initialEvidence, {
    c3SmallKey: false, c3WhiteNailDecoration: false, c3KugaMemo: false,
    c3NewsArticle: false, c3SteeringInspection: false, c3OldPassbook: false
  });
  Object.assign(d.characters, {
    taxiDriver: { name: "タクシー運転手", image: "images/characters/ch_taxi_driver.webp" },
    canalShopkeeper: { name: "店の人", image: "images/characters/ch_canal_shopkeeper.webp" },
    shrineStaff: { name: "店の人", image: "images/characters/ch_shrine_staff.webp" },
    kuga: { name: "久我清志", image: "images/characters/ch_kuga.webp" }
  });
  Object.assign(d.evidenceMaster, {
    c3SmallKey: { name: "小さな鍵", image: "images/evidence/ev_c3_small_key.png", description: "久我清志から預かった小さな鍵。「623」と書かれた札がついている。" },
    c3WhiteNailDecoration: { name: "白いネイル飾り", image: "images/evidence/ev_c3_satsuki_nail.png", description: "八幡公園駐車場の地面に落ちていた。白い玉状のネイル飾りが2個ある。" },
    c3KugaMemo: { name: "久我のメモ", image: "images/evidence/ev_c3_kuga_memo.png", description: "久我が保管していた、紗月からの連絡について記したメモ。" },
    c3NewsArticle: { name: "十八年前の新聞記事", image: "images/evidence/ev_c3_news_article.png", description: "十八年前の地方紙の記事。琵琶湖の船舶事故と桐生直美の死亡が記されている。" },
    c3SteeringInspection: { name: "操舵系統の点検記録", image: "images/evidence/ev_c3_steering_record.png", description: "久我清志が保管していた船舶点検記録。操舵系統の異常と、修理完了まで出航不可の記載がある。" },
    c3OldPassbook: { name: "古い通帳", image: "images/evidence/ev_c3_old_passbook.png", description: "久我清志名義の古い通帳。十八年前ごろから同じ名義による入金が続く。振込人欄には「キリユウソウ」と印字されている。" }
  });

  const bg = name => `images/backgrounds/${name}.webp`;
  const say = (speaker, text) => ({ speaker, text });
  const narrate = text => ({ narrator: text });
  const action = (id, label, lines = [], extra = {}) => ({ id, label, lines, ...extra });
  const spot = (label, background, sceneId, unlockFlag) => ({ label, background: bg(background), sceneId, links: [], unlockFlag });
  const loc = (spotId, location, background, idleText, commands = {}, extra = {}) => ({ type: "location", spotId, location, background: bg(background), idleText, commands, ...extra });

  Object.assign(d.movementMap.spots, {
    C3_STATION: spot("近江八幡駅", "bg_omi_hachiman_station_day", "C3_STATION_DAY", "chapter3Started"),
    C3_CANAL: spot("八幡堀", "bg_hachimanbori_day", "C3_CANAL_DAY", "c3HachimanboriUnlocked"),
    C3_SHRINE: spot("日牟礼八幡宮", "bg_himure_hachiman_day", "C3_SHRINE_DAY", "c3ShrineUnlocked"),
    C3_APARTMENT: spot("久我のアパート", "bg_kuga_apartment_exterior", "C3_APARTMENT", "c3KugaApartmentUnlocked"),
    C3_PARK: spot("八幡公園駐車場", "bg_hachiman_park_night", "C3_PARK", "c3ParkUnlocked"),
    C3_HIKONE: spot("彦根港", "bg_hikone_port", "C3_HIKONE_ENTRY", "c3HikonePortUnlocked")
  });

  d.scenes.OP03 = { type: "chapter", chapterNumber: 3, background: bg("bg_omi_hachiman_station_day"), startScene: "C3_STATION_DAY" };

  d.scenes.C3_STATION_DAY = loc("C3_STATION", "近江八幡駅・昼", "bg_omi_hachiman_station_day",
    "近江八幡駅。駅前にはバス乗り場とタクシー乗り場がある。", {
      talk: [action("taxi_talk_day", "タクシー運転手", [say("taxiDriver", "ここからなら、バスでも行けますよ。だいたいはみなさんバスに乗るんですけどね。")], { setFlags: { c3TaxiDriverMet: true } })],
      ask: [action("taxi_ask_hachimanbori", "八幡堀について", [say("shichijo", "八幡堀へは、どう行く人が多いんですか。"), say("taxiDriver", "バスでも行けますよ。観光の方は、たいていバスですね。")], { setFlags: { c3TaxiDriverMet: true } })],
      look: [action("station_front", "駅前", [narrate("駅前にはバス乗り場とタクシー乗り場が並んでいる。")]), action("station_bus_stop", "バス乗り場", [narrate("バスを待つ人が列を作っている。")]), action("station_taxi_stand", "タクシー乗り場", [narrate("数台のタクシーが乗客を待っている。")])]
    });
  d.scenes.C3_STATION_NIGHT = loc("C3_STATION", "近江八幡駅・夜", "bg_omi_hachiman_station_night",
    "近江八幡駅。夜の駅前に、街灯の光が落ちている。", {
      look: [action("station_night_view", "駅前", [narrate("昼の人波が引き、駅前は静かになっている。")]), action("station_night_inside", "駅構内", [narrate("改札を行き交う人の姿がある。壁際にはコインロッカーが並んでいる。")])],
      search: [
        action("locker_find_row", "コインロッカー", [narrate("大小のコインロッカーが並んでいる。それぞれに番号がついている。")], { notFlags: ["c3LockerAreaSearched"], setFlags: { c3LockerAreaSearched: true } }),
        action("locker_find_623", "番号を確かめる", [narrate("ロッカーを順に確認していく。623番のロッカーがある。")], { requiresAll: ["c3LockerAreaSearched"], notFlags: ["c3Locker623Found"], setFlags: { c3Locker623Found: true } }),
        action("locker_open_623", "623番のロッカーを調べる", [narrate("七条は久我から預かった鍵を623番のロッカーに差し込んだ。"), narrate("カチッ。ロッカーが開いた。中には封筒や古い通帳、紙片が入っている。")], { requiresAll: ["c3KugaUnreachable", "c3LockerKeyHeld", "c3Locker623Found"], notFlags: ["c3LockerOpened"], setFlags: { c3LockerOpened: true } }),
        action("locker_memo_read", "メモを確認する", [narrate("紙片には、紗月からの連絡と、彦根港で待っているという内容が記されている。")], { requiresAll: ["c3LockerOpened"], notFlags: ["c3KugaMemoRead"], setFlags: { c3KugaMemoRead: true }, evidence: { c3KugaMemo: true }, image: "images/evidence/ev_c3_kuga_memo.png", chapter3AfterRecords: true }),
        action("locker_news_read", "十八年前の新聞記事を確認する", [narrate("十八年前の地方紙の記事が封筒に入っている。")], { requiresAll: ["c3LockerOpened"], notFlags: ["c3NewsArticleRead"], setFlags: { c3NewsArticleRead: true }, evidence: { c3NewsArticle: true }, image: "images/evidence/ev_c3_news_article.png", chapter3AfterRecords: true }),
        action("locker_inspection_read", "点検記録を確認する", [narrate("点検記録には、操舵系統の異常と修理完了まで出航不可の記載がある。")], { requiresAll: ["c3LockerOpened"], notFlags: ["c3InspectionRecordRead"], setFlags: { c3InspectionRecordRead: true }, evidence: { c3SteeringInspection: true }, image: "images/evidence/ev_c3_steering_record.png", chapter3AfterRecords: true }),
        action("locker_passbook_read", "古い通帳を確認する", [narrate("久我清志名義の古い通帳。十八年前ごろから、同じ名義による入金が続いている。振込人欄には『キリユウソウ』と印字されている。")], { requiresAll: ["c3LockerOpened"], notFlags: ["c3PassbookRead"], setFlags: { c3PassbookRead: true }, evidence: { c3OldPassbook: true }, image: "images/evidence/ev_c3_old_passbook.png", chapter3AfterRecords: true })
      ],
      move: [action("locker_not_done", "その場を離れる", [narrate("まだ調べていないものがある。")], { requiresAll: ["c3LockerOpened"], notFlags: ["c3LockerRecordsReviewed"] })]
    }, { enterVariants: [{ requiresAll: ["c3LockerOpened"], notFlags: ["c3LockerContentsIntroduced"], lines: [narrate("ロッカーの中には、封筒と古い通帳、折り畳まれた紙片が収められている。")], setFlags: { c3LockerContentsIntroduced: true } }] });

  d.initialFlags.c3LockerContentsIntroduced ??= false;

  d.scenes.C3_CANAL_DAY = loc("C3_CANAL", "八幡堀・昼", "bg_hachimanbori_day",
    "水路沿いに古い町並みが続いている。", {
      talk: [action("canal_talk_day", "店の人", [say("canalShopkeeper", "散策ですか。道に迷われましたか。")], { setFlags: { c3CanalShopkeeperMet: true } })],
      ask: [action("ask_kuga_residence", "久我清志について", [say("shichijo", "久我清志さんという方をご存じですか。"), say("canalShopkeeper", "久我さんなら、この近くに住んでますよ。"), say("shichijo", "この辺りですか。"), say("canalShopkeeper", "ええ。この先のアパートです。")], { setFlags: { c3KugaApartmentUnlocked: true, c3CanalShopkeeperMet: true } })],
      look: [action("canal_water_day", "水路", [narrate("水面に町並みが映り、遊覧船がゆっくり通り過ぎていく。")])]
    });
  d.scenes.C3_CANAL_EVENING = loc("C3_CANAL", "八幡堀・夕方", "bg_hachimanbori_evening",
    "夕暮れの光が、水路沿いの建物を照らしている。", {
      talk: [action("canal_talk_evening", "店の人", [say("canalShopkeeper", "夕方は水面の色がきれいですね。")], { setFlags: { c3CanalShopkeeperMet: true } })],
      look: [action("canal_water_evening", "水路", [narrate("水路の向こうに、夕暮れの町並みが続いている。")])]
    }, { enterVariants: [{ requiresAll: ["c3ReturnedFromRoom"], notFlags: ["c3EveningTransitionShown"], lines: [narrate("久我のアパートを出て、しばらく歩くうちに日が傾き始めていた。")], setFlags: { c3EveningTransitionShown: true } }] });

  d.scenes.C3_SHRINE_DAY = loc("C3_SHRINE", "日牟礼八幡宮・昼", "bg_himure_hachiman_day",
    "境内に参道が延び、参拝客が行き交っている。", {
      talk: [action("shrine_talk_day", "店の人", [say("shrineStaff", "こんにちは。境内をご覧になりますか。")], { setFlags: { c3ShrineStaffMet: true } })],
      look: [action("shrine_grounds_day", "境内", [narrate("参道の先に本殿が見える。")]), action("shrine_hall_day", "本殿", [narrate("本殿の前で参拝客が手を合わせている。")]), action("shrine_surroundings_day", "周辺", [narrate("近くには八幡山ロープウェイの乗り場がある。")])]
    });
  d.scenes.C3_SHRINE_EVENING = loc("C3_SHRINE", "日牟礼八幡宮・夕方", "bg_himure_hachiman_evening",
    "夕方の境内に、長い影が伸びている。", {
      talk: [action("shrine_talk_evening", "店の人", [say("shrineStaff", "何かお探しですか。")], { setFlags: { c3ShrineStaffMet: true } })],
      ask: [
        action("ask_woman_alone", "女性の様子", [say("shichijo", "この女性は一人でしたか。"), say("shrineStaff", "ええ。一人でしたよ。"), say("shrineStaff", "しばらくあの辺りに立っていましたね。誰かを待っていたんじゃないでしょうか。何度もスマートフォンを見ていましたから。")], { requiresAll: ["c3CanalSatsukiSeen", "c3SatsukiAtShrineKnown", "c3ShrineAloneKnown"], notFlags: ["c3WomanWaitingKnown"], setFlags: { c3WomanWaitingKnown: true } }),
        action("ask_where_woman_went", "その後について", [say("shichijo", "その後、どちらへ？"), say("shrineStaff", "しばらくして、向こうへ歩いていきましたよ。"), say("shichijo", "向こう？"), say("shrineStaff", "八幡公園の駐車場の方です。歩いてあっちへ行く人はあまりいないので、覚えていました。")], { requiresAll: ["c3WomanWaitingKnown"], notFlags: ["c3TowardsParkingKnown"], setFlags: { c3TowardsParkingKnown: true, c3ParkUnlocked: true, c3TimeNight: true } })
      ],
      look: [action("shrine_grounds_evening", "境内", [narrate("夕暮れの境内に、参道の灯りがともり始めている。")])]
    }, { enterVariants: [{ requiresAll: ["c3ReturnedFromRoom"], notFlags: ["c3EveningTransitionShown"], lines: [narrate("久我のアパートを出て、しばらく歩くうちに日が傾き始めていた。")], setFlags: { c3EveningTransitionShown: true } }] });

  d.scenes.C3_APARTMENT = loc("C3_APARTMENT", "久我のアパート・外観", "bg_kuga_apartment_exterior",
    "川沿いの道に面した、年季の入ったアパート。", {
      look: [action("apt_exterior", "アパート", [narrate("低い集合住宅の窓に、昼の光が反射している。")]), action("apt_stairs", "階段", [narrate("階段の手すりに、塗装の剥がれが見える。")])],
      search: [
        action("apt_mailbox", "郵便受け", [narrate("郵便受けに『久我清志』と書かれている。")])
      ],
      move: [
        action("go_to_kuga_room", "呼び鈴を押す", [say("kuga", "はい。"), say("shichijo", "久我清志さんですか。"), say("kuga", "そうですが。"), say("shichijo", "七条と申します。紗月さんのことで、お聞きしたいことがあります。"), say("kuga", "……桐生さんの？"), say("shichijo", "はい。"), say("kuga", "中でお話ししましょう。")], { notFlags: ["c3KugaHasLeftHome"], setFlags: { c3KugaRoomEntered: true }, nextScene: "C3_KUGA_ROOM" }),
        action("kuga_doorbell_no_answer", "呼び鈴を押す", [narrate("呼び鈴を押しても、応答はなかった。")], { requiresAll: ["c3KugaHasLeftHome"] })
      ]
    });
  d.scenes.C3_APARTMENT_EVENING = loc("C3_APARTMENT", "久我のアパート・夕方", "bg_kuga_apartment_night",
    "夕暮れの光が、アパートの外壁に残っている。", JSON.parse(JSON.stringify(d.scenes.C3_APARTMENT.commands)));

  const roomQuestionsDone = ["c3KugaSatsukiAsked", "c3MeetingReasonAsked", "c3AccidentAsked", "c3MahoAsked", "c3KugaTrustConfirmed", "c3PhoneSeen"];
  d.scenes.C3_KUGA_ROOM = loc("C3_APARTMENT", "久我の部屋", "bg_kuga_apartment_room",
    "居間には写真や船に関する品が置かれている。", {
      talk: [
        action("kuga_trust_conversation", "紗月のこと", [say("kuga", "あなたは、紗月さんを捜すために来たんですか。"), say("shichijo", "まずは紗月さんの無事を確かめたいと思っています。"), say("shichijo", "話したくないことまで、無理に聞くつもりはありません。"), say("kuga", "わかりました。どうやら、あなたは紗月さんと同じく真実が知りたいようですね。")], { requiresAll: ["c3KugaSatsukiAsked", "c3MeetingReasonAsked", "c3AccidentAsked", "c3MahoAsked"], notFlags: ["c3KugaTrustConfirmed"], setFlags: { c3KugaTrustConfirmed: true } }),
        action("kuga_phone_vibration", "久我の様子", [narrate("久我のスマートフォンが震えた。久我は画面を読み、不審な表情を浮かべた。"), say("shichijo", "どうかしましたか。"), say("kuga", "……別に。")], { requiresAll: ["c3KugaTrustConfirmed"], notFlags: ["c3PhoneSeen"], setFlags: { c3PhoneSeen: true } }),
        action("kuga_key_offer", "紗月のこと", [say("kuga", "七条さん。……これを預かってくれませんか。"), say("shichijo", "これは？"), say("kuga", "もし私と連絡が取れなくなったら、使ってください。"), say("shichijo", "何の鍵ですか。"), say("kuga", "……預かっておいてください。")], { requiresAll: roomQuestionsDone, notFlags: ["c3LockerKeyHeld"], setFlags: { c3LockerKeyHeld: true, c3SmallKeyFound: true }, evidence: { c3SmallKey: true }, image: "images/evidence/ev_c3_small_key.png" })
      ],
      ask: [
        action("ask_kuga_satsuki", "紗月について", [say("shichijo", "紗月さんとは、今日会う約束をしていたんですか。"), say("kuga", "ええ。今日、会う予定でした。ですが、まだ会っていません。")], { notFlags: ["c3KugaSatsukiAsked"], setFlags: { c3KugaSatsukiAsked: true } }),
        action("ask_meeting_reason", "会う理由について", [say("shichijo", "紗月さんは、何を聞きたがっていたんですか。"), say("kuga", "十八年前のことを知りたいと言われました。")], { requiresAll: ["c3KugaSatsukiAsked"], notFlags: ["c3MeetingReasonAsked"], setFlags: { c3MeetingReasonAsked: true } }),
        action("ask_accident", "十八年前の事故について", [say("shichijo", "紗月さんに、何を話すつもりなんですか。"), say("kuga", "そのことについては、紗月さんに先に伝えたいのです。今ここであなたに話すつもりはありません。")], { requiresAll: ["c3MeetingReasonAsked"], notFlags: ["c3AccidentAsked"], setFlags: { c3AccidentAsked: true } }),
        action("ask_maho", "写真の人について", [say("shichijo", "……娘さんですか。"), say("kuga", "真帆と言います。長いこと患っていたのですが、つい最近旅立ちました。")], { requiresAll: ["c3MahoPhotoSeen"], notFlags: ["c3MahoAsked"], setFlags: { c3MahoAsked: true } })
      ],
      look: [
        action("kuga_room_view", "部屋", [narrate("整えられた居間に、暮らしの道具が静かに置かれている。")]),
        action("kuga_ship_objects", "船の資料", [narrate("棚に、古い航路図や船に関する資料が並んでいる。")]),
        action("kuga_memorial_photo", "遺影", [narrate("若い女性の遺影が飾られている。そばには線香が供えられている。")], { setFlags: { c3MahoPhotoSeen: true } })
      ],
      search: [action("kuga_visible_papers", "表に出ている資料", [narrate("机の上に、閉じられた封筒と古い書類が重ねて置かれている。引き出しや戸棚は閉じたままだ。")])],
      move: [
        action("leave_kuga_blocked", "部屋を出る", [narrate("まだ聞けることがありそうだ。")], { notFlags: ["c3LockerKeyHeld"] }),
        action("leave_kuga_room", "部屋を出る", [say("shichijo", "お話を聞かせていただき、ありがとうございました。")], { requiresAll: ["c3LockerKeyHeld"], notFlags: ["c3ReturnedFromRoom"], setFlags: { c3ReturnedFromRoom: true, c3KugaHasLeftHome: true }, nextScene: "C3_APARTMENT" })
      ]
    });

  d.scenes.C3_PARK = loc("C3_PARK", "八幡公園駐車場・夜", "bg_hachiman_park_night",
    "街灯が照らす駐車場に、夜の静けさが広がっている。", {
      look: [
        action("park_survey", "あたりを見る", [narrate("駐車場の地面に、擦れた跡やタイヤ痕が残っている。少し離れたところには赤黒い染みがあり、白い玉のようなものも落ちている。")], { notFlags: ["c3ParkSurveyDone"], setFlags: { c3ParkSurveyDone: true, c3ParkScuffFound: true, c3ParkTireTracksFound: true, c3BloodFound: true, c3WhiteNailFound: true }, chapter3ParkingEvidence: true }),
        action("park_overview", "駐車場", [narrate("車の出入りが止まり、周囲に人影はない。")], { requiresAll: ["c3ParkSurveyDone"] })
      ],
      search: [
        action("park_scuff", "地面の擦れ", [narrate("地面の一部が強く擦れ、砂利と土が乱れている。")], { requiresAll: ["c3ParkScuffFound"], notFlags: ["c3ParkScuffSeen"], setFlags: { c3ParkScuffSeen: true }, chapter3ParkingEvidence: true }),
        action("park_tire_tracks", "タイヤ痕", [narrate("タイヤが強く擦れたような痕が、地面に残っている。")], { requiresAll: ["c3ParkTireTracksFound"], notFlags: ["c3ParkTireTracksSeen"], setFlags: { c3ParkTireTracksSeen: true }, chapter3ParkingEvidence: true }),
        action("park_blood", "赤黒い染み", [narrate("地面に、小さな赤黒い染みが残っている。"), narrate("乾いた血の跡のように見える。")], { requiresAll: ["c3BloodFound"], notFlags: ["c3BloodSeen"], setFlags: { c3BloodSeen: true }, chapter3ParkingEvidence: true }),
        action("park_white_nail", "白い玉状のもの", [narrate("地面に、白い小さな玉のようなものが2個落ちている。ネイルにつける飾りのようだ。")], { requiresAll: ["c3WhiteNailFound"], notFlags: ["c3WhiteNailSeen"], setFlags: { c3WhiteNailSeen: true }, evidence: { c3WhiteNailDecoration: true }, image: "images/evidence/ev_c3_satsuki_nail.png", chapter3ParkingEvidence: true })
      ]
    });

  d.scenes.C3_HIKONE_ENTRY = loc("C3_HIKONE", "彦根港・入口", "bg_hikone_port",
    "夜の港は静まり、入口には人影がない。", {
      look: [action("hikone_entry_view", "港の入口", [narrate("観光船の運航はすでに休止されているようだ。乗船場の灯りは消えている。")])],
      move: [action("to_hikone_pier", "船着き場へ進む", [narrate("岸壁に沿って、船着き場へ進んだ。")], { nextScene: "C3_HIKONE_PIER" })]
    });
  d.scenes.C3_HIKONE_PIER = loc("C3_HIKONE", "彦根港・船着き場", "bg_hikone_pier",
    "月明かりと街灯が、人気のない岸壁を照らしている。", {
      look: [action("hikone_pier_view", "船着き場", [narrate("船は停まっていない。小屋の照明も消えている。")])],
      move: [action("back_hikone_entry", "入口へ戻る", [narrate("入口の方へ戻った。")], { nextScene: "C3_HIKONE_ENTRY" }), action("to_hikone_deep", "港の奥へ進む", [narrate("港の奥へ進むと、地面に人が倒れていた。")], { nextScene: "C3_HIKONE_BODY_REVEAL" })]
    });
  d.scenes.C3_HIKONE_BODY_REVEAL = loc("C3_HIKONE", "彦根港・奥", "bg_hikone_kuga_found",
    "街灯の届かない岸壁の奥に、誰かが倒れている。", {
      search: [action("confirm_kuga_body", "倒れている人物", [narrate("七条は近づいた。人物はうつ伏せで、顔は見えない。"), say("shichijo", "……久我さん。"), narrate("七条は久我の様子を確かめた。久我清志は、すでに息をしていなかった。")], { setFlags: { c3BodyConfirmed: true }, chapterEnd: true })]
    });

  d.chapter3PresentTargets = {
    C3_STATION: [["taxiDriver", "タクシー運転手", "c3TaxiDriverMet"]],
    C3_CANAL: [["canalShopkeeper", "店の人", "c3CanalShopkeeperMet"]],
    C3_SHRINE: [["shrineStaff", "店の人", "c3ShrineStaffMet"]]
  };
  d.chapter2PresentTargets = { ...(d.chapter2PresentTargets ?? {}), ...d.chapter3PresentTargets };
  d.chapter3PresentResponses = {
    taxiDriver: { satsukiPhoto: { lines: [say("shichijo", "この女性を見た覚えはありませんか。"), say("taxiDriver", "……ああ、この人なら覚えてますよ。"), say("shichijo", "どちらへ？"), say("taxiDriver", "八幡堀の方です。"), say("taxiDriver", "観光客でタクシーを使うなら、大きな荷物を持っておられるのが普通なんですが、何も持っておられなかったのと、少し表情が暗かったので覚えています。")], setFlags: { c3TaxiWitnessKnown: true, c3HachimanboriUnlocked: true, c3ShrineUnlocked: true } } },
    canalShopkeeper: { satsukiPhoto: { requiresAll: ["c3ReturnedFromRoom"], fallbackLines: [say("shichijo", "この女性を見かけませんでしたか。"), say("canalShopkeeper", "観光の方はたくさんいらっしゃいますからね。写真だけでは、ちょっと。")], lines: [say("shichijo", "この女性を見かけませんでしたか。"), say("canalShopkeeper", "……あ、この人なら見たかもしれません。"), say("canalShopkeeper", "今日のお昼頃です。この辺りを一人で歩いていましたよ。"), say("shichijo", "どちらへ？"), say("canalShopkeeper", "日牟礼八幡宮の方です。")], setFlags: { c3CanalSatsukiSeen: true, c3SatsukiAtShrineKnown: true, c3ShrineUnlocked: true } } },
    shrineStaff: { satsukiPhoto: { requiresAll: ["c3CanalSatsukiSeen"], fallbackLines: [say("shichijo", "この女性を見たことはありませんか。"), say("shrineStaff", "昼間はたくさん人がいるので、写真を見せられても……。")], lines: [say("shichijo", "この女性を見たことはありませんか。"), say("shrineStaff", "ああ、この人なら覚えています。"), say("shichijo", "紗月さんを見たんですね。"), say("shrineStaff", "ええ。一人でしたよ。")], setFlags: { c3ShrineAloneKnown: true, c3SatsukiAtShrineKnown: true } } }
  };
})();
