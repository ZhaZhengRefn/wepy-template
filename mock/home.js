module.exports = {
    'get /time/index': (ctx, next) => {
      ctx.status = 200
      ctx.body = {
        "data": {
          "user_id": 1,
          "avatar": "http://wx.qlogo.cn/mmopen/vi_32/y8nfXociavYkXF2zjZzLrFkulgKxfgdTNCvick8ia9U5icbqzWyX9qVShEx82XGOOjVicjaP5RCoejAF2eOyicJ7hQjw/0",
          "nickname": "冬瓜",
          "level":1,
          "join":true,
          "week_index": 1,
          "date": "2017年12月22日",
          "useful_time": 500,
          "yesterday_useful_time": 460,
          "useful_of_day": "14.6%",
          "time_data": [
            {"type":1,"value":60},
            {"type":2,"value":50},
            {"type":3,"value":40}
          ],
          "image_url":"https://dn-phphub.qbox.me/uploads/avatars/76_1451276555.png?imageView2/1/w/200/h/200",
          "group_avatar": [
            "http://wx.qlogo.cn/mmopen/vi_32/UjZuyy1KWaWfGnKsVoyLEjB4aVmljCxO0riciaKiaU7kbITnMKGrSjjBBoLsleWvRQG3mL2sSFel0F0kib8L89cWuw/0",
            "http://wx.qlogo.cn/mmopen/vi_32/IhcdatPBGXlBv7gA9gMmMryZ3hxx14CvEZ0fzvny7MmaWzfPFFdVXyykhqsCwbl4pXhsddGub3p4oicqRARjyrw/0",
            "http://wx.qlogo.cn/mmopen/gGPbicX5YYSCUnLGlgib3mL2Wp2NARlRPRlxawNgoibzsqqfIHfY2uJDjR9TqcjHvllLiaAzHqHdT2CYuTpGrNGhxBKlUslpCxibB/0"
          ],
          "time_records": [
            {
              "title": "熊猫小课阅读",
              "time": 30,
              "type": 1
            },
            {
              "title": "看动漫看动漫看动漫看动漫看动漫看动漫看动漫",
              "time": 120,
              "type": 2
            },
            {
              "title": "打球打球打球打球打球打球打球打球打球打球",
              "time": 60,
              "type": 3
            },
            {
              "title": "跑步",
              "time": 70,
              "type": 1
            },
            {
              "title": "做PPT",
              "time": 7,
              "type": 3
            }
          ]
        }        
      }
    },
    'post /login':{
      "data": {
          "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MiwiZXhwIjoxNTE3Mzk2ODAyLCJvcGVuaWQiOiJvNVh3STBVOVc1VWw1NjNjWnZoa0tyNDMydldjIiwidW5pb25pZCI6Im84NkM5czRRc2JNeDhQSHh4djNuZGhmWE9icmMifQ.dNG4ABzHYhUGN6T84_2ezCTnMe3PSQO7kjl6qSTfJH8",
          "auth": true
      }
    },
    'post /login/info': {
      errcode: 0,
      errmsg: ''
    }
}