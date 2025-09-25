<template>
  <MyRegView v-if="!isAuthenticated" @authenticated="handleAuth"></MyRegView>
  <ChatView v-else></ChatView>
</template>

<script>
import MyRegView from './views/MyRegView.vue';
import ChatView from './views/ChatView.vue';

export default {
  components: { MyRegView, ChatView },
  data() {
    return {
      isAuthenticated: false,
      name: ''
    };
  },
  created() {
    this.checkAuth();
  },
  methods: {
    checkAuth() {
      const token = sessionStorage.getItem('token');
      this.isAuthenticated = !!token;
    },
    handleAuth() {
      this.isAuthenticated = true;
    }
  }
};
</script>
<style>

</style>