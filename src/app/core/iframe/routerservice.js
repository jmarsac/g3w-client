const { splitContextAndMethod } =require('core/utils/utils');
const GUI = require('gui/gui');

function IframePluginService(options={}) {
  //project is current project send by application service
  this.init = async function({project}={}) {
    await GUI.isReady();
    this.services = require('./services/index');
    //sett eventResponse handler to alla services
    this.eventResponseServiceHandler = ({action, response}) => {
      this.postMessage({
        id: null,
        action,
        response
      })
    }
    //initialize all service
    const serviceNames = Object.keys(this.services);
    for (let i=0; i < serviceNames.length; i++){
      const service = this.services[serviceNames[i]];
      await service.init();
      service.on('response', this.eventResponseServiceHandler);
    }
    this.postMessage({
      id:null,
      action:"app:ready",
      response: {
        result: true,
        data: {
          layers: project.state.layers.map(layer =>({
            id: layer.id,
            name: layer.name
          }))
        }
      }
    });

    if (window.addEventListener) window.addEventListener("message", this.getMessage, false);
    else window.attachEvent("onmessage", this.getMessage);
  };

  // method to post message to parent
  this.postMessage = function (message={}) {
    if (window.parent) {
      window.parent.postMessage(message, "*")
    }
  };

  // method to handle all message from window
  this.getMessage = async evt => {
    if (evt && evt.data) {
      const { id, action, data:params } = evt.data;
      console.log(params)
      const {context, method} = splitContextAndMethod(action);
      let result = false;
      let data;
      try {
        if (this.services[context].getReady()) {
          data = await this.services[context][method](params);
          result = true;
        }
      } catch(err){
        result = false;
        data = err;
      }
      this.postMessage({
        id,
        action,
        response: {
          result,
          data
        }
      })
    }
  };

  this.clear = function() {
    const serviceNames = Object.keys(this.services);
    for (let i=0; i < serviceNames.length; i++) {
      const service = this.services[serviceNames[i]];
      service.off('response', this.eventResponseServiceHandler)
    }
    if (window.removeEventListener) window.removeEventListener("message", this.getMessage, false);
    else window.detachEvent("onmessage", this.getMessage);
  }
}

module.exports = new IframePluginService;
