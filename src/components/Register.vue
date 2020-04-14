<template>
  <div class="Register">
    <b-container fluid class="pt-4 px-4 overlap">
      <b-row cols-xl="2">
        <b-col>
        </b-col>
        <b-col>
        </b-col>
    </b-row>
  </b-container>
</div>
</template>

<script>
import LayoutDefault from './layouts/LayoutDefault';

export default {
  name: 'Register',
  created() {
    this.$emit('update:layout', LayoutDefault);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
