import { MockMethod } from 'vite-plugin-mock'

export default [
  // 获取帖子列表
  {
    url: '/api/community/posts',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: [
          {
            id: '1',
            userId: '1',
            userName: '骑手小王',
            userAvatar: 'https://picsum.photos/id/1/100/100',
            title: '今天遇到了一个超 nice 的顾客！',
            content: '今天送外卖的时候，顾客特意给我准备了一瓶冰饮料，说天气热辛苦了。真的太感动了！做骑手这么久，第一次遇到这么贴心的顾客。',
            images: ['https://picsum.photos/id/20/300/300'],
            createTime: '2024-01-15T14:30:00',
            likes: 45,
            comments: 12,
            isLiked: false,
            tags: ['暖心顾客', '日常分享']
          },
          {
            id: '2',
            userId: '2',
            userName: '老骑手小李',
            userAvatar: 'https://picsum.photos/id/2/100/100',
            title: '分享一些跑单技巧',
            content: '1. 高峰期尽量选择熟悉的区域\n2. 接单前先看路线，避免绕路\n3. 提前联系商家，确认出餐时间\n4. 遇到问题及时联系客服\n希望这些技巧能帮到大家！',
            images: [],
            createTime: '2024-01-15T13:15:00',
            likes: 89,
            comments: 23,
            isLiked: true,
            tags: ['跑单技巧', '经验分享']
          },
          {
            id: '3',
            userId: '3',
            userName: '新手骑手小张',
            userAvatar: 'https://picsum.photos/id/3/100/100',
            title: '第一次跑单紧张死了',
            content: '今天是我第一天跑单，紧张得手都抖了。不过还好遇到了很多热心的同行，给我指路，教我怎么接单。虽然只跑了5单，但感觉收获满满！',
            images: ['https://picsum.photos/id/21/300/300', 'https://picsum.photos/id/22/300/300'],
            createTime: '2024-01-15T12:00:00',
            likes: 32,
            comments: 18,
            isLiked: false,
            tags: ['新手体验', '日常分享']
          },
          {
            id: '4',
            userId: '4',
            userName: '骑手老陈',
            userAvatar: 'https://picsum.photos/id/4/100/100',
            title: '天气不好，大家注意安全',
            content: '今天雨下得很大，路面很滑。大家骑车一定要慢一点，安全第一！特别是过路口的时候，要注意观察来往车辆。',
            images: [],
            createTime: '2024-01-15T11:30:00',
            likes: 67,
            comments: 9,
            isLiked: false,
            tags: ['安全提醒', '天气']
          },
          {
            id: '5',
            userId: '5',
            userName: '骑手小周',
            userAvatar: 'https://picsum.photos/id/5/100/100',
            title: '今天的收入还不错',
            content: '今天跑了12单，收入200多块。虽然有点累，但是看到收入还是很开心的。继续加油！',
            images: ['https://picsum.photos/id/23/300/300'],
            createTime: '2024-01-15T10:15:00',
            likes: 28,
            comments: 15,
            isLiked: true,
            tags: ['收入分享', '日常分享']
          }
        ]
      }
    }
  },
  // 获取帖子详情
  {
    url: '/api/community/posts/:id',
    method: 'get',
    response: (request) => {
      const { id } = request.params
      return {
        code: 200,
        data: {
          post: {
            id,
            userId: '1',
            userName: '骑手小王',
            userAvatar: 'https://picsum.photos/id/1/100/100',
            title: '今天遇到了一个超 nice 的顾客！',
            content: '今天送外卖的时候，顾客特意给我准备了一瓶冰饮料，说天气热辛苦了。真的太感动了！做骑手这么久，第一次遇到这么贴心的顾客。',
            images: ['https://picsum.photos/id/20/300/300'],
            createTime: '2024-01-15T14:30:00',
            likes: 45,
            comments: 12,
            isLiked: false,
            tags: ['暖心顾客', '日常分享']
          },
          comments: [
            {
              id: '1',
              postId: id,
              userId: '2',
              userName: '老骑手小李',
              userAvatar: 'https://picsum.photos/id/2/100/100',
              content: '真不错，遇到这样的顾客心情都会变好！',
              createTime: '2024-01-15T14:45:00',
              likes: 5,
              isLiked: false
            },
            {
              id: '2',
              postId: id,
              userId: '3',
              userName: '新手骑手小张',
              userAvatar: 'https://picsum.photos/id/3/100/100',
              content: '羡慕了，我还没遇到过这么好的顾客',
              createTime: '2024-01-15T15:00:00',
              likes: 2,
              isLiked: true
            }
          ]
        }
      }
    }
  },
  // 发布帖子
  {
    url: '/api/community/posts',
    method: 'post',
    response: (request) => {
      const { title, content, images, tags } = request.body
      return {
        code: 200,
        data: {
          id: Date.now().toString(),
          userId: '1',
          userName: '骑手小王',
          userAvatar: 'https://picsum.photos/id/1/100/100',
          title,
          content,
          images,
          createTime: new Date().toISOString(),
          likes: 0,
          comments: 0,
          isLiked: false,
          tags
        }
      }
    }
  },
  // 点赞帖子
  {
    url: '/api/community/posts/:id/like',
    method: 'post',
    response: () => {
      return {
        code: 200,
        data: {
          success: true
        }
      }
    }
  },
  // 发布评论
  {
    url: '/api/community/comments',
    method: 'post',
    response: (request) => {
      const { postId, content } = request.body
      return {
        code: 200,
        data: {
          id: Date.now().toString(),
          postId,
          userId: '1',
          userName: '骑手小王',
          userAvatar: 'https://picsum.photos/id/1/100/100',
          content,
          createTime: new Date().toISOString(),
          likes: 0,
          isLiked: false
        }
      }
    }
  },
  // 点赞评论
  {
    url: '/api/community/comments/:id/like',
    method: 'post',
    response: () => {
      return {
        code: 200,
        data: {
          success: true
        }
      }
    }
  }
] as MockMethod[]
