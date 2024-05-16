<template>
  <NuxtPwaManifest />
  <div class="workshop">
    <!-- <NuxtWelcome /> -->
    <div class="enable-notifications-container">
      <button @click="enableNotifications" :disabled="!disabledNotifications">Click to enable notifications</button>
    </div>
    <div class="message-form">
      <div class="field border">
        <input type="text" v-model="message" :disabled="disabledNotifications"/>
      </div>
      <button @click="sendNotification" :disabled="message === ''">Send notification</button>
    </div>
  </div>
</template>

<script lang="ts">
import "beercss";
import { getPushSubscription, subscribe } from "./helpers";
export default defineComponent({
  data() {
    return {
      message: "",
      disabledNotifications: true
    }
  },
  methods: {
    async sendNotification() {
      try {
        await fetch("/api/send-notification", {
          method: "POST",
          headers: {
            "Content-Type": "application/text"
          },
          body: this.message
        });
      } catch (e) {
        console.error(e)
      } finally {
        this.message = "";
      }
    },
    enableNotifications() {
      if (!("Notification" in window)) {
        console.log("This browser does not support notifications.");
      } else if (Notification.permission === "granted" || Notification.permission === "denied") {
        this.disabledNotifications = false;
        return;
      } else {
        Notification.requestPermission().then(async () => {
          navigator.serviceWorker.ready
            .then(getPushSubscription).then(async ({ registration }) => {
              try {
                const publicKeyRes = await fetch("/api/retrieve-public-key");
                const pk = await publicKeyRes.text();
                const subscription = await subscribe(registration, pk);
                await fetch("/api/save-subscription", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(subscription)
                });
                this.disabledNotifications = false;
              } catch (e) {
                console.log(e)
              }
            })
            .catch(e => {
              console.log("not ready", e)
            });
        });
      }
    }
  },
  mounted () {
    navigator.serviceWorker.ready
        .then(getPushSubscription)
        .then(async ({ subscription }) => {
          if (subscription) {
            this.disabledNotifications = false;
          }
        })
        .catch(e => {
          console.log("not ready", e)
        });
  }
})
</script>

<style>
body {
  margin: 0;
}

.workshop {
  position: relative;
  max-width: 640px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-content: center;
  margin: auto;
}

.workshop .enable-notifications-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 128px;
}

.workshop .message-form {
  display: flex;
  flex-direction: column;
}
</style>
