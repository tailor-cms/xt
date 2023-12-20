<template>
  <transition name="fade">
    <div v-show="isVisible" :style="{ backgroundColor }" class="splash-loader">
      <div>
        <div class="splash-loader__anim">
          <img :src="logo" alt="Logo" width="88" />
        </div>
        <div class="splash-loader__text text-body-1">
          <div>Booting Teaching Element Kit....</div>
          <v-progress-linear
            v-if="isFirstBoot"
            :model-value="progress"
            class="my-3"
          />
          <div class="font-weight-bold">Beta preview v0.3.0</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import logoUrl from '../assets/logo.png';

export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    isFirstBoot: {
      type: Boolean,
      required: true,
    },
    logo: {
      type: String,
      default: logoUrl,
    },
    color: {
      type: String,
      default: '#00bfa5',
    },
    backgroundColor: {
      type: String,
      default: '#fff',
    },
  },
  data: () => ({
    interval: 0,
    progress: 0,
  }),
  mounted() {
    this.setColor();
    if (!this.isFirstBoot) return;
    this.interval = setInterval(() => {
      this.progress += 1;
      if (this.progress === 100) clearInterval(this.interval);
    }, 200);
  },
  beforeUnmount() {
    clearInterval(this.interval);
  },
  methods: {
    setColor() {
      document.documentElement.style.setProperty('--splash-color', this.color);
    },
  },
};
</script>

<style lang="scss" scoped>
$splash-color: var(--splash-color);

.splash-loader {
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.splash-loader__anim {
  text-align: center;
  animation: splashAnimation 1.3s infinite;

  img {
    margin: auto;
  }
}

.splash-loader__text {
  margin-top: 50px;
  font-size: 1rem;
  text-align: center;
}

@keyframes splashAnimation {
  0% {
    filter: drop-shadow(0px 0px 0px $splash-color);
  }
  100% {
    filter: drop-shadow(0px 0px 200px $splash-color);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
