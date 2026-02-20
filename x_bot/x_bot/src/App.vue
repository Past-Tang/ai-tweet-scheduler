<template>
  <el-container>
    <!-- 头部导航栏 -->
    <el-header>
      <div class="header-title">XBOT控制面板 - 测试DEMO版本</div>
    </el-header>

    <el-main>
      <el-row :gutter="20">
        <!-- 第一个卡片：通过AI生成学术性材料 -->
        <el-col :span="8">
          <el-card style="height: 100%;">
            <template #header>
              <div class="card-header">
                <span>通过AI生成学术性材料</span>
              </div>
            </template>
            <el-input v-model="textarea2" type="textarea" :rows="6" placeholder="按下生成" style="width: 100%; margin-bottom: 10px;" />
            <el-row :gutter="5">
              <el-col :span="8">
                <el-button type="primary" plain @click="getCode" style="width: 100%;" :loading="loadingshow">生成</el-button>
              </el-col>
              <el-col :span="8">
                <el-button type="primary" plain @click="move" style="width: 100%;" :loading="loadingshow">选定</el-button>
              </el-col>
              <el-col :span="8">
                <el-button plain @click="clearText" style="width: 100%;">清空</el-button>
              </el-col>
            </el-row>
          </el-card>
        </el-col>

        <!-- 第二个卡片：Agent智能生成推文 -->
        <el-col :span="8">
          <el-card style="height: 100%;">
            <template #header>
              <div class="card-header">
                <span>Agent智能生成推文</span>
              </div>
            </template>
            <el-scrollbar style="height: 300px; margin-top: 10px;">
              <div v-for="(msg, index) in chatHistory" :key="index" class="chat-message">
                <strong>{{ msg.role }}:</strong> {{ msg.content }}
              </div>
            </el-scrollbar>
            <el-input type="textarea" :rows="4" placeholder="等待左侧选定" v-model="userInput" style="margin-top: 10px;" />
            <el-row :gutter="5">
              <el-col :span="8">
                <el-button type="primary" style="width: 100%; margin-top: 10px;" @click="sendToAI" :loading="loadingAI">生成</el-button>
              </el-col>
              <el-col :span="8">
                <el-button type="primary" style="width: 100%; margin-top: 10px;" @click="sendToX" :loading="loadingAI">选定</el-button>
              </el-col>
              <el-col :span="8">
                <el-button @click="clearHistory" style="width: 100%; margin-top: 10px;">清空历史记录</el-button>
              </el-col>
            </el-row>
          </el-card>
        </el-col>

        <!-- 第三个卡片：自动化定时推文发送 -->
        <el-col :span="8">
          <el-card style="height: 100%;">
            <template #header>
              <div class="card-header">
                <span>XBOT定时推文发送</span>
              </div>
            </template>
            <!-- 任务提交表单 -->
            <el-form :model="scheduleForm" label-width="100px" style="margin-bottom: 20px;">
              <el-form-item label="推文内容">
                <el-input type="textarea" v-model="scheduleForm.content" :rows="4" placeholder="请输入推文内容"></el-input>
              </el-form-item>
              <el-form-item label="发送时间">
                <el-date-picker
                  v-model="scheduleForm.time"
                  type="datetime"
                  placeholder="选择发送时间"
                  style="width: 100%;"
                ></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitSchedule">提交任务</el-button>
              </el-form-item>
            </el-form>
            <el-row style="margin-bottom: 20px;">
              <el-col :span="24">
                <el-button type="primary" @click="getTaskList" :loading="loading">刷新任务列表</el-button>
              </el-col>
            </el-row>
            <!-- 任务列表 -->
            <el-table :data="taskList" style="width: 100%;" :loading="loading">
              <el-table-column prop="sendTime" label="发送时间" width="180" :formatter="formatDate"></el-table-column>
              <el-table-column prop="content" label="推文预览" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column label="操作" width="100">
                <template #default="scope">
                  <el-button type="danger" size="small" @click="cancelTask(scope.row.jobId)">取消</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import moment from 'moment';
import { ElMessage } from 'element-plus';

// 响应式数据
const textarea2 = ref('');
const loadingshow = ref(false);
const userInput = ref('');
const chatHistory = ref([]);
const loadingAI = ref(false);
const scheduleForm = ref({
  content: '',
  time: null,
});
const taskList = ref([]);
const loading = ref(false);

// 方法
const getCode = async () => {
  loadingshow.value = true;
  try {
    const response = await axios.get('/dev-api/random_text');
    textarea2.value = response.data.text;
    ElMessage.success('生成成功');
  } catch (error) {
    console.error('文本生成失败:', error);
    ElMessage.error('生成失败');
  } finally {
    loadingshow.value = false;
  }
};

const move = () => {
  if (!textarea2.value) {
    ElMessage.warning('请先生成文本');
    return;
  }
  userInput.value = textarea2.value;
  ElMessage.success('文本已移动到输入框');
};

const clearText = () => {
  textarea2.value = '';
  ElMessage.success('文本框已清空');
};

const clearHistory = () => {
  chatHistory.value = [];
  ElMessage.success('历史记录已清空');
};

const sendToAI = async () => {
  if (!userInput.value) {
    ElMessage.warning('请输入内容');
    return;
  }
  loadingAI.value = true;
  const text = userInput.value;
  const payload = {
    model: 'Qwen/Qwen2.5-7B-Instruct',
    messages: [
      {
        role: 'assistant',
        content: 'You are a social media manager.',
      },
      {
        role: 'user',
        content: `Please play the role of an expert in social media copywriting, with a professional and creative writing style.
Task:
Write an English Twitter post based on the provided text:
The content should be smooth and natural, without any AI sense, and able to attract users to click and forward.
The writing style should conform to the social media style and ensure professionalism, with sharing and interactivity.
Tweets need to be attractive, able to spark user interest and engagement.
Please maintain creativity when generating tweets while ensuring strong relevance to the given text content.
{Must output in pure English,Can only generate a maximum of 150 words}
Original text: ${text}  Your output:`,
      },
    ],
  };
  const headers = {
    Authorization: 'Bearer sk-vgmfuoznkztusscvdkhffpophaahgrpjselkalfnfrvvmrkp',
    'Content-Type': 'application/json',
  };
  try {
    const response = await axios.post('https://api.siliconflow.cn/v1/chat/completions', payload, { headers });
    chatHistory.value.push({
      role: 'assistant',
      content: response.data.choices[0].message.content,
    });
    userInput.value = '';
    ElMessage.success('推文生成成功');
  } catch (error) {
    console.error('API请求失败:', error);
    ElMessage.error('推文生成失败');
  } finally {
    loadingAI.value = false;
  }
};

const sendToX = () => {
  if (chatHistory.value.length === 0) {
    ElMessage.warning('没有可用的 AI 生成推文');
    return;
  }
  const latestMessage = chatHistory.value[chatHistory.value.length - 1].content;
  scheduleForm.value.content = latestMessage;
  ElMessage.success('AI 生成推文已发送到定时推文发送卡片');
};

const submitSchedule = async () => {
  if (!scheduleForm.value.content || !scheduleForm.value.time) {
    ElMessage.warning('内容和时间不能为空');
    return;
  }
  const scheduleData = {
    content: scheduleForm.value.content,
    schedule_type: 'time',
    time: scheduleForm.value.time.toISOString(),
  };
  try {
    await axios.post('/dev-api/start', scheduleData);
    ElMessage.success('任务提交成功');
    getTaskList();
    scheduleForm.value.content = '';
    scheduleForm.value.time = null;
  } catch (error) {
    console.error('提交任务失败:', error);
    ElMessage.error('提交任务失败');
  }
};

const getTaskList = async () => {
  loading.value = true;
  try {
    const response = await axios.get('/dev-api/tasks');
    taskList.value = response.data.tasks.map((task) => ({
      jobId: task.job_id,
      sendTime: task.next_run_time,
      content: task.content,
    }));
    ElMessage.success('任务列表刷新成功');
  } catch (error) {
    console.error('获取任务列表失败:', error);
    ElMessage.error('获取任务列表失败');
  } finally {
    loading.value = false;
  }
};

const cancelTask = async (jobId) => {
  try {
    await axios.post('/dev-api/stop', { job_id: jobId });
    ElMessage.success('任务取消成功');
    getTaskList();
  } catch (error) {
    console.error('取消任务失败:', error);
    ElMessage.error('取消任务失败');
  }
};

const formatDate = (row) => {
  if (!row.sendTime) return '立即发送';
  return moment(row.sendTime).format('YYYY-MM-DD HH:mm:ss');
};

// 生命周期钩子
onMounted(() => {
  getTaskList();
});
</script>

<style scoped>
/* 头部导航栏样式 */
.el-header {
  background-color: #409eff;
  color: #fff;
  text-align: center;
  line-height: 60px;
}

.header-title {
  font-size: 24px;
  font-weight: bold;
}

/* 主要内容区域 */
.el-main {
  background-color: #e9eef3;
  padding: 45px;
}

/* 卡片样式调整 */
.el-card {
  margin-bottom: 20px;
}

.card-header {
  text-align: center;
}

/* 文本区域和按钮样式 */
.el-input--textarea {
  margin-bottom: 10px;
}

.el-button {
  width: 100%;
}

/* 对话消息样式 */
.chat-message {
  margin-bottom: 10px;
}

.chat-message strong {
  font-size: 14px;
  margin-right: 5px;
}
</style>