<template>
  <NuxtPwaManifest />
  <div class="workshop">
    <!-- <NuxtWelcome /> -->
    <div>
      <input v-model="message" />
      <button @click="sendNotification" :disabled="message === ''">Send notification</button>
    </div>
    <div class="modal" v-show="showModal">
      <div class="inner">
        <button @click="enableNotifications">Click to enable notifications</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getPushSubscription, subscribe } from "./helpers";
export default defineComponent({
  data() {
    return {
      message: "",
      showModal: true
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
        this.showModal = false;
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
                this.showModal = false;
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
  }
})
</script>

<style>
body {
  margin: 0;
}

.workshop {
  position: relative;
  min-height: 100vh;
}

.workshop .modal {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: lightgray;
  opacity: 0.5;
  display: flex;
  justify-items: center;
}

.workshop .modal .inner {
  display: flex;
  justify-items: center;
  width: 640px;
  height: 480px;
  background-color: grey;
  margin: auto;
}

.workshop .modal .inner button {
  margin: auto;
}

::backdrop {
  background-image: linear-gradient(
    45deg,
    magenta,
    rebeccapurple,
    dodgerblue,
    green
  );
  opacity: 0.75;
}
</style>
