<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCommunityStore } from '../stores/community'
import CustomNavBar from '../components/CustomNavBar.vue'
import { toast } from '../utils/toast'

const router = useRouter()
const communityStore = useCommunityStore()

// 表单数据
const formData = ref({
  title: '',
  content: '',
  tags: [] as string[],
  images: [] as string[]
})

// 标签输入
const tagInput = ref('')
const maxTags = 5

// 图片预览
const imagePreviewUrls = ref<string[]>([])

// 添加标签
const addTag = () => {
  const tag = tagInput.value.trim()
  if (tag && !formData.value.tags.includes(tag) && formData.value.tags.length < maxTags) {
    formData.value.tags.push(tag)
    tagInput.value = ''
  }
}

// 删除标签
const removeTag = (index: number) => {
  formData.value.tags.splice(index, 1)
}

// 处理图片选择
const handleImageChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    const file = input.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        imagePreviewUrls.value.push(result)
        formData.value.images.push(result)
      }
      reader.readAsDataURL(file)
    }
  }
}

// 删除图片
const removeImage = (index: number) => {
  imagePreviewUrls.value.splice(index, 1)
  formData.value.images.splice(index, 1)
}

// 提交表单
const submitForm = async () => {
  // 表单验证
  if (!formData.value.title.trim()) {
    toast.error('请输入帖子标题')
    return
  }
  
  if (!formData.value.content.trim()) {
    toast.error('请输入帖子内容')
    return
  }
  
  try {
    const success = await communityStore.createPost({
      title: formData.value.title.trim(),
      content: formData.value.content.trim(),
      tags: formData.value.tags,
      images: formData.value.images
    })
    
    if (success) {
      toast.success('帖子发布成功')
      router.push('/community')
    } else {
      toast.error('帖子发布失败')
    }
  } catch (error) {
    toast.error('帖子发布失败，请重试')
  }
}

// 返回功能已由CustomNavBar组件处理
</script>

<template>
  <div class="create-post-container">
    <!-- 顶部导航栏-->
    <CustomNavBar title="发布帖子" />
    
    <!-- 表单内容 -->
    <div class="form-container">
      <!-- 标题输入 -->
      <div class="form-item">
        <input
          v-model="formData.title"
          type="text"
          placeholder="请输入帖子标题"
          class="title-input"
          maxlength="50"
        />
        <div class="input-counter">{{ formData.title.length }}/50</div>
      </div>
      
      <!-- 内容输入 -->
      <div class="form-item">
        <textarea
          v-model="formData.content"
          placeholder="分享你的故事、经验或感悟..."
          class="content-textarea"
          rows="8"
          maxlength="1000"
        ></textarea>
        <div class="input-counter">{{ formData.content.length }}/1000</div>
      </div>
      
      <!-- 图片上传 -->
      <div class="form-item">
        <div class="section-title">添加图片</div>
        <div class="image-upload-section">
          <!-- 图片预览 -->
          <div class="image-preview-list">
            <div
              v-for="(url, index) in imagePreviewUrls"
              :key="index"
              class="image-preview-item"
            >
              <img :src="url" alt="预览" class="preview-image" />
              <div class="remove-image-btn" @click="removeImage(index)">
                <van-icon name="cross" size="16" color="#fff" />
              </div>
            </div>
            
            <!-- 上传按钮 -->
            <div class="upload-btn" v-if="imagePreviewUrls.length < 9">
              <input
                type="file"
                accept="image/*"
                class="file-input"
                @change="handleImageChange"
              />
              <van-icon name="plus" size="32" color="#969799" />
              <div class="upload-text">添加图片</div>
            </div>
          </div>
          <div class="upload-hint">最多可上传9张图片</div>
        </div>
      </div>
      
      <!-- 标签输入 -->
      <div class="form-item">
        <div class="section-title">添加标签</div>
        <div class="tag-section">
          <!-- 已添加的标签 -->
          <div class="tag-list">
            <van-tag
              v-for="(tag, index) in formData.tags"
              :key="index"
              closable
              @close="removeTag(index)"
              class="tag-item"
            >
              {{ tag }}
            </van-tag>
          </div>
          
          <!-- 标签输入框-->
          <div class="tag-input-container" v-if="formData.tags.length < maxTags">
            <input
              v-model="tagInput"
              type="text"
              placeholder="输入标签，按回车添加"
              class="tag-input"
              @keyup.enter="addTag"
            />
            <van-button type="primary" size="small" @click="addTag">
              添加
            </van-button>
          </div>
          <div class="tag-hint" v-if="formData.tags.length >= maxTags">
            最多可添加{{ maxTags }}个标签
          </div>
        </div>
      </div>
      
      <!-- 提交按钮 -->
      <div class="submit-section">
        <van-button
          type="primary"
          size="large"
          block
          @click="submitForm"
          :loading="communityStore.loading"
          class="submit-btn"
        >
          发布帖子
        </van-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.create-post-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* 顶部导航�?*/
.custom-nav-bar {
  background: linear-gradient(135deg, #1989fa 0%, #36cfc9 100%);
  color: #fff;
}

.custom-nav-bar :deep(.van-nav-bar__title) {
  color: #fff;
  font-weight: 600;
}

.back-btn {
  padding: 0 1rem;
  cursor: pointer;
}

/* 表单容器 */
.form-container {
  padding: 1.5rem;
  background-color: #fff;
}

.form-item {
  margin-bottom: 2rem;
}

/* 标题输入 */
.title-input {
  width: 100%;
  font-size: 1.6rem;
  font-weight: 500;
  padding: 1rem 0;
  border: none;
  border-bottom: 1px solid #ebedf0;
  outline: none;
  resize: none;
}

.title-input::placeholder {
  color: #c8c9cc;
}

/* 内容输入 */
.content-textarea {
  width: 100%;
  font-size: 1.4rem;
  line-height: 1.6;
  padding: 1rem;
  border: 1px solid #ebedf0;
  border-radius: 8px;
  outline: none;
  resize: vertical;
  background-color: #fafafa;
}

.content-textarea::placeholder {
  color: #c8c9cc;
}

/* 输入计数�?*/
.input-counter {
  font-size: 1.2rem;
  color: #969799;
  text-align: right;
  margin-top: 0.5rem;
}

/* 图片上传 */
.section-title {
  font-size: 1.4rem;
  font-weight: 500;
  color: #323233;
  margin-bottom: 1rem;
}

.image-upload-section {
  margin-top: 1rem;
}

.image-preview-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.image-preview-item {
  position: relative;
  width: calc(33.333% - 0.667rem);
  aspect-ratio: 1 / 1;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 24px;
  height: 24px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.upload-btn {
  width: calc(33.333% - 0.667rem);
  aspect-ratio: 1 / 1;
  border: 2px dashed #ebedf0;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #fafafa;
}

.upload-btn:hover {
  border-color: #1989fa;
  background-color: #e6f7ff;
}

.file-input {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.upload-text {
  font-size: 1.2rem;
  color: #969799;
  margin-top: 0.5rem;
}

.upload-hint {
  font-size: 1.2rem;
  color: #969799;
}

/* 标签 */
.tag-section {
  margin-top: 1rem;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.tag-item {
  font-size: 1.2rem;
}

.tag-input-container {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.tag-input {
  flex: 1;
  font-size: 1.4rem;
  padding: 0.8rem 1rem;
  border: 1px solid #ebedf0;
  border-radius: 20px;
  outline: none;
}

.tag-input::placeholder {
  color: #c8c9cc;
}

.tag-hint {
  font-size: 1.2rem;
  color: #969799;
}

/* 提交按钮 */
.submit-section {
  margin-top: 3rem;
}

.submit-btn {
  font-size: 1.6rem;
  font-weight: 600;
  padding: 1.2rem;
  border-radius: 28px;
  background: linear-gradient(135deg, #1989fa 0%, #36cfc9 100%);
  border: none;
}
</style>
