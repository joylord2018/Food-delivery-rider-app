import { defineStore } from 'pinia'
import { apiService } from '../services/apiService'

export interface Comment {
  id: string
  postId: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  createTime: string
  likes: number
  isLiked: boolean
}

export interface Post {
  id: string
  userId: string
  userName: string
  userAvatar: string
  title: string
  content: string
  images?: string[]
  createTime: string
  likes: number
  comments: number
  isLiked: boolean
  tags: string[]
}

export const useCommunityStore = defineStore('community', {
  state: () => ({
    posts: [] as Post[],
    currentPost: null as Post | null,
    comments: [] as Comment[],
    loading: false
  }),

  actions: {
    // 获取帖子列表
    async fetchPosts() {
      this.loading = true
      try {
        const data = await apiService.get('/api/community/posts')
        
        if (data.code === 200) {
          this.posts = data.data
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error)
      } finally {
        this.loading = false
      }
    },

    // 获取帖子详情
    async fetchPostDetail(postId: string) {
      this.loading = true
      try {
        const data = await apiService.get(`/api/community/posts/${postId}`)
        
        if (data.code === 200) {
          this.currentPost = data.data.post
          this.comments = data.data.comments
        }
      } catch (error) {
        console.error('Failed to fetch post detail:', error)
      } finally {
        this.loading = false
      }
    },

    // 发布帖子
    async createPost(postData: {
      title: string
      content: string
      images?: string[]
      tags: string[]
    }) {
      this.loading = true
      try {
        const data = await apiService.post('/api/community/posts', postData)
        
        if (data.code === 200) {
          this.posts.unshift(data.data)
          return true
        }
        return false
      } catch (error) {
        console.error('Failed to create post:', error)
        return false
      } finally {
        this.loading = false
      }
    },

    // 点赞帖子
    async likePost(postId: string) {
      try {
        const data = await apiService.post(`/api/community/posts/${postId}/like`, {})
        
        if (data.code === 200) {
          // 更新本地帖子状态
          const post = this.posts.find(p => p.id === postId)
          if (post) {
            post.isLiked = !post.isLiked
            post.likes += post.isLiked ? 1 : -1
          }
          // 更新当前帖子状态
          if (this.currentPost?.id === postId) {
            this.currentPost.isLiked = !this.currentPost.isLiked
            this.currentPost.likes += this.currentPost.isLiked ? 1 : -1
          }
          return true
        }
        return false
      } catch (error) {
        console.error('Failed to like post:', error)
        return false
      }
    },

    // 发布评论
    async createComment(postId: string, content: string) {
      this.loading = true
      try {
        const data = await apiService.post('/api/community/comments', { postId, content })
        
        if (data.code === 200) {
          this.comments.unshift(data.data)
          // 更新帖子评论数
          const post = this.posts.find(p => p.id === postId)
          if (post) {
            post.comments += 1
          }
          if (this.currentPost?.id === postId) {
            this.currentPost.comments += 1
          }
          return true
        }
        return false
      } catch (error) {
        console.error('Failed to create comment:', error)
        return false
      } finally {
        this.loading = false
      }
    },

    // 点赞评论
    async likeComment(commentId: string) {
      try {
        const data = await apiService.post(`/api/community/comments/${commentId}/like`, {})
        
        if (data.code === 200) {
          // 更新本地评论状态
          const comment = this.comments.find(c => c.id === commentId)
          if (comment) {
            comment.isLiked = !comment.isLiked
            comment.likes += comment.isLiked ? 1 : -1
          }
          return true
        }
        return false
      } catch (error) {
        console.error('Failed to like comment:', error)
        return false
      }
    }
  },

  getters: {
    // 热门帖子（按点赞数排序）
    hotPosts: (state) => {
      return [...state.posts].sort((a, b) => b.likes - a.likes)
    },
    
    // 最新帖子（按创建时间排序）
    latestPosts: (state) => {
      return [...state.posts].sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
    }
  },


})
