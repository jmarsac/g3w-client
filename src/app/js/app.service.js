/*library inherit tools */
var inherit = require('g3w/core/utils').inherit;
var ProjectsRegistry = require('g3w/core/projectsregistry');

function service(){
  var self = this;
  this.title = "G3W Client";
  this.config = null;
  this.projectConfig = null;
  this.setup = function(config){
    this.config = config;
    //una volta che la configurazione e' stata terminata (evento loadend) emesso
    //dall'oggetto layersRegistry dopo aver trminato il setup
    ProjectsRegistry.once('loaded',function(){
      self.emit('ready');
    });
    //inizializza la configurazione basata sul gruppo di progetti
    //una volta caricato il file di configurazione emette l'evento loadend
    ProjectsRegistry.setup(config);
  };
}
//lo fa diventare un oggetto emitter
inherit(service,EventEmitter);

setTimeout(function(){
  ProjectsRegistry.setCurrentProject('qdjango:open_data_firenze_2');
},2000);

module.exports = new service();
