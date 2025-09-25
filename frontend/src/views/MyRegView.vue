<template>
  <div class="dialog">
    <h3 class="head">{{ Enter }}</h3>
    <form @submit.prevent="submitForm" class="dialog_input">
      <input type="text" class="input" placeholder="Логин" v-model="login" />
      <input
        type="password"
        class="input"
        placeholder="Пароль"
        v-model="password"
      />

      <div class="enterBtns">
        <my-button class="dialog_el" @click="enter">Ввод</my-button>
      </div>
      <button class="dbtn" @click="changeField">{{ nonEnter }}</button>

      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      <p v-if="notFoundMessage" class="notFound-message">
        {{ notFoundMessage }}
      </p>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import MyButton from "../components/UI/MyButton.vue";
export default {
  components: { MyButton },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      Enter: "Вход",
      nonEnter: "Создать пользователя",
      signIn: false,
      login: "",
      password: "",
      petname: "",
      successMessage: null,
      notFoundMessage: null,
    };
  },

  async mounted() {
    const markets = await axios.get("http://localhost:3000/users");
    console.log(markets.data);

    console.log(this.$store.state.count);
  },
  methods: {
    changeField() {
      this.signIn = !this.signIn;
      this.successMessage = null;
      this.notFoundMessage = null;
      if (this.signIn == true) {
        this.Enter = "Создать пользователя";
        this.nonEnter = "Вход";
      } else {
        this.Enter = "Вход";
        this.nonEnter = "Создать пользователя";
      }
    },
    async createUser() {
      try {
        const response = await axios.post(
          "http://localhost:3000/users/signup",
          {
            login: this.login,
            password: this.password,
          }
        );
        this.notFoundMessage = null;
        this.successMessage = "Регистрация прошла успешно!";
        console.log(response.data);
      } catch (e) {
        if ((e = 404)) {
          this.successMessage = "Другой логин нада";
        }
        console.log(e);
      }
    },
    async checkUser() {
  try {
    const response = await axios.post(
      "http://localhost:3000/users/signin",
      {
        login: this.login,
        password: this.password,
      }
    );

    console.log(response.data);
    sessionStorage.setItem("token", response.data);
    this.successMessage = "вы вошли в систему";
    this.notFoundMessage = null;
    sessionStorage.setItem("id", response.data.id);
    sessionStorage.setItem("login", response.data.login);
    
    // Добавляем эмит события
    this.$emit('authenticated');
    
    console.log(sessionStorage.getItem("id"));
  } catch (e) {
    this.successMessage = null;
    this.notFoundMessage = "Пользователь не найден";
    console.log(e);
  }
},

    enter() {
      if (this.signIn) {
        if (this.login == "") {
          this.notFoundMessage = "Придумайте другой логин";
        } else {
          this.createUser();
          this.checkUser();
        }
      } else {
        this.checkUser();
      }
      this.login = "";
      this.password = "";
      this.petname = "";
    },
  },
};
</script>

<style scoped>

.head {
  display: flex;
  justify-content: center;
}
.dialog {
  padding: 20px;
  display: flex;
  width: 50%;
  margin-left: 25%;
  flex-direction: column;
  align-items: center;
  align-content: center;
  background-color: white;
  color: #1f2c3c;
  box-sizing: border-box;
}
.dialog_input {
  display: flex;
  flex-direction: column;
}
.dialog_el {
  margin-top: 10px;
  color: #1f2c3c;
}
.input {
  border-radius: 20px;
  margin-top: 10px;
  padding: 10px;
  border: none;
  color: white;
  background-color: #1f2c3c;
}
.enterBtns {
  display: flex;
  justify-content: center;
}
.dbtn {
  background-color: transparent;
  border: none;
  color: white;
  padding: 15px;
  background-color: #1f2c3c;
  border-radius: 25px;
}
::placeholder {
  color: white;
}
.p {
  color: #1f2c3c;
}
.success-message {
  color: #1f2c3c;
}
.notFound-message {
  color: #1f2c3c;
}
</style>
