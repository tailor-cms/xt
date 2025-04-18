<template>
  <transition name="fade">
    <div v-show="isVisible" :style="{ backgroundColor }" class="splash-loader">
      <div>
        <div class="splash-loader__anim">
          <img :src="logo" alt="Logo" width="88" />
        </div>
        <div class="splash-loader__text text-body-1">
          <div>Booting Content Element Kit....</div>
          <div class="font-weight-bold">Beta preview v{{ version }}</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';

import logoUrl from '../assets/logo-new.svg';
import { version } from './../../package.json';

interface Props {
  isVisible: boolean;
  logo?: string;
  color?: string;
  backgroundColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  isVisible: true,
  logo: logoUrl,
  color: '#00bfa5',
  backgroundColor: '#fff',
});

onMounted(() => {
  const color = props.color || '#00bfa5';
  document.documentElement.style.setProperty('--splash-color', color);
});
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
