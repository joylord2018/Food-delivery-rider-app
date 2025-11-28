import { MockMethod } from 'vite-plugin-mock'

export default [
  // 获取天气数据
  {
    url: '/api/weather',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: {
          weather: {
            city: '北京市',
            temperature: 22,
            weather: '晴',
            windSpeed: '3-4级',
            humidity: '45%',
            updateTime: new Date().toISOString()
          },
          alerts: [
            {
              id: 'alert-1',
              title: '高温预警',
              description: '预计未来24小时内，北京地区最高气温将达到35℃以上，请注意防暑降温。',
              level: 'warning' as const,
              createTime: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30分钟前
            },
            {
              id: 'alert-2',
              title: '大风预警',
              description: '预计未来12小时内，北京地区将有6-7级大风，阵风可达8级，请注意防范。',
              level: 'danger' as const,
              createTime: new Date(Date.now() - 1000 * 60 * 60).toISOString() // 1小时前
            }
          ],
          safetyTips: [
            {
              id: 'tip-1',
              title: '高温天气安全提示',
              content: '1. 避免在中午高温时段外出配送；2. 注意补充水分，随身携带防暑药品；3. 穿着透气、浅色的衣物；4. 如出现头晕、恶心等中暑症状，立即停止工作并就医。',
              type: 'weather' as const
            },
            {
              id: 'tip-2',
              title: '大风天气安全提示',
              content: '1. 注意固定好配送箱，防止物品掉落；2. 避开广告牌、临时搭建物等危险区域；3. 骑行时减速慢行，保持安全距离；4. 注意高空坠物风险。',
              type: 'weather' as const
            },
            {
              id: 'tip-3',
              title: '交通安全提示',
              content: '1. 遵守交通规则，不闯红灯、不逆行；2. 骑行时佩戴头盔，系好头盔带；3. 注意观察路况，尤其是路口和行人密集区域；4. 不要边骑车边看手机。',
              type: 'traffic' as const
            },
            {
              id: 'tip-4',
              title: '配送安全提示',
              content: '1. 取餐时与商家确认餐品数量和特殊要求；2. 配送过程中轻拿轻放，确保餐品完好；3. 送达时与顾客友好沟通，确认餐品无误；4. 遇到问题及时联系客服处理。',
              type: 'safety' as const
            }
          ]
        },
        message: 'success'
      }
    }
  }
] as MockMethod[]
