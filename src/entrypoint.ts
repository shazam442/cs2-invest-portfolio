import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { useAuth } from "../lib/authentication";
import { createPinia } from "pinia";

const app = createApp(App);
const pinia = createPinia();

// Initialize authentication before mounting
const { initAuth } = useAuth();
initAuth().then(() => {
  app.use(pinia).mount("#app");
});
