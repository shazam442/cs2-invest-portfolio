import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { useAuth } from "../lib/authentication";

const app = createApp(App);

// Initialize authentication before mounting
const { initAuth } = useAuth();
initAuth().then(() => {
  app.mount("#app");
});
