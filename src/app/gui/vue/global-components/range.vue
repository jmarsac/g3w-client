<template>
  <div style="display: flex; flex-direction: column">
    <label :for="id" style="display: block" v-t="label"></label>
    <input :id="id" ref="range-input" @change="change" v-model="value" type="range" :min="min" :max="max" :step="step">
  </div>
</template>

<script>
  const {debounce} = require('core/utils/utils');
  export default {
    name: "range",
    props:{
      id: {
        required: true,
      },
      label: {
        type:"String",
        default: ''
      },
      min: {
        type: Number,
        default: 0
      },
      max:{
        type: Number,
        default: 10
      },
      step:{
        type: Number,
        default: 1
      },
      labelValue: {},
      value: {
        default: 0
      },
      sync:{
        type: Boolean,
        default: false
      }
    },
    data(){
      return {}
    },
    methods:{
      changeBackGround(value){
        this.$refs['range-input'].style.backgroundSize = `${value ? (value - this.min) * 100 / (this.max - this.min): 0}% 100%`;
      },
      setValue(value){
        this.changedValue(value);
      },
      change(evt){
        const value = 1*evt.target.value;
        this.changedValue(value);
      },
      emitChangeValue(value){
        this.value = value;
        this.$emit('change-range', {
          id: this.id,
          value
        });
      }
    },
    watch:{
      value(value){
        this.changeBackGround(value);
        this.sync && this.emitChangeValue(value);
      }
    },
    created(){
      this.changedValue =  this.sync ? ()=> this.$emit('changed') : debounce(value => {
        this.emitChangeValue(value)
      })
    },
    async mounted(){
      await this.$nextTick();
      this.changeBackGround(this.value);
    },
    beforeDestroy() {}
  }
</script>

<style scoped>

</style>