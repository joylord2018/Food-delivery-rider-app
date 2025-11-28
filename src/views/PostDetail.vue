<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCommunityStore } from '../stores/community'
import { toast } from '../utils/toast'

const route = useRoute()
const router = useRouter()
const communityStore = useCommunityStore()

// 获取帖子ID
const postId = route.params.id as string

// 评论输入
const commentInput = ref('')

// 加载帖子详情
const loadPostDetail = async () => {
  try {
    await communityStore.fetchPostDetail(postId)
  } catch (error) {
    toast.error('加载帖子详情失败')
    router.back()
  }
}

// 发布评论
const submitComment = async () => {
  const content = commentInput.value.trim()
  if (!content) {
    toast.error('请输入评论内容')
    return
  }
  
  try {
    const success = await communityStore.createComment(postId, content)
    if (success) {
      toast.success('评论发布成功')
      commentInput.value = ''
    } else {
      toast.error('评论发布失败')
    }
  } catch (error) {
    toast.error('评论发布失败，请重试')
  }
}

// 返回社区首页
const goBack = () => {
  router.back()
}

// 页面挂载时加载数据
onMounted(() => {
  loadPostDetail()
})
</script>

<template>
  <div class="post-detail-container">
    <!-- 顶部导航栏-->
    <van-nav-bar title="帖子详情" class="custom-nav-bar">
      <template #left>
        <div @click="goBack" class="back-btn">
          <van-icon name="arrow-left" size="20" color="#fff" />
        </div>
      </template>
    </van-nav-bar>
    
    <!-- 帖子内容 -->
    <div v-if="communityStore.currentPost" class="post-content">
      <!-- 帖子头部 -->
      <div class="post-header">
        <div class="user-info">
          <van-image
            :src="communityStore.currentPost.userAvatar"
            round
            width="48"
            height="48"
            class="user-avatar"
          />
          <div class="user-details">
            <div class="user-name">{{ communityStore.currentPost.userName }}</div>
            <div class="post-time">{{ new Date(communityStore.currentPost.createTime).toLocaleString() }}</div>
          </div>
        </div>
      </div>
      
      <!-- 帖子标题和内容-->
      <div class="post-main">
        <h1 class="post-title">{{ communityStore.currentPost.title }}</h1>
        <div class="post-text">{{ communityStore.currentPost.content }}</div>
        
        <!-- 帖子图片 -->
        <div class="post-images" v-if="communityStore.currentPost.images && communityStore.currentPost.images.length > 0">
          <van-image
            v-for="(image, index) in communityStore.currentPost.images"
            :key="index"
            :src="image"
            fit="cover"
            class="post-image"
          />
        </div>
        
        <!-- 帖子标签 -->
        <div class="post-tags" v-if="communityStore.currentPost.tags.length > 0">
          <van-tag
            v-for="tag in communityStore.currentPost.tags"
            :key="tag"
            color="#e6f7ff"
            text-color="#1989fa"
            class="post-tag"
          >
            {{ tag }}
          </van-tag>
        </div>
      </div>
      
      <!-- 帖子底部操作栏-->
      <div class="post-footer">
        <div class="post-stats">
          <div class="stat-item" @click="communityStore.likePost(communityStore.currentPost.id)">
            <van-icon 
              :name="communityStore.currentPost.isLiked ? 'like' : 'like-o'" 
              :color="communityStore.currentPost.isLiked ? '#f5222d' : '#969799'"
              size="20"
            />
            <span class="stat-text">{{ communityStore.currentPost.likes }}</span>
          </div>
          <div class="stat-item">
            <van-icon name="chat-o" size="20" />
            <span class="stat-text">{{ communityStore.currentPost.comments }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 评论列表 -->
    <div class="comments-section">
      <div class="comments-header">
        <h2 class="comments-title">评论 ({{ communityStore.comments.length }})</h2>
      </div>
      
      <!-- 评论列表 -->
      <div class="comments-list">
        <div
          v-for="comment in communityStore.comments"
          :key="comment.id"
          class="comment-item"
        >
          <van-image
            :src="comment.userAvatar"
            round
            width="40"
            height="40"
            class="comment-avatar"
          />
          <div class="comment-content">
            <div class="comment-header">
              <div class="comment-user">{{ comment.userName }}</div>
              <div class="comment-time">{{ new Date(comment.createTime).toLocaleString() }}</div>
            </div>
            <div class="comment-text">{{ comment.content }}</div>
            <div class="comment-footer">
              <div class="comment-like" @click="communityStore.likeComment(comment.id)">
                <van-icon 
                  :name="comment.isLiked ? 'like' : 'like-o'" 
                  :color="comment.isLiked ? '#f5222d' : '#969799'"
                  size="16"
                />
                <span class="like-count">{{ comment.likes }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 空评论提示-->
        <van-empty
          v-if="communityStore.comments.length === 0"
          description="暂无评论"
          image-size="80"
        />
      </div>
      
      <!-- 评论输入框-->
      <div class="comment-input-section">
        <div class="comment-input-container">
          <input
            v-model="commentInput"
            type="text"
            placeholder="写下你的评论..."
            class="comment-input"
            maxlength="200"
          />
          <van-button
            type="primary"
            size="small"
            @click="submitComment"
            :disabled="!commentInput.trim()"
            class="comment-submit-btn"
          >
            发送          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../variables' as *;

.post-detail-container {
  min-height: 100vh;
  background-color: $background-color;

  /* 顶部导航栏*/
  .custom-nav-bar {
    background: linear-gradient(135deg, $primary-color 0%, #36cfc9 100%);
    color: $white;

    :deep(.van-nav-bar__title) {
      color: $white;
      font-weight: 600;
    }

    .back-btn {
      padding: 0 1rem;
      cursor: pointer;
    }
  }

  /* 帖子内容 */
  .post-content {
    background-color: $white;
    padding: 1.5rem;
    margin-bottom: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

    /* 帖子头部 */
    .post-header {
      margin-bottom: 1.5rem;

      .user-info {
        display: flex;
        align-items: center;
        gap: 1rem;

        .user-avatar {
          border: 2px solid #f0f2f5;
        }

        .user-details {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;

          .user-name {
            font-size: 1.5rem;
            font-weight: 500;
            color: $text-color;
          }

          .post-time {
            font-size: 1.2rem;
            color: $text-color-secondary;
          }
        }
      }
    }

    /* 帖子主体 */
    .post-main {
      margin-bottom: 1.5rem;

      .post-title {
        font-size: 1.8rem;
        font-weight: 600;
        color: $text-color;
        margin-bottom: 1rem;
        line-height: 1.4;
      }

      .post-text {
        font-size: 1.4rem;
        color: #646566;
        line-height: 1.6;
        margin-bottom: 1.5rem;
        white-space: pre-wrap;
      }

      /* 帖子图片 */
      .post-images {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 1.5rem;

        .post-image {
          width: 100%;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
      }

      /* 帖子标签 */
      .post-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.8rem;
        margin-bottom: 1.5rem;

        .post-tag {
          font-size: 1.2rem;
        }
      }
    }

    /* 帖子底部 */
    .post-footer {
      padding-top: 1rem;
      border-top: 1px solid $border-color;

      .post-stats {
        display: flex;
        gap: 2rem;

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            color: $primary-color;
          }

          .stat-text {
            font-size: 1.4rem;
            color: $text-color-secondary;
          }
        }
      }
    }
  }

  /* 评论区*/
  .comments-section {
    background-color: $white;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

    .comments-header {
      margin-bottom: 1.5rem;

      .comments-title {
        font-size: 1.6rem;
        font-weight: 600;
        color: $text-color;
      }
    }

    /* 评论列表 */
    .comments-list {
      margin-bottom: 1.5rem;

      .comment-item {
        display: flex;
        gap: 1rem;
        padding-bottom: 1.5rem;
        margin-bottom: 1.5rem;
        border-bottom: 1px solid $border-color;

        &:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .comment-avatar {
          flex-shrink: 0;
        }

        .comment-content {
          flex: 1;

          .comment-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;

            .comment-user {
              font-size: 1.4rem;
              font-weight: 500;
              color: $text-color;
            }

            .comment-time {
              font-size: 1.2rem;
              color: $text-color-secondary;
            }
          }

          .comment-text {
            font-size: 1.4rem;
            color: #646566;
            line-height: 1.6;
            margin-bottom: 0.8rem;
            white-space: pre-wrap;
          }

          .comment-footer {
            display: flex;
            justify-content: flex-start;

            .comment-like {
              display: flex;
              align-items: center;
              gap: 0.3rem;
              cursor: pointer;
              transition: all 0.3s ease;

              &:hover {
                color: $primary-color;
              }

              .like-count {
                font-size: 1.2rem;
                color: $text-color-secondary;
              }
            }
          }
        }
      }
    }

    /* 评论输入框*/
    .comment-input-section {
      padding-top: 1rem;
      border-top: 1px solid $border-color;

      .comment-input-container {
        display: flex;
        gap: 1rem;
        align-items: flex-end;

        .comment-input {
          flex: 1;
          font-size: 1.4rem;
          padding: 1rem;
          border: 1px solid $border-color;
          border-radius: 20px;
          outline: none;
          resize: none;
          min-height: 40px;
          max-height: 100px;
          overflow-y: auto;

          &::placeholder {
            color: #c8c9cc;
          }
        }

        .comment-submit-btn {
          border-radius: 20px;
          font-size: 1.4rem;
          padding: 0.8rem 1.5rem;
          flex-shrink: 0;
        }
      }
    }
  }
}
</style>
