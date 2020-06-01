<template>
  <div class="mini-View">
    <div class="window-view"></div>
  </div>
</template>
<script>
export default {

}
</script>
<style lang="scss" scoped>
.mini-View {
  width: 192px;
  height: 108px;
  position: fixed;
  bottom: 48px;
  left: 310px;
  border-radius: 4px;
  background-color: rgba(66, 91, 109, 0.2);
  z-index: 4;
  .window-view {
    width: 38.4px;
    height: 20px;
    left: 0px;
    top: 0px;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 4px;
    background: #b3bdc5;
    cursor: pointer;
  }
}
</style>
