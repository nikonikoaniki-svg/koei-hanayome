window.KOEI_GAME_DATA = {
  "initialFlags": {
    "tutorialShown": false,
    "requestAccepted": false,
    "hotelStaffAsked": false,
    "roomLooked": false,
    "roomSearched": false,
    "flowerStaffKnown": false,
    "hotelConfirmUnlocked": false,
    "entryCountKnown": false,
    "exitCountKnown": false,
    "fifthPersonInspected": false,
    "outerCameraKnown": false,
    "needRecentPhoto": false,
    "kiryuyaUnlocked": false,
    "sojiroTalked": false,
    "sayaMet": false,
    "sayaSuspicious": false,
    "preWeddingPhotoKnown": false,
    "nailFound": false,
    "nailMatched": false,
    "fifthIsSatsuki": false,
    "kyotoStationUnlocked": false,
    "stationVisited": false,
    "shopPhotoShown": false,
    "shopClothesKnown": false,
    "shopBagKnown": false,
    "shopDirectionKnown": false,
    "shopWitness": false,
    "lockerChecked": false,
    "toiletUnlocked": false,
    "stationStaffTalked": false,
    "foldedBoxFound": false,
    "gateUnlocked": false,
    "departureBoardChecked": false,
    "stationMysterySolved": false,
    "hotelReturnUnlocked": false,
    "chapterMysterySolved": false,
    "giftAreaUnlocked": false,
    "telegramFound": false,
    "telegramAsked": false,
    "chapter1Clear": false
  },
  "initialEvidence": {
    "fifthStaff": false,
    "hotelOuterCamera": false,
    "satsukiPhoto": false,
    "satsukiNail": false,
    "nailCompare": false,
    "foldedBox": false,
    "telegram": false
  },
  "characters": {
    "shichijo": {
      "name": "七条智門",
      "image": "images/characters/ch_shichijo.webp"
    },
    "soichiro": {
      "name": "桐生宗一郎",
      "image": "images/characters/ch_soichiro.webp"
    },
    "sojiro": {
      "name": "桐生宗次郎",
      "image": "images/characters/ch_sojiro.webp"
    },
    "saya": {
      "name": "日野沙耶",
      "image": "images/characters/ch_saya.webp"
    },
    "hotelStaff": {
      "name": "ホテル係員",
      "image": "images/characters/ch_hotel_staff.webp"
    },
    "hotelManager": {
      "name": "ホテル責任者",
      "image": "images/characters/ch_hotel_manager.webp"
    },
    "shopClerk": {
      "name": "売店店員",
      "image": "images/characters/ch_shop_clerk.webp"
    }
  },
  "evidenceMaster": {
    "fifthStaff": {
      "name": "5人目の装花スタッフ",
      "image": "images/evidence/ev_fifth_staff.webp",
      "description": "装花スタッフの退館時に映っていた5人目。帽子とマスク、大きな箱で顔や体格を隠している。"
    },
    "hotelOuterCamera": {
      "name": "ホテル外部カメラ",
      "image": "images/evidence/ev_hotel_outer_camera.webp",
      "description": "大きな箱を持った作業着姿の人物が、一人で京都駅方向へ歩いている。"
    },
    "satsukiPhoto": {
      "name": "紗月の前撮り写真",
      "image": "images/evidence/ev_satsuki_photo.webp",
      "description": "北野天満宮で撮影された紗月の前撮り写真。"
    },
    "satsukiNail": {
      "name": "紗月のネイル",
      "image": "images/evidence/ev_satsuki_nail.webp",
      "description": "前撮り写真から確認できる、紗月の特徴的なネイル。"
    },
    "foldedBox": {
      "name": "畳まれた段ボール箱",
      "image": "images/evidence/ev_folded_box.webp",
      "description": "京都駅の多目的トイレ内で見つかった、装花資材用と思われる畳まれた箱。"
    },
    "telegram": {
      "name": "写真電報",
      "image": "images/evidence/ev_photo_telegram.webp",
      "description": "湖上の灯浮標の写真と『あの日のことを、すべて話してください。』という文面。"
    },
    "nailCompare": {
      "name": "ネイル比較写真",
      "image": "images/evidence/ev_nail_compare.webp",
      "description": "前撮り写真の手元と、5人目の装花スタッフの手元を並べた比較写真。"
    }
  },
  "movementMap": {
    "spots": {
      "H1": {
        "label": "ホテル・披露宴会場前",
        "background": "images/backgrounds/bg_hotel_entrance.webp",
        "sceneId": "H1",
        "links": [
          "H2",
          "H4",
          "H6"
        ]
      },
      "H2": {
        "label": "花嫁控室前",
        "background": "images/backgrounds/bg_bridal_room_hallway.webp",
        "sceneId": "H2",
        "links": [
          "H1",
          "H3",
          "H4"
        ]
      },
      "H3": {
        "label": "花嫁控室",
        "background": "images/backgrounds/bg_bridal_room.webp",
        "sceneId": "H3",
        "links": [
          "H2",
          "H4"
        ]
      },
      "H4": {
        "label": "ホテル廊下",
        "background": "images/backgrounds/bg_hotel_corridor.webp",
        "sceneId": "H4",
        "links": [
          "H1",
          "H2",
          "H3",
          "H5"
        ]
      },
      "H5": {
        "label": "ホテル・確認室",
        "background": "images/backgrounds/bg_hotel_meetingroom.webp",
        "sceneId": "H5",
        "links": [
          "H4",
          "K1",
          "S1"
        ]
      },
      "H6": {
        "label": "ホテル・祝電置き場",
        "background": "images/backgrounds/bg_hotel_gift_area.webp",
        "sceneId": "H6",
        "links": [
          "H1",
          "H4"
        ]
      },
      "K1": {
        "label": "桐生屋前",
        "background": "images/backgrounds/bg_kiryuya_outside.webp",
        "sceneId": "K1",
        "links": [
          "K2",
          "H5"
        ]
      },
      "K2": {
        "label": "桐生屋店内",
        "background": "images/backgrounds/bg_kiryuya_inside.webp",
        "sceneId": "K2",
        "links": [
          "K1",
          "H5"
        ]
      },
      "K3": {
        "label": "桐生屋店内",
        "background": "images/backgrounds/bg_kiryuya_inside.webp",
        "sceneId": "K3",
        "links": [
          "K1",
          "H5"
        ]
      },
      "S1": {
        "label": "京都駅構内",
        "background": "images/backgrounds/bg_kyoto_station_concourse.webp",
        "sceneId": "S1",
        "links": [
          "S2",
          "S3",
          "S4",
          "S5"
        ]
      },
      "S2": {
        "label": "京都駅・売店",
        "background": "images/backgrounds/bg_kyoto_station_shop.webp",
        "sceneId": "S2",
        "links": [
          "S1",
          "S3",
          "S5"
        ]
      },
      "S3": {
        "label": "京都駅・コインロッカー",
        "background": "images/backgrounds/bg_kyoto_station_locker.webp",
        "sceneId": "S3",
        "links": [
          "S1",
          "S2",
          "S4"
        ]
      },
      "S4": {
        "label": "京都駅・多目的トイレ前",
        "background": "images/backgrounds/bg_kyoto_station_multipurpose_toilet.webp",
        "sceneId": "S4",
        "links": [
          "S1",
          "S3",
          "S5"
        ]
      },
      "S5": {
        "label": "京都駅・在来線改札前",
        "background": "images/backgrounds/bg_kyoto_station_gate.webp",
        "sceneId": "S5",
        "links": [
          "S1",
          "S2",
          "S4",
          "H1"
        ]
      }
    }
  },
  "scenes": {
    "T00": {
      "type": "title",
      "background": "images/title/cover_title_main.webp"
    },
    "OP01": {
      "type": "chapter",
      "background": "images/title/op_chapter1.webp",
      "startScene": "H1"
    },
    "H1": {
      "type": "location",
      "spotId": "H1",
      "location": "ホテル・披露宴会場前",
      "background": "images/backgrounds/bg_hotel_entrance.webp",
      "enterVariants": [
        {
          "id": "h1_return",
          "requiresAll": [
            "stationMysterySolved"
          ],
          "notFlags": [
            "chapterMysterySolved"
          ],
          "onceFlag": "_seen_h1_return",
          "lines": [
            {
              "speaker": "soichiro",
              "text": "七条さん！"
            },
            {
              "speaker": "shichijo",
              "text": "まだ紗月さんを見つけたわけではありません。ですが、ホテルからどうやって姿を消したのかは分かりました"
            }
          ]
        },
        {
          "id": "h1_intro",
          "notFlags": [
            "requestAccepted"
          ],
          "onceFlag": "_seen_h1_intro",
          "lines": [
            {
              "narrator": "午前九時四十五分。京都駅近くのホテル。披露宴会場の前では、スタッフが慌ただしく行き交っていた。"
            },
            {
              "speaker": "soichiro",
              "text": "七条さん。少し、よろしいでしょうか"
            },
            {
              "speaker": "shichijo",
              "text": "どうされました"
            },
            {
              "speaker": "soichiro",
              "text": "娘がいないんです。花嫁控室から、いなくなりました"
            },
            {
              "speaker": "shichijo",
              "text": "警察には？"
            },
            {
              "speaker": "soichiro",
              "text": "まだです。まず、七条さんに探していただきたい"
            },
            {
              "speaker": "shichijo",
              "text": "分かりました。ただし、私にできる範囲で調べます"
            }
          ],
          "setFlags": {
            "requestAccepted": true
          }
        }
      ],
      "idleText": "宗一郎が落ち着かない様子で、披露宴会場前に立っている。",
      "commands": {
        "talk": [
          {
            "id": "talk_soichiro",
            "label": "桐生宗一郎",
            "lines": [
              {
                "speaker": "soichiro",
                "text": "何か分かりましたか"
              },
              {
                "speaker": "shichijo",
                "text": "まだ調べているところです"
              }
            ]
          }
        ],
        "ask": [
          {
            "id": "ask_lastseen",
            "label": "最後に紗月を見たのは？",
            "lines": [
              {
                "speaker": "shichijo",
                "text": "最後に紗月さんを見たのは？"
              },
              {
                "speaker": "soichiro",
                "text": "私は今朝、まだ会っていません。最後に確認したのはホテルの方です"
              }
            ]
          },
          {
            "id": "ask_morning",
            "label": "今朝の様子",
            "lines": [
              {
                "speaker": "shichijo",
                "text": "何か変わった様子があったとは？"
              },
              {
                "speaker": "soichiro",
                "text": "聞いていません"
              }
            ]
          },
          {
            "id": "ask_police",
            "label": "警察について",
            "lines": [
              {
                "speaker": "shichijo",
                "text": "事件性が見えれば、警察への連絡も考えてください"
              },
              {
                "speaker": "soichiro",
                "text": "……ええ"
              }
            ]
          },
          {
            "id": "ask_final_report",
            "label": "紗月が消えた方法を説明する",
            "lines": [
              {
                "speaker": "soichiro",
                "text": "ホテルからどうやって出たんです？"
              }
            ],
            "requiresAll": [
              "stationMysterySolved"
            ],
            "notFlags": [
              "chapterMysterySolved"
            ],
            "quiz": {
              "question": "紗月はどのようにホテルから姿を消したのか？",
              "choices": [
                {
                  "text": "何者かに連れ出された",
                  "correct": false
                },
                {
                  "text": "非常口から逃げた",
                  "correct": false
                },
                {
                  "text": "装花スタッフに変装してホテルを出た",
                  "correct": true
                },
                {
                  "text": "沙耶に手引きされた",
                  "correct": false
                }
              ],
              "correctText": "ホテルに入った装花スタッフは四人。出たのは五人。五人目が紗月さんでした。",
              "wrongText": "そこまでの証拠はありません。もう一度考えましょう。",
              "setFlags": {
                "chapterMysterySolved": true,
                "giftAreaUnlocked": true
              },
              "afterLines": [
                {
                  "speaker": "soichiro",
                  "text": "どこへ行ったんです"
                },
                {
                  "speaker": "shichijo",
                  "text": "京都駅です。駅では私服姿で、女性用のバッグを持っていました"
                },
                {
                  "speaker": "shichijo",
                  "text": "コインロッカーは空振りでしたが、多目的トイレで畳まれた箱が見つかっています"
                },
                {
                  "speaker": "shichijo",
                  "text": "在来線改札方向へ向かい、その時間帯では琵琶湖線方面が有力です"
                },
                {
                  "speaker": "soichiro",
                  "text": "では、それに乗った？"
                },
                {
                  "speaker": "shichijo",
                  "text": "そこまでは言えません。有力な候補というだけです"
                },
                {
                  "narrator": "そのとき、ホテル係員が祝電置き場の方から宗一郎を呼んだ。"
                }
              ]
            }
          }
        ],
        "look": [
          {
            "id": "look_hall",
            "label": "披露宴会場前を見る",
            "lines": [
              {
                "narrator": "式の準備は続いている。しかし、主役の花嫁だけがいない。"
              }
            ]
          }
        ],
        "search": [],
        "evidence": []
      }
    },
    "H2": {
      "type": "location",
      "spotId": "H2",
      "location": "花嫁控室前",
      "background": "images/backgrounds/bg_bridal_room_hallway.webp",
      "enterVariants": [
        {
          "id": "h2_intro",
          "onceFlag": "_seen_h2_intro",
          "lines": [
            {
              "speaker": "hotelStaff",
              "text": "こちらです。九時三十五分ごろ、お迎えに来たところ、紗月様がおられませんでした"
            },
            {
              "speaker": "shichijo",
              "text": "まず中を確認しましょう"
            }
          ]
        }
      ],
      "idleText": "花嫁控室の扉が目の前にある。",
      "commands": {
        "talk": [
          {
            "id": "talk_staff",
            "label": "ホテル係員",
            "lines": [
              {
                "speaker": "hotelStaff",
                "text": "私が来たときには、もういらっしゃいませんでした"
              }
            ]
          }
        ],
        "ask": [
          {
            "id": "ask_noise",
            "label": "物音や叫び声",
            "lines": [
              {
                "speaker": "shichijo",
                "text": "叫び声や大きな物音は？"
              },
              {
                "speaker": "hotelStaff",
                "text": "聞いていません"
              }
            ],
            "setFlags": {
              "hotelStaffAsked": true
            }
          }
        ],
        "look": [
          {
            "id": "look_door",
            "label": "控室の扉",
            "lines": [
              {
                "narrator": "外から見て、扉や鍵に不自然な傷はない。"
              }
            ]
          }
        ],
        "search": [],
        "evidence": []
      }
    },
    "H3": {
      "type": "location",
      "spotId": "H3",
      "location": "花嫁控室",
      "background": "images/backgrounds/bg_bridal_room.webp",
      "idleText": "紗月が支度をしていた控室。室内は大きく荒れていない。",
      "commands": {
        "talk": [],
        "ask": [
          {
            "id": "ask_staff_inside",
            "label": "ホテル係員に聞く",
            "lines": [
              {
                "speaker": "shichijo",
                "text": "誰かが紗月さんを連れ出したところは？"
              },
              {
                "speaker": "hotelStaff",
                "text": "見ていません"
              }
            ]
          }
        ],
        "look": [
          {
            "id": "look_room",
            "label": "部屋全体",
            "lines": [
              {
                "narrator": "室内に大きく荒れた跡はない。家具や衣装も乱れていない。"
              }
            ],
            "setFlags": {
              "roomLooked": true
            }
          }
        ],
        "search": [
          {
            "id": "search_mirror",
            "label": "鏡台",
            "lines": [
              {
                "narrator": "化粧道具が並んでいる。急に何かが起きたようには見えない。"
              }
            ]
          },
          {
            "id": "search_costume",
            "label": "衣装まわり",
            "lines": [
              {
                "narrator": "衣装の周囲にも、乱れた様子はない。"
              }
            ]
          },
          {
            "id": "search_belongings",
            "label": "私物",
            "lines": [
              {
                "narrator": "いくつかの私物が控室に残されている。"
              }
            ],
            "setFlags": {
              "roomSearched": true
            }
          }
        ],
        "evidence": []
      }
    },
    "H4": {
      "type": "location",
      "spotId": "H4",
      "location": "ホテル廊下",
      "background": "images/backgrounds/bg_hotel_corridor.webp",
      "idleText": "花嫁控室と披露宴会場をつなぐホテルの廊下。",
      "commands": {
        "talk": [
          {
            "id": "talk_staff_corridor",
            "label": "ホテル係員",
            "lines": [
              {
                "speaker": "hotelStaff",
                "text": "何か確認できることがあれば、お手伝いします"
              }
            ]
          }
        ],
        "ask": [
          {
            "id": "ask_contractors",
            "label": "今朝の外部業者",
            "lines": [
              {
                "speaker": "shichijo",
                "text": "今朝、この付近に出入りした外部業者は？"
              },
              {
                "speaker": "hotelStaff",
                "text": "装花のスタッフさんが来ています"
              },
              {
                "speaker": "shichijo",
                "text": "人数は？"
              },
              {
                "speaker": "hotelStaff",
                "text": "人数までは分かりません"
              }
            ],
            "setFlags": {
              "flowerStaffKnown": true
            }
          },
          {
            "id": "ask_camera",
            "label": "出入口の記録",
            "lines": [
              {
                "speaker": "shichijo",
                "text": "出入口の記録はありますか"
              },
              {
                "speaker": "hotelStaff",
                "text": "防犯カメラがあります。ホテル側で確認できます"
              },
              {
                "speaker": "hotelStaff",
                "text": "確認室で映像を確認します。必要でしたら、そちらへどうぞ"
              }
            ],
            "setFlags": {
              "hotelConfirmUnlocked": true
            },
            "requiresAll": [
              "flowerStaffKnown"
            ]
          }
        ],
        "look": [
          {
            "id": "look_corridor",
            "label": "廊下を見る",
            "lines": [
              {
                "narrator": "式場スタッフや業者が行き交う。花嫁が作業員に紛れても、目立たないかもしれない。"
              }
            ]
          }
        ],
        "search": [],
        "evidence": []
      }
    },
    "H5": {
      "type": "location",
      "spotId": "H5",
      "location": "ホテル・確認室",
      "background": "images/backgrounds/bg_hotel_meetingroom.webp",
      "enterVariants": [
        {
          "id": "h5_first",
          "requiresAll": [
            "hotelConfirmUnlocked"
          ],
          "notFlags": [
            "entryCountKnown"
          ],
          "onceFlag": "_seen_h5_first",
          "lines": [
            {
              "speaker": "hotelManager",
              "text": "事情は伺いました。当館で映像を確認します"
            },
            {
              "speaker": "shichijo",
              "text": "装花スタッフの入館時と退館時を確認してください"
            }
          ]
        },
        {
          "id": "h5_return_nail",
          "requiresAll": [
            "nailFound"
          ],
          "notFlags": [
            "nailMatched"
          ],
          "onceFlag": "_seen_h5_return_nail",
          "lines": [
            {
              "speaker": "shichijo",
              "text": "先ほどの五人目の静止画を、もう一度お願いします"
            }
          ]
        }
      ],
      "idleText": "ホテル側が確認した映像や静止画を整理できる。",
      "commands": {
        "talk": [
          {
            "id": "talk_manager",
            "label": "ホテル責任者",
            "lines": [
              {
                "speaker": "hotelManager",
                "text": "必要な範囲で、当館側で映像を確認します"
              }
            ]
          }
        ],
        "ask": [
          {
            "id": "ask_entry_count",
            "label": "装花スタッフの入館人数",
            "lines": [
              {
                "speaker": "hotelManager",
                "text": "午前八時十二分ごろ、装花スタッフが入館しています。四人です"
              }
            ],
            "setFlags": {
              "entryCountKnown": true
            }
          },
          {
            "id": "ask_exit_count",
            "label": "装花スタッフの退館人数",
            "lines": [
              {
                "speaker": "hotelManager",
                "text": "退館時は……五人映っています"
              },
              {
                "speaker": "shichijo",
                "text": "入館は四人、退館は五人。五人目を確認しましょう"
              }
            ],
            "setFlags": {
              "exitCountKnown": true,
              "fifthPersonInspected": true
            },
            "evidence": {
              "fifthStaff": true
            },
            "requiresAll": [
              "entryCountKnown"
            ]
          },
          {
            "id": "ask_outer_camera",
            "label": "ホテル外側の映像",
            "lines": [
              {
                "speaker": "hotelManager",
                "text": "建物の外側のカメラにも、それらしい人物が映っています"
              },
              {
                "narrator": "大きな箱を持った作業着姿の人物が、一人でホテルを離れていく。"
              },
              {
                "speaker": "hotelManager",
                "text": "京都駅の方向へ歩いています"
              }
            ],
            "setFlags": {
              "outerCameraKnown": true
            },
            "evidence": {
              "hotelOuterCamera": true
            },
            "requiresAll": [
              "exitCountKnown"
            ]
          },
          {
            "id": "ask_recent_photo",
            "label": "紗月の最近の写真",
            "lines": [
              {
                "speaker": "shichijo",
                "text": "この人物が紗月さんか確認したいですね。最近の写真はありますか。できれば手元が写っているものを"
              },
              {
                "speaker": "soichiro",
                "text": "前撮りの写真ならあります。桐生屋に。弟の宗次郎が預かっているはずです"
              }
            ],
            "setFlags": {
              "needRecentPhoto": true,
              "kiryuyaUnlocked": true
            },
            "requiresAll": [
              "outerCameraKnown"
            ]
          }
        ],
        "look": [
          {
            "id": "look_fifth_face",
            "label": "5人目の顔",
            "lines": [
              {
                "narrator": "帽子とマスクで顔は判別できない。"
              }
            ],
            "requiresAll": [
              "fifthPersonInspected"
            ],
            "image": "images/evidence/ev_fifth_staff.webp"
          },
          {
            "id": "look_fifth_box",
            "label": "5人目の箱",
            "lines": [
              {
                "narrator": "大きな箱が体の前を隠している。"
              }
            ],
            "requiresAll": [
              "fifthPersonInspected"
            ],
            "image": "images/evidence/ev_fifth_staff.webp"
          },
          {
            "id": "look_fifth_hand",
            "label": "5人目の手元",
            "lines": [
              {
                "narrator": "箱を支える指先だけが、映像に残っている。"
              }
            ],
            "requiresAll": [
              "fifthPersonInspected"
            ],
            "image": "images/evidence/ev_fifth_staff.webp"
          },
          {
            "id": "look_fifth_bag",
            "label": "5人目の持ち物",
            "lines": [
              {
                "narrator": "私物用のバッグらしいものは見当たらない。"
              }
            ],
            "requiresAll": [
              "fifthPersonInspected"
            ],
            "image": "images/evidence/ev_fifth_staff.webp"
          }
        ],
        "search": [],
        "evidence": [
          {
            "id": "compare_nails",
            "label": "紗月のネイルと5人目の手元を比較する",
            "lines": [
              {
                "narrator": "前撮り写真の手元と、5人目の装花スタッフの手元。色と飾りの位置が一致している。"
              }
            ],
            "setFlags": {
              "nailMatched": true
            },
            "evidence": {
              "nailCompare": true
            },
            "requiresAll": [
              "nailFound"
            ],
            "notFlags": [
              "nailMatched"
            ],
            "image": "images/evidence/ev_nail_compare.webp",
            "quiz": {
              "question": "5人目の装花スタッフは誰か？",
              "choices": [
                {
                  "text": "日野沙耶",
                  "correct": false
                },
                {
                  "text": "桐生紗月",
                  "correct": true
                },
                {
                  "text": "桐生宗次郎",
                  "correct": false
                },
                {
                  "text": "別の人物",
                  "correct": false
                }
              ],
              "correctText": "五人目は紗月さんです。装花スタッフに紛れてホテルを出ています。",
              "wrongText": "証拠と合いませんね。もう一度考えましょう。",
              "setFlags": {
                "fifthIsSatsuki": true,
                "kyotoStationUnlocked": true
              },
              "afterLines": [
                {
                  "speaker": "soichiro",
                  "text": "では、本当にホテルを出た……"
                },
                {
                  "speaker": "shichijo",
                  "text": "ええ。次は京都駅で、その先の足取りを追えます"
                }
              ]
            }
          }
        ]
      }
    },
    "K1": {
      "type": "location",
      "spotId": "K1",
      "location": "桐生屋前",
      "background": "images/backgrounds/bg_kiryuya_outside.webp",
      "enterVariants": [
        {
          "id": "k1_intro",
          "onceFlag": "_seen_k1_intro",
          "lines": [
            {
              "speaker": "sojiro",
              "text": "七条さんですね。兄から話は聞いています"
            },
            {
              "speaker": "shichijo",
              "text": "宗次郎さん。少しお話を"
            },
            {
              "speaker": "sojiro",
              "text": "紗月のことですね"
            }
          ],
          "setFlags": {
            "sojiroTalked": true
          }
        }
      ],
      "idleText": "桐生家の家業である桐生屋。その店先。",
      "commands": {
        "talk": [
          {
            "id": "talk_sojiro",
            "label": "桐生宗次郎",
            "lines": [
              {
                "speaker": "sojiro",
                "text": "分かることならお話しします"
              }
            ]
          }
        ],
        "ask": [
          {
            "id": "ask_satsuki_personality",
            "label": "紗月について",
            "lines": [
              {
                "speaker": "sojiro",
                "text": "真面目な子です。何も言わずに結婚式から逃げるような子には見えません"
              },
              {
                "speaker": "shichijo",
                "text": "見えません、ですか"
              },
              {
                "speaker": "sojiro",
                "text": "人の胸の中までは分かりませんから"
              }
            ]
          },
          {
            "id": "ask_recent",
            "label": "最近の様子",
            "lines": [
              {
                "speaker": "sojiro",
                "text": "特に変わった話は聞いていません"
              }
            ]
          },
          {
            "id": "ask_soichiro",
            "label": "宗一郎について",
            "lines": [
              {
                "speaker": "shichijo",
                "text": "宗一郎さんに、顔がそっくりですね"
              },
              {
                "speaker": "sojiro",
                "text": "ははは、双子ですから"
              }
            ]
          }
        ],
        "look": [
          {
            "id": "look_kiryuya_front",
            "label": "店構え",
            "lines": [
              {
                "narrator": "老舗らしい落ち着いた店構えだ。"
              }
            ]
          }
        ],
        "search": [],
        "evidence": []
      }
    },
    "K2": {
      "type": "location",
      "spotId": "K2",
      "location": "桐生屋店内",
      "background": "images/backgrounds/bg_kiryuya_inside.webp",
      "enterVariants": [
        {
          "id": "k2_intro",
          "notFlags": [
            "sayaMet"
          ],
          "onceFlag": "_seen_k2_intro",
          "lines": [
            {
              "speaker": "saya",
              "text": "いらっしゃいませ"
            },
            {
              "speaker": "shichijo",
              "text": "紗月さんのことで、お聞きしたいことがあります"
            },
            {
              "speaker": "saya",
              "text": "私に？"
            }
          ],
          "setFlags": {
            "sayaMet": true
          }
        }
      ],
      "idleText": "染織関係の資料や道具が並ぶ桐生屋の店内。沙耶や宗次郎が応対している。",
      "commands": {
        "talk": [
          {
            "id": "talk_saya",
            "label": "日野沙耶",
            "lines": [
              {
                "speaker": "saya",
                "text": "私に分かることなら……"
              }
            ]
          },
          {
            "id": "talk_sojiro_inside",
            "label": "桐生宗次郎",
            "lines": [
              {
                "speaker": "sojiro",
                "text": "前撮り写真のことでしたら、こちらでご覧ください"
              }
            ]
          }
        ],
        "ask": [
          {
            "id": "ask_saya_morning",
            "label": "沙耶：今朝の紗月",
            "lines": [
              {
                "speaker": "saya",
                "text": "会っていません。連絡もありません"
              }
            ]
          },
          {
            "id": "ask_saya_wedding",
            "label": "沙耶：婚礼について",
            "lines": [
              {
                "speaker": "saya",
                "text": "楽しみにしていたと思います"
              }
            ]
          },
          {
            "id": "ask_saya_hotel",
            "label": "沙耶：ホテルへ行った？",
            "lines": [
              {
                "speaker": "saya",
                "text": "行ってません"
              },
              {
                "narrator": "返事の前に、わずかな間があった。"
              }
            ]
          },
          {
            "id": "ask_photo",
            "label": "宗次郎：前撮り写真",
            "lines": [
              {
                "speaker": "sojiro",
                "text": "前撮りの写真ならあります。こちらでお見せします"
              },
              {
                "narrator": "宗次郎は北野天満宮で撮られた前撮り写真を、七条の前に広げた。"
              }
            ],
            "setFlags": {
              "preWeddingPhotoKnown": true
            },
            "evidence": {
              "satsukiPhoto": true
            }
          }
        ],
        "look": [
          {
            "id": "look_desk",
            "label": "作業台",
            "lines": [
              {
                "narrator": "染織関係の資料が広げられている。"
              }
            ]
          },
          {
            "id": "look_shelf",
            "label": "棚",
            "lines": [
              {
                "narrator": "古い帳面や資料が並んでいる。"
              }
            ]
          },
          {
            "id": "look_photo_face",
            "label": "前撮り写真：顔",
            "lines": [
              {
                "narrator": "紗月が穏やかに笑っている。"
              }
            ],
            "requiresAll": [
              "preWeddingPhotoKnown"
            ],
            "image": "images/evidence/ev_satsuki_photo.webp"
          },
          {
            "id": "look_photo_kimono",
            "label": "前撮り写真：着物",
            "lines": [
              {
                "narrator": "華やかな意匠の着物だ。"
              }
            ],
            "requiresAll": [
              "preWeddingPhotoKnown"
            ],
            "image": "images/evidence/ev_satsuki_photo.webp"
          },
          {
            "id": "look_photo_hand",
            "label": "前撮り写真：手",
            "lines": [
              {
                "narrator": "紗月の指先には、特徴的なネイルが施されている。"
              },
              {
                "speaker": "shichijo",
                "text": "この手元を記録させていただいても？"
              },
              {
                "speaker": "sojiro",
                "text": "構いませんよ"
              }
            ],
            "setFlags": {
              "nailFound": true
            },
            "evidence": {
              "satsukiNail": true
            },
            "requiresAll": [
              "preWeddingPhotoKnown"
            ],
            "image": "images/evidence/ev_satsuki_nail.webp"
          }
        ],
        "search": [
          {
            "id": "search_package",
            "label": "紙包み",
            "lines": [
              {
                "narrator": "七条が作業台へ目を向けた、その瞬間だった。"
              },
              {
                "narrator": "沙耶は、広げていた書類の一枚をさりげなく紙包みの下へ滑り込ませた。"
              },
              {
                "speaker": "shichijo",
                "text": "その書類は？"
              },
              {
                "speaker": "saya",
                "text": "仕事のものです"
              },
              {
                "speaker": "shichijo",
                "text": "少し見せていただけますか"
              },
              {
                "speaker": "saya",
                "text": "……それは困ります"
              },
              {
                "narrator": "沙耶は紙包みに手を置いたまま、七条から視線を外した。"
              }
            ],
            "setFlags": {
              "sayaSuspicious": true
            }
          }
        ],
        "evidence": []
      }
    },
    "K3": {
      "type": "location",
      "spotId": "K3",
      "location": "桐生屋店内",
      "background": "images/backgrounds/bg_kiryuya_inside.webp",
      "enterVariants": [
        {
          "id": "k3_intro",
          "requiresAll": [
            "preWeddingPhotoKnown"
          ],
          "onceFlag": "_seen_k3_intro",
          "lines": [
            {
              "speaker": "sojiro",
              "text": "これが前撮りの写真です"
            },
            {
              "narrator": "北野天満宮で撮られた紗月の写真が置かれた。"
            }
          ],
          "evidence": {
            "satsukiPhoto": true
          }
        }
      ],
      "idleText": "桐生屋店内。前撮り写真もこの場で確認できる。",
      "commands": {
        "talk": [
          {
            "id": "talk_sojiro_photo",
            "label": "桐生宗次郎",
            "lines": [
              {
                "speaker": "sojiro",
                "text": "必要なら、写真をよく見てください"
              }
            ]
          }
        ],
        "ask": [],
        "look": [
          {
            "id": "look_photo_face",
            "label": "前撮り写真：顔",
            "lines": [
              {
                "narrator": "紗月が穏やかに笑っている。"
              }
            ],
            "requiresAll": [
              "preWeddingPhotoKnown"
            ]
          },
          {
            "id": "look_photo_kimono",
            "label": "前撮り写真：着物",
            "lines": [
              {
                "narrator": "華やかな意匠の着物だ。"
              }
            ],
            "requiresAll": [
              "preWeddingPhotoKnown"
            ]
          },
          {
            "id": "look_photo_hand",
            "label": "前撮り写真：手",
            "lines": [
              {
                "narrator": "紗月の指先には、特徴的なネイルが施されている。"
              },
              {
                "speaker": "shichijo",
                "text": "この手元を記録させていただいても？"
              },
              {
                "speaker": "sojiro",
                "text": "構いませんよ"
              }
            ],
            "setFlags": {
              "nailFound": true
            },
            "evidence": {
              "satsukiNail": true
            },
            "requiresAll": [
              "preWeddingPhotoKnown"
            ]
          }
        ],
        "search": [],
        "evidence": []
      }
    },
    "S1": {
      "type": "location",
      "spotId": "S1",
      "location": "京都駅構内",
      "background": "images/backgrounds/bg_kyoto_station_concourse.webp",
      "enterVariants": [
        {
          "id": "s1_intro",
          "notFlags": [
            "stationVisited"
          ],
          "onceFlag": "_seen_s1_intro",
          "lines": [
            {
              "narrator": "七条は京都駅へ向かった。人の流れが絶えない。"
            },
            {
              "narrator": "ホテルを出た5人目は、作業着姿で大きな箱を持っていた。"
            }
          ],
          "setFlags": {
            "stationVisited": true
          }
        }
      ],
      "idleText": "人の流れが絶えない京都駅構内。",
      "commands": {
        "talk": [],
        "ask": [],
        "look": [
          {
            "id": "look_station_flow",
            "label": "駅構内を見る",
            "lines": [
              {
                "narrator": "売店、コインロッカー、在来線改札へ人が流れている。"
              }
            ]
          }
        ],
        "search": [],
        "evidence": []
      }
    },
    "S2": {
      "type": "location",
      "spotId": "S2",
      "location": "京都駅・売店",
      "background": "images/backgrounds/bg_kyoto_station_shop.webp",
      "idleText": "駅構内の売店。店員がレジに立っている。",
      "commands": {
        "talk": [
          {
            "id": "talk_clerk",
            "label": "売店店員",
            "lines": [
              {
                "speaker": "shopClerk",
                "text": "何でしょうか"
              }
            ]
          }
        ],
        "ask": [
          {
            "id": "ask_show_photo",
            "label": "紗月の写真を見せる",
            "lines": [
              {
                "speaker": "shichijo",
                "text": "この女性を見ませんでしたか"
              },
              {
                "speaker": "shopClerk",
                "text": "あ、この人なら覚えています。ここで飲み物を買われました"
              },
              {
                "speaker": "shichijo",
                "text": "なぜ覚えていたのです？"
              },
              {
                "speaker": "shopClerk",
                "text": "支払いのとき、小銭を何枚も床に落としてしまって。私も一緒に拾ったんです"
              }
            ],
            "setFlags": {
              "shopPhotoShown": true
            }
          },
          {
            "id": "ask_clothes",
            "label": "その時の服装",
            "lines": [
              {
                "speaker": "shopClerk",
                "text": "普通の服でしたよ"
              }
            ],
            "setFlags": {
              "shopClothesKnown": true
            },
            "requiresAll": [
              "shopPhotoShown"
            ]
          },
          {
            "id": "ask_bag",
            "label": "バッグを持っていた？",
            "lines": [
              {
                "speaker": "shopClerk",
                "text": "女性もののバッグを持っていました"
              }
            ],
            "setFlags": {
              "shopBagKnown": true
            },
            "requiresAll": [
              "shopPhotoShown"
            ]
          },
          {
            "id": "ask_direction",
            "label": "買い物の後、どちらへ？",
            "lines": [
              {
                "speaker": "shopClerk",
                "text": "在来線の改札の方へ行きました。一人でしたよ"
              }
            ],
            "setFlags": {
              "shopDirectionKnown": true,
              "shopWitness": true
            },
            "requiresAll": [
              "shopPhotoShown"
            ]
          }
        ],
        "look": [],
        "search": [],
        "evidence": []
      }
    },
    "S3": {
      "type": "location",
      "spotId": "S3",
      "location": "京都駅・コインロッカー",
      "background": "images/backgrounds/bg_kyoto_station_locker.webp",
      "idleText": "駅構内のコインロッカーが並んでいる。",
      "commands": {
        "talk": [],
        "ask": [
          {
            "id": "ask_around_locker",
            "label": "周辺で聞き込む",
            "lines": [
              {
                "narrator": "周辺で聞き込むが、紗月を覚えている人物はいなかった。"
              }
            ]
          }
        ],
        "look": [
          {
            "id": "look_lockers",
            "label": "ロッカーを見る",
            "lines": [
              {
                "narrator": "コインロッカーが並んでいる。どれを使ったかを示す手掛かりはない。"
              }
            ]
          }
        ],
        "search": [
          {
            "id": "search_lockers",
            "label": "コインロッカー周辺",
            "lines": [
              {
                "narrator": "周囲を調べても、紗月がここを使ったと確認できる材料は見つからない。"
              },
              {
                "narrator": "そのとき、少し離れた多目的トイレの前で、駅員と清掃員が何か話しているのが見えた。"
              }
            ],
            "setFlags": {
              "lockerChecked": true,
              "toiletUnlocked": true
            }
          }
        ],
        "evidence": []
      }
    },
    "S4": {
      "type": "location",
      "spotId": "S4",
      "location": "京都駅・多目的トイレ前",
      "background": "images/backgrounds/bg_kyoto_station_multipurpose_toilet.webp",
      "enterVariants": [
        {
          "id": "s4_intro",
          "onceFlag": "_seen_s4_intro",
          "lines": [
            {
              "narrator": "多目的トイレの前で、駅員と清掃員が話している。足元には、平たく畳まれた大きな段ボール箱があった。"
            }
          ]
        }
      ],
      "idleText": "駅員と清掃員が、多目的トイレ前で話している。",
      "commands": {
        "talk": [
          {
            "id": "talk_station_staff",
            "label": "駅員",
            "lines": [
              {
                "speaker": "shichijo",
                "text": "失礼。何かあったのですか"
              },
              {
                "narrator": "駅員が七条に向き直った。"
              }
            ],
            "setFlags": {
              "stationStaffTalked": true
            }
          },
          {
            "id": "talk_cleaner",
            "label": "清掃員",
            "lines": [
              {
                "narrator": "清掃員は、トイレ内に残されていた箱を指さした。"
              }
            ]
          }
        ],
        "ask": [
          {
            "id": "ask_what_happened",
            "label": "何があった？",
            "lines": [
              {
                "narrator": "駅員は、多目的トイレの中に大きな箱が置かれていたと説明した。"
              }
            ],
            "requiresAny": [
              "stationStaffTalked"
            ]
          },
          {
            "id": "ask_when_found",
            "label": "いつ見つかった？",
            "lines": [
              {
                "narrator": "清掃の際に見つかったという。ホテルから五人目が出た後の時間帯と大きく矛盾しない。"
              }
            ],
            "requiresAny": [
              "stationStaffTalked"
            ]
          }
        ],
        "look": [
          {
            "id": "look_folded_box",
            "label": "畳まれた箱",
            "lines": [
              {
                "narrator": "ホテルを出た5人目が持っていたものと同じくらいの大きさの箱だ。"
              }
            ],
            "image": "images/evidence/ev_folded_box.webp"
          }
        ],
        "search": [
          {
            "id": "search_folded_box",
            "label": "畳まれた段ボール箱",
            "lines": [
              {
                "narrator": "箱は平たく畳まれている。持ち主を特定できる表示はない。"
              }
            ],
            "setFlags": {
              "foldedBoxFound": true,
              "gateUnlocked": true
            },
            "evidence": {
              "foldedBox": true
            },
            "requiresAny": [
              "stationStaffTalked"
            ],
            "image": "images/evidence/ev_folded_box.webp"
          }
        ],
        "evidence": []
      }
    },
    "S5": {
      "type": "location",
      "spotId": "S5",
      "location": "京都駅・在来線改札前",
      "background": "images/backgrounds/bg_kyoto_station_gate.webp",
      "idleText": "在来線改札前。発車案内が見える。",
      "commands": {
        "talk": [],
        "ask": [],
        "look": [
          {
            "id": "look_departures",
            "label": "発車案内",
            "lines": [
              {
                "narrator": "売店で紗月が目撃されたのは、10時前。"
              },
              {
                "narrator": "その時間帯の発車案内には、琵琶湖線方面の列車が表示されている。"
              }
            ],
            "setFlags": {
              "departureBoardChecked": true
            }
          }
        ],
        "search": [],
        "evidence": [
          {
            "id": "organize_station",
            "label": "京都駅で得た情報を整理する",
            "requiresAll": [
              "departureBoardChecked",
              "foldedBoxFound",
              "shopWitness"
            ],
            "notFlags": [
              "stationMysterySolved"
            ],
            "quiz": {
              "question": "ホテルを出た後、紗月はどうしたと考えられるか？",
              "choices": [
                {
                  "text": "そのまま作業着で移動した",
                  "correct": false
                },
                {
                  "text": "どこかで私服に着替えた",
                  "correct": true
                },
                {
                  "text": "ホテルへ戻った",
                  "correct": false
                },
                {
                  "text": "沙耶と合流した",
                  "correct": false
                }
              ],
              "correctText": "売店では私服姿でした。ホテルを出た後、どこかで着替えたと考えられます。",
              "wrongText": "売店での服装を思い出してみましょう。",
              "nextQuiz": {
                "question": "箱を処理した可能性が高い場所は？",
                "choices": [
                  {
                    "text": "売店",
                    "correct": false
                  },
                  {
                    "text": "コインロッカー",
                    "correct": false
                  },
                  {
                    "text": "多目的トイレ",
                    "correct": true
                  },
                  {
                    "text": "ホテルの外",
                    "correct": false
                  }
                ],
                "correctText": "多目的トイレで畳まれた大きな箱が見つかっています。",
                "wrongText": "畳まれた箱が見つかった場所を確認しましょう。",
                "nextQuiz": {
                  "question": "紗月が次に向かった可能性が最も高いのは？",
                  "choices": [
                    {
                      "text": "新幹線方面",
                      "correct": false
                    },
                    {
                      "text": "近鉄線方面",
                      "correct": false
                    },
                    {
                      "text": "琵琶湖線方面",
                      "correct": true
                    },
                    {
                      "text": "京都駅の外",
                      "correct": false
                    }
                  ],
                  "correctText": "琵琶湖線方面が有力です。ただし、実際に乗車したとは断定できません。",
                  "wrongText": "売店を出た時刻と発車案内を確認してみましょう。",
                  "setFlags": {
                    "stationMysterySolved": true,
                    "hotelReturnUnlocked": true
                  },
                  "afterLines": [
                    {
                      "narrator": "京都駅で得られた情報が一通りそろった。"
                    }
                  ]
                }
              }
            }
          }
        ]
      }
    },
    "H6": {
      "type": "location",
      "spotId": "H6",
      "location": "ホテル・祝電置き場",
      "background": "images/backgrounds/bg_hotel_gift_area.webp",
      "enterVariants": [
        {
          "id": "h6_intro",
          "onceFlag": "_seen_h6_intro",
          "lines": [
            {
              "narrator": "披露宴会場の一角には、届いた祝電がまとめられていた。"
            },
            {
              "speaker": "hotelStaff",
              "text": "桐生様、こちらの祝電ですが……"
            },
            {
              "speaker": "soichiro",
              "text": "今はそのままにしておいてください"
            },
            {
              "speaker": "shichijo",
              "text": "宗一郎さん。これも祝電ですか"
            }
          ]
        }
      ],
      "idleText": "祝電の束の中に、一通だけ雰囲気の違う写真電報がある。",
      "commands": {
        "talk": [
          {
            "id": "talk_soichiro_telegram",
            "label": "桐生宗一郎",
            "lines": [
              {
                "speaker": "soichiro",
                "text": "その電報が、どうかしましたか"
              }
            ]
          }
        ],
        "ask": [
          {
            "id": "ask_sender",
            "label": "差出人",
            "lines": [
              {
                "speaker": "shichijo",
                "text": "差出人は？"
              },
              {
                "speaker": "soichiro",
                "text": "……分かりません"
              }
            ],
            "requiresAll": [
              "telegramFound"
            ]
          },
          {
            "id": "ask_clue",
            "label": "『あの日』に心当たりは？",
            "lines": [
              {
                "speaker": "shichijo",
                "text": "『あの日』という言葉に、心当たりは？"
              },
              {
                "speaker": "soichiro",
                "text": "ありません"
              }
            ],
            "setFlags": {
              "telegramAsked": true,
              "chapter1Clear": true
            },
            "requiresAll": [
              "telegramFound"
            ],
            "notFlags": [
              "chapter1Clear"
            ]
          }
        ],
        "look": [
          {
            "id": "look_telegram",
            "label": "写真電報",
            "lines": [
              {
                "narrator": "湖上に浮かぶ灯浮標。その下には一文だけが記されていた。"
              },
              {
                "narrator": "『あの日のことを、すべて話してください。』"
              }
            ],
            "setFlags": {
              "telegramFound": true
            },
            "evidence": {
              "telegram": true
            },
            "image": "images/evidence/ev_photo_telegram.webp"
          }
        ],
        "search": [
          {
            "id": "search_telegram",
            "label": "写真と文面",
            "lines": [
              {
                "narrator": "写真には湖上の灯浮標が写っている。失踪事件との関係を示すものは、まだない。"
              }
            ],
            "requiresAll": [
              "telegramFound"
            ]
          }
        ],
        "evidence": []
      }
    }
  }
};
