<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useFeedbackStore } from '../stores/feedback'
import { toast } from '../utils/toast'

const feedbackStore = useFeedbackStore()

// 加载状态
const loading = ref(false)
const replying = ref(false)

// 回复表单
const replyForm = ref({
  ratingId: '',
  content: ''
})

// 弹窗状态
const replyDialogVisible = ref(false)

// 显示回复弹窗
const showReplyDialog = (ratingId: string) => {
  replyForm.value = {
    ratingId,
    content: ''
  }
  replyDialogVisible.value = true
}

// 关闭回复弹窗
const closeReplyDialog = () => {
  replyDialogVisible.value = false
}

// 提交回复
const submitReply = async () => {
  if (!replyForm.value.content.trim()) {
    toast.error('请输入回复内容')
    return
  }

  replying.value = true
  try {
    const success = await feedbackStore.replyToRating(replyForm.value.ratingId, replyForm.value.content)
    
    if (success) {
      toast.success('回复成功')
      closeReplyDialog()
    } else {
      toast.error('回复失败，请重试')
    }
  } catch (error) {
    toast.error('回复失败，请重试')
  } finally {
    replying.value = false
  }
}

// 加载评价列表
const loadRatings = async () => {
  loading.value = true
  try {
    await feedbackStore.fetchRatings()
  } catch (error) {
    toast.error('加载评价列表失败')
  } finally {
    loading.value = false
  }
}

// 计算属性
const averageRating = computed(() => feedbackStore.averageRating)
const positiveRatingRate = computed(() => feedbackStore.positiveRatingRate)

// 页面挂载时加载数据
onMounted(() => {
  loadRatings()
})
</script>

<template>
  <div class="rating-list-container">
    <!-- 顶部导航栏-->
    <van-nav-bar 
      title="评价列表" 
      class="custom-nav-bar"
      left-arrow
      @click-left="() => $router.back()"
    />

    <!-- 评分统计卡片 -->
    <div class="rating-stats-card">
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value">{{ averageRating }}</div>
          <div class="stat-label">平均评分</div>
          <div class="stat-stars">
            <van-rate :value="averageRating" readonly size="16" />
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ positiveRatingRate }}%</div>
          <div class="stat-label">好评率</div>
          <div class="stat-desc">4分及以上评价占比</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ feedbackStore.ratings.length }}</div>
          <div class="stat-label">评价总数</div>
          <div class="stat-desc">累计收到的评价</div>
        </div>
      </div>
    </div>

    <!-- 评价列表 -->
    <div class="ratings-section">
      <div class="section-header">
        <h3 class="section-title">评价列表</h3>
        <van-icon
          name="replay"
          size="18"
          :loading="loading"
          @click="loadRatings"
          class="refresh-icon"
        />
      </div>

      <van-skeleton :loading="loading" title :rows="5" animated>
        <div class="ratings-list">
          <van-empty
            v-if="feedbackStore.ratings.length === 0"
            description="暂无评价"
            image-size="100"
          >
            <template #bottom>
              <van-button type="primary" size="small" @click="loadRatings">
                刷新评价
              </van-button>
            </template>
          </van-empty>
          <div v-else class="rating-list">
            <div
              v-for="rating in feedbackStore.ratings"
              :key="rating.id"
              class="rating-item"
            >
              <div class="rating-header">
                <div class="customer-info">
                  <van-image
                    :src="rating.customerAvatar"
                    round
                    width="48"
                    height="48"
                    class="customer-avatar"
                  />
                  <div class="customer-details">
                    <div class="customer-name">{{ rating.customerName }}</div>
                    <div class="rating-time">{{ new Date(rating.createTime).toLocaleString() }}</div>
                  </div>
                </div>
                <div class="rating-score">
                  <van-rate :value="rating.rating" readonly size="16" />
                  <span class="score-text">{{ rating.rating }}分</span>
                </div>
              </div>
              
              <div class="rating-content">
                <div class="rating-comment">{{ rating.comment }}</div>
                
                <!-- 骑手回复 -->
                <div class="rider-reply" v-if="rating.reply">
                  <div class="reply-header">
                    <span class="reply-label">我的回复</span>
                    <span class="reply-time" v-if="rating.replyTime">
                      {{ new Date(rating.replyTime).toLocaleString() }}
                    </span>
                  </div>
                  <div class="reply-content">{{ rating.reply }}</div>
                </div>
              </div>
              
              <div class="rating-footer">
                <div class="order-info">订单号：{{ rating.orderId }}</div>
                <van-button
                  v-if="!rating.reply"
                  type="primary"
                  size="small"
                  @click="showReplyDialog(rating.id)"
                  class="reply-btn"
                >
                  回复
                </van-button>
                <div v-else class="replied-tag">已回复</div>
              </div>
            </div>
          </div>
        </div>
      </van-skeleton>
    </div>

    <!-- 回复弹窗 -->
    <van-popup v-model:show="replyDialogVisible" position="bottom" :style="{ height: '40%', borderRadius: '12px 12px 0 0' }">
      <div class="reply-dialog">
        <div class="dialog-header">
          <h3 class="dialog-title">回复评价</h3>
          <van-icon name="cross" size="20" @click="closeReplyDialog" class="close-icon" />
        </div>
        <div class="dialog-content">
          <van-field
            v-model="replyForm.content"
            type="textarea"
            placeholder="请输入回复内容"
            rows="4"
            :disabled="replying"
          />
        </div>
        <div class="dialog-footer">
          <van-button
            type="default"
            block
            size="large"
            @click="closeReplyDialog"
            :disabled="replying"
            class="cancel-btn"
          >
            取消
          </van-button>
          <van-button
            type="primary"
            block
            size="large"
            @click="submitReply"
            :loading="replying"
            :disabled="!replyForm.content.trim()"
            class="confirm-btn"
          >
            提交回复
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<style lang="scss" scoped>
@use '../variables' as *;

.rating-list-container {
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
  }

  /* 评分统计卡片 */
  .rating-stats-card {
    background-color: $white;
    padding: 1.5rem;
    margin: 1rem;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;

      .stat-item {
        text-align: center;
        padding: 1rem;

        .stat-value {
          font-size: 2.5rem;
          font-weight: 600;
          color: $text-color;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 1.3rem;
          font-weight: 500;
          color: #646566;
          margin-bottom: 0.3rem;
        }

        .stat-desc,
        .stat-stars {
          font-size: 1.2rem;
          color: $text-color-secondary;
        }
      }
    }
  }

  /* 评价列表 */
  .ratings-section {
    padding: 0 1rem 1rem;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;

      .section-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: $text-color;
        margin: 0;
      }

      .refresh-icon {
        cursor: pointer;
        color: $text-color-secondary;
        transition: all 0.3s ease;

        &:hover {
          color: $primary-color;
          transform: rotate(180deg);
        }
      }
    }

    .ratings-list {
      background-color: $white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

      .rating-item {
        padding: 1.5rem;
        border-bottom: 1px solid $border-color;
        transition: all 0.3s ease;

        &:last-child {
          border-bottom: none;
        }

        &:hover {
          background-color: #fafafa;
        }

        /* 评价头部 */
        .rating-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;

          .customer-info {
            display: flex;
            align-items: center;
            gap: 1rem;

            .customer-avatar {
              border: 2px solid #f0f2f5;
            }

            .customer-details {
              display: flex;
              flex-direction: column;
              gap: 0.3rem;

              .customer-name {
                font-size: 1.4rem;
                font-weight: 500;
                color: $text-color;
              }

              .rating-time {
                font-size: 1.2rem;
                color: $text-color-secondary;
              }
            }
          }

          .rating-score {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 0.3rem;

            .score-text {
              font-size: 1.3rem;
              font-weight: 500;
              color: $warning-color;
            }
          }
        }

        /* 评价内容 */
        .rating-content {
          margin-bottom: 1rem;

          .rating-comment {
            font-size: 1.4rem;
            color: $text-color;
            line-height: 1.5;
            margin-bottom: 1rem;
          }

          /* 骑手回复 */
          .rider-reply {
            background-color: #fafafa;
            padding: 1rem;
            border-radius: 8px;
            border-left: 4px solid $primary-color;

            .reply-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 0.5rem;

              .reply-label {
                font-size: 1.3rem;
                font-weight: 500;
                color: $primary-color;
              }

              .reply-time {
                font-size: 1.2rem;
                color: $text-color-secondary;
              }
            }

            .reply-content {
              font-size: 1.3rem;
              color: #646566;
              line-height: 1.4;
            }
          }
        }

        /* 评价底部 */
        .rating-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .order-info {
            font-size: 1.2rem;
            color: $text-color-secondary;
          }

          .reply-btn {
            border-radius: 12px;
            font-size: 1.2rem;
            padding: 0.4rem 1rem;
          }

          .replied-tag {
            font-size: 1.2rem;
            color: $success-color;
            padding: 0.4rem 1rem;
            background-color: #f6ffed;
            border-radius: 12px;
          }
        }
      }
    }
  }

  /* 回复弹窗 */
  .reply-dialog {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: $white;

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid $border-color;

      .dialog-title {
        font-size: 1.6rem;
        font-weight: 600;
        color: $text-color;
        margin: 0;
      }

      .close-icon {
        cursor: pointer;
        color: $text-color-secondary;
        transition: all 0.3s ease;

        &:hover {
          color: $text-color;
          transform: rotate(90deg);
        }
      }
    }

    .dialog-content {
      flex: 1;
      padding: 1.5rem;
      overflow-y: auto;
    }

    .dialog-footer {
      padding: 1.5rem;
      border-top: 1px solid $border-color;
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .cancel-btn,
      .confirm-btn {
        border-radius: 25px;
        font-weight: 600;
        padding: 1rem 0;
        font-size: 1.5rem;
      }
    }
  }
}
</style>
