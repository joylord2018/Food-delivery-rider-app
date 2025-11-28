<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCommunityStore } from '../stores/community'
import { toast } from '../utils/toast'

const router = useRouter()
const communityStore = useCommunityStore()

// 加载状态
const loading = ref(false)
const refreshing = ref(false)

// 筛选条件
const activeTab = ref('latest')
const searchKeyword = ref('')

// 加载帖子列表
const loadPosts = async () => {
  loading.value = true
  try {
    await communityStore.fetchPosts()
  } catch (error) {
    toast.error('加载帖子列表失败')
  } finally {
    loading.value = false
  }
}

// 下拉刷新
const onRefresh = async () => {
  refreshing.value = true
  try {
    await communityStore.fetchPosts()
    toast.success('帖子列表已更新')
  } catch (error) {
    toast.error('刷新失败')
  } finally {
    refreshing.value = false
  }
}

// 跳转到帖子详情
const goToPostDetail = (postId: string) => {
  router.push(`/community/post/${postId}`)
}

// 跳转到发布帖子页面
const goToCreatePost = () => {
  router.push('/community/create')
}

// 计算属性：筛选后的帖子列表
const filteredPosts = computed(() => {
  let posts = activeTab.value === 'hot' ? communityStore.hotPosts : communityStore.latestPosts
  
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.trim().toLowerCase()
    posts = posts.filter(post => 
      post.title.toLowerCase().includes(keyword) || 
      post.content.toLowerCase().includes(keyword) ||
      post.tags.some(tag => tag.toLowerCase().includes(keyword))
    )
  }
  
  return posts
})

// 页面挂载时加载数据
onMounted(() => {
  loadPosts()
})
</script>

<template>
  <div class="community-container">
    <!-- 顶部导航栏-->
    <van-nav-bar title="骑手社区" class="custom-nav-bar" left-arrow @click-left="() => $router.back()">
      <template #right>
        <div @click="goToCreatePost" class="create-btn">
          <van-icon name="plus" size="20" color="#fff" />
        </div>
      </template>
    </van-nav-bar>

    <!-- 搜索栏-->
    <div class="search-section">
      <van-search
        v-model="searchKeyword"
        placeholder="搜索帖子、话题"
        background="#fff"
        shape="round"
        @search="loadPosts"
      />
    </div>

    <!-- 筛选标签页 -->
    <div class="filter-tabs">
      <van-tabs v-model:active="activeTab">
        <van-tab title="最新" name="latest" />
        <van-tab title="热门" name="hot" />
      </van-tabs>
    </div>

    <!-- 帖子列表 -->
    <div class="posts-section">
      <van-skeleton :loading="loading" title :rows="5" animated>
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <div class="posts-list">
            <van-empty
              v-if="filteredPosts.length === 0"
              description="暂无帖子"
              image-size="100"
            >
              <template #bottom>
                <van-button type="primary" size="small" @click="loadPosts">
                  刷新帖子
                </van-button>
              </template>
            </van-empty>
            <div v-else class="post-list">
              <div
                v-for="post in filteredPosts"
                :key="post.id"
                class="post-item"
                @click="goToPostDetail(post.id)"
              >
                <div class="post-header">
                  <div class="user-info">
                    <van-image
                      :src="post.userAvatar"
                      round
                      width="40"
                      height="40"
                      class="user-avatar"
                    />
                    <div class="user-details">
                      <div class="user-name">{{ post.userName }}</div>
                      <div class="post-time">{{ new Date(post.createTime).toLocaleString() }}</div>
                    </div>
                  </div>
                </div>
                
                <div class="post-content">
                  <h3 class="post-title">{{ post.title }}</h3>
                  <div class="post-text">{{ post.content }}</div>
                  
                  <!-- 帖子图片 -->
                  <div class="post-images" v-if="post.images && post.images.length > 0">
                    <van-image
                      v-for="(image, index) in post.images"
                      :key="index"
                      :src="image"
                      fit="cover"
                      class="post-image"
                      :style="{ width: post.images.length === 1 ? '100%' : '48%', marginRight: index % 2 === 0 ? '4%' : '0' }"
                    />
                  </div>
                  
                  <!-- 帖子标签 -->
                  <div class="post-tags" v-if="post.tags.length > 0">
                    <van-tag
                      v-for="tag in post.tags"
                      :key="tag"
                      color="#e6f7ff"
                      text-color="#1989fa"
                      class="post-tag"
                    >
                      {{ tag }}
                    </van-tag>
                  </div>
                </div>
                
                <div class="post-footer">
                  <div class="post-stats">
                    <div class="stat-item" @click.stop="communityStore.likePost(post.id)">
                      <van-icon 
                        :name="post.isLiked ? 'like-o' : 'like-o'" 
                        :color="post.isLiked ? '#f5222d' : '#969799'"
                        size="18"
                      />
                      <span class="stat-text">{{ post.likes }}</span>
                    </div>
                    <div class="stat-item">
                      <van-icon name="chat-o" size="18" />
                      <span class="stat-text">{{ post.comments }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-pull-refresh>
      </van-skeleton>
    </div>

    <!-- 发布帖子按钮 -->
    <div class="create-post-btn-container">
      <van-button
        type="primary"
        round
        size="large"
        icon="plus"
        @click="goToCreatePost"
        class="create-post-btn"
      >
        发布帖子
      </van-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* 引入全局变量 */
@use '../variables' as *;

.community-container {
  min-height: 100vh;
  background-color: $background-color;
  padding-bottom: 80px;
  
  /* 顶部导航栏 */
  .custom-nav-bar {
    background: linear-gradient(135deg, $primary-color 0%, #36cfc9 100%);
    color: #fff;
    
    :deep(.van-nav-bar__title) {
      color: #fff;
      font-weight: 600;
    }
  }
  
  .create-btn {
    padding: 0 1rem;
    cursor: pointer;
  }
  
  /* 搜索栏 */
  .search-section {
    padding: 1rem;
    background-color: $white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  
  /* 筛选标签页 */
  .filter-tabs {
    background-color: $white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    
    :deep(.van-tab) {
      font-size: 1.4rem;
      font-weight: 500;
    }
    
    :deep(.van-tabs__line) {
      background-color: $primary-color;
      height: 3px;
      width: 30px;
    }
  }
  
  /* 帖子列表 */
  .posts-section {
    padding: 0 1rem 1rem;
    
    .posts-list {
      background-color: $white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      
      .post-item {
        padding: 1.5rem;
        border-bottom: 1px solid $border-color;
        transition: all 0.3s ease;
        cursor: pointer;
        
        &:last-child {
          border-bottom: none;
        }
        
        &:hover {
          background-color: #fafafa;
        }
        
        /* 帖子头部 */
        .post-header {
          margin-bottom: 1rem;
          
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
                font-size: 1.4rem;
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
        
        /* 帖子内容 */
        .post-content {
          margin-bottom: 1rem;
          
          .post-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: $text-color;
            margin-bottom: 0.8rem;
            line-height: 1.4;
          }
          
          .post-text {
            font-size: 1.3rem;
            color: #646566;
            line-height: 1.5;
            margin-bottom: 1rem;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
          }
          
          /* 帖子图片 */
          .post-images {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            margin-bottom: 1rem;
            
            .post-image {
              border-radius: 8px;
              aspect-ratio: 1 / 1;
              object-fit: cover;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
          }
          
          /* 帖子标签 */
          .post-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.8rem;
            margin-bottom: 1rem;
            
            .post-tag {
              font-size: 1.2rem;
            }
          }
        }
        
        /* 帖子底部 */
        .post-footer {
          display: flex;
          justify-content: flex-end;
          
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
                font-size: 1.3rem;
                color: $text-color-secondary;
              }
            }
          }
        }
      }
    }
  }
  
  /* 发布帖子按钮 */
  .create-post-btn-container {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 100;
    
    .create-post-btn {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      font-size: 1.4rem;
      font-weight: 600;
      background: linear-gradient(135deg, $primary-color 0%, #36cfc9 100%);
      border: none;
      box-shadow: 0 4px 16px rgba(25, 137, 250, 0.3);
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(25, 137, 250, 0.4);
      }
    }
  }
}
</style>
