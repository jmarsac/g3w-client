<template>
  <div class="g3w-layer-positions" :id="ids.layerpositions">
    <div class="g3w-layer-positions-info-message">
      <helpdiv :message="`layer_position.message`"></helpdiv>
    </div>
    <div class="g3w-layer-positions-checkboxes">
      <div v-for="layerposition in layerpositions" :key="layerposition">
        <input @change="change" class="form-control magic-radio" type="radio" :id="ids[layerposition]" v-model="position" :value="layerposition" :checked="position === layerposition">
        <label :for="ids[layerposition]" v-t="`layer_position.${layerposition}`"></label>
      </div>
    </div>
  </div>
</template>

<script>
  import {MAP_SETTINGS} from "../../../constant";
  const {getUniqueDomId} = require('core/utils/utils');
  export default {
    name: "layerspositions",
    props:{
      position:{
        type: String,
        default: MAP_SETTINGS.LAYER_POSITIONS.default
      }
    },
    data(){
      return {
        layerpositions: MAP_SETTINGS.LAYER_POSITIONS.getPositions()
      }
    },
    methods: {
      change(){
        this.$emit('layer-position-change', this.position)
      }
    },
    created(){
      this.ids = {
        layerpositions: getUniqueDomId(),
      };
      this.layerpositions.forEach(layerposition => this.ids[layerposition] = getUniqueDomId());
      this.change();
    }
  }
</script>

<style scoped>
  .g3w-layer-positions {
    display: flex;
    flex-direction: column;
    margin: 5px 0 5px 0;
  }
  .g3w-layer-positions-info-message{
    margin-bottom: 3px;
  }

  .g3w-layer-positions-checkboxes {
    display: flex;
    justify-content: space-between;
  }
</style>