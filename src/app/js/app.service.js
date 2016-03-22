/*library inherit tools */
var inherit = require('g3w/core/utils').inherit;
//ogetto contiene metodi di setup, getLayerStore, getLayersTree
var projectsRegistry = require('g3w/core/projectsregistry');
window.projectsRegistry = projectsRegistry;

function service(){
  var self = this;
  this.title = "G3W Client";
  this.config = null;
  this.projectConfig = null;
  this.setup = function(config){
    this.config = config;
    //una volta che la configurazione e' stata terminata (evento loadend) emesso
    //dall'oggetto layersRegistry dopo aver trminato il setup
    projectsRegistry.once('loaded',function(){
      self.emit('ready');
    });
    //inizializza la configurazione basata sul gruppo di progetti
    //una volta caricato il file di configurazione emette l'evento loadend
    projectsRegistry.setup(config);
  };
}
//lo fa diventare un oggetto emitter
inherit(service,EventEmitter);

setTimeout(function(){
  projectsRegistry.setCurrentProject('qdjango:open_data_firenze_2');
},2000);

/*setTimeout(function(){
  projectsRegistry.setCurrentProject('qdjango:open_data_firenze');
},5000);*/

module.exports = new service();
