<template>
  <div class="tab-node group">
    <h5 class="title group-title" :class="{'mobile': isMobile()}" :style="{fontSize: isMobile() ? '1em' : '1.1em'}" v-if="showGroupTile">{{ node.name }}</h5>
    <div v-for="row in rows" class="node-row" :class="{'mobile': isMobile()}">
      <template v-for="column in columnNumber" style="padding:2px">
        <template v-if="getNode(row, column)">
          <component v-if="getNodeType(getNode(row, column)) === 'field'" style="padding: 5px"
            :state="getField(getNode(row, column))"
            @changeinput="changeInput"
            @addinput="addToValidate"
            @removeinput="removeToValidate"
            :changeInput="changeInput"
            :addToValidate="addToValidate"
            :removeToValidate="removeToValidate"
            :feature="feature"
            :is="getComponent(getField(getNode(row, column)))">
          </component>
          <template v-else>
            <tabs v-if="getNodeType(getNode(row, column)) === 'group'" class="sub-group" style="width: 100% !important" :group="true" :tabs="[getNode(row, column)]" v-bind="$props"></tabs>
            <template v-else>
              <div v-if="showRelationByField" v-disabled="isRelationDisabled(getNode(row, column)) || loadingRelation(getNode(row, column)).loading" @click="handleRelation({relation: getNode(row, column), feature:feature, layerId: layerid})" :style="{cursor: showRelationByField && 'pointer'}">
                 <bar-loader :loading="loadingRelation(getNode(row, column)).loading"></bar-loader>
                  <div  class="query_relation_field">
                    <i :class="g3wtemplate.font[`${context === 'query' ? 'relation' : 'pencil'}`]"></i>
                  </div>
                  <span>
                    <span class="query_relation_field_message">
                      <span></span>
                      <span style="text-transform: uppercase"> {{ getRelationName(getNode(row, column).name)}}</span>
                    </span>
                  </span>
              </div>
            </template>
          </template>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
  import G3wInput from 'gui/inputs/g3w-input.vue';
  const Fields = require('gui/fields/fields');
  const ProjectRegistry = require('core/project/projectsregistry');
  const GUI = require('gui/gui');
  export default {
    name: "node",
    props: ['contenttype', 'node', 'fields', 'showTitle', 'addToValidate', 'removeToValidate', 'changeInput', 'layerid', 'feature', 'showRelationByField',  'handleRelation'],
    components: {
      G3wInput,
      ...Fields
    },
    data() {
      return {
        context: this.contenttype,
        editing_required: false
      }
    },
    computed: {
      filterNodes() {
        const filterNodes = this.node.nodes && this.node.nodes.filter(node => {
          if (this.getNodeType(node) === 'group') {
            return true
          } else if (!node.nodes && node.name && this.getNodeType(node) != 'group') {
            node.relation = true;
            return true
          } else {
            return !!this.fields.find(field => {
              const field_name = node.field_name ? node.field_name.replace(/ /g,"_") :  node.field_name;
              return field.name === field_name || node.relation;
            })
          }
        });
        return filterNodes || [];
      },
      nodesLength() {
        return this.filterNodes.length;
      },
      rows() {
        let rowCount = 1;
        if (this.nodesLength === 0) rowCount = 0;
        else if (this.columnNumber  <= this.nodesLength) {
          const rest = this.nodesLength  % this.columnNumber;
          rowCount = Math.floor(this.nodesLength / this.columnNumber) + rest;
        }
        return rowCount;
      },
      columnNumber() {
        const columnCount = parseInt(this.node.columncount) ? parseInt(this.node.columncount): 1;
        return columnCount > this.nodesLength ? this.nodesLength:  columnCount;
      },
      showGroupTile() {
        return this.showTitle && this.node.showlabel && this.node.groupbox
      }
    },
    methods: {
      loadingRelation(relation){
        const layer = ProjectRegistry.getCurrentProject().getLayerById(this.layerid);
        const relation_project = layer.getRelationById(relation.name);
        return relation_project.state;
      },
      isRelationDisabled(relation){
        return this.getRelationName(relation.name) === undefined || (this.contenttype === 'editing' && this.isRelationChildLayerNotEditable(relation));
        //return this.getRelationName(relation.name) === undefined || (this.contenttype === 'editing' && (relation.nmRelationId || this.isRelationChildLayerNotEditable(relation.name)));
      },
      getRelationName(relationId) {
        const relation = ProjectRegistry.getCurrentProject().getRelationById(relationId);
        return relation && relation.name;
      },
      isRelationChildLayerNotEditable(relation){
        const {nmRelationId, name} = relation;
        ///TEMPORARY HANDLE N:M RELATION AS 1:N RELATION
        const currentProject = ProjectRegistry.getCurrentProject();
        const projectRelation = currentProject.getRelationById(name);
        const relationLayerId = projectRelation.referencingLayer;
        const relationLayer = currentProject.getLayerById(relationLayerId);
        // check if is editable. In case of nmRelation layer need to be table to be editable
        return !relationLayer.isEditable();
        // if (nmRelationId) return true;
        // else {
        //   const currentProject = ProjectRegistry.getCurrentProject();
        //   const projectRelation = currentProject.getRelationById(name);
        //   const relationLayerId = projectRelation.referencingLayer;
        //   const relationLayer = currentProject.getLayerById(relationLayerId);
        //   // check if is editable. In case of nmRelation layer need to be table to be editable
        //   return !relationLayer.isEditable();
        // }
        // const relationId = nmRelationId || name;
        // const currentProject = ProjectRegistry.getCurrentProject();
        // const projectRelation = currentProject.getRelationById(relationId);
        // const relationLayerId = nmRelationId ? projectRelation.referencedLayer : projectRelation.referencingLayer;
        // const relationLayer = currentProject.getLayerById(relationLayerId);
        // // check if is editable. In case of nmRelation layer need to be table to be editable
        // return !relationLayer.isEditable() || (nmRelationId ? relationLayer.isVector() : false);
      },
      getNodes(row) {
        const startIndex = (row - 1) * this.columnNumber;
        return this.filterNodes.slice(startIndex, this.columnNumber + startIndex);
      },
      getNode(row, column) {
        return this.getNodes(row)[column - 1];
      },
      getField(node) {
        if (node.relation) return node;
        const field = this.fields.find((field) => {
          const field_name = node.field_name ? node.field_name.replace(/ /g,"_") : node.field_name;
          return field.name === field_name;
        });
        return field;
      },
      getNodeType(node) {
        const type = node.groupbox || node.nodes ? 'group' : node.relation ? 'relation': 'field';
        if (type === 'field' && (node.alias === undefined || node.alias === '')) {
          node.alias = node.field_name;
        }
        return type;
      },
      getComponent(field) {
        if (field.relation) return;
        else if (field.query) return field.input.type;
        else return 'g3w-input';
      }
    }
  }
</script>

<style scoped>
  .tab-node{
    min-width: 0;
    overflow: hidden;
  }
  .title {
    font-weight: bold;
    width: 100%;
    color: #ffffff;
    padding: 3px;
    margin-top: 5px;
    margin-bottom: 5px;
    border-radius: 2px;
  }
  .node-row {
    margin-bottom: 5px;
    column-gap: 2px;
    margin-top: 3px;
    display: grid;
    grid-auto-columns: minmax(0, 1fr);
    grid-auto-flow: column;
  }
  .row.mobile{
    margin-bottom: 0 !important;
  }
</style>
