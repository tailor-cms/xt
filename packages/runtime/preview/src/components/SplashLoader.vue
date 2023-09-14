<template>
  <transition name="fade">
    <div :style="{ backgroundColor }" class="splash-loader">
      <div>
        <div class="splash-loader__anim">
          <img :src="logo" alt="Logo" width="88" />
        </div>
        <div class="splash-loader__text text-body-1">
          <div>Booting Teaching Element Kit....</div>
          <div class="font-weight-bold">Alpha preview v0.0.1</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import logoUrl from '../assets/logo.png';

export default {
  props: {
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
  created() {
    this.setColor();
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
