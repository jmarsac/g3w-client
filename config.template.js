const PROTOCOL = 'http';
const HOST = '127.0.0.1';
const PROXY_PORT = '8001';
const LOCAL_PORT = '3000';
const G3W_ADMIN_MEDIA_PUBLIC_FOLDER = '/media'; // change g3w-admin media public folder (default is /media)

const conf = {
  assetsFolder: './assets', //template folder of template repository
  pluginsFolder: './src/plugins', // plugins folder of app plugins
  distFolder: './dist', // G3W-CLIENT main dist folder
  clientFolder: './dist/client', // G3W-CLIENT client dist folder where are compiled
  localServerPort: LOCAL_PORT, // port for local server. If not set local server run on port 3000
  g3w_admin_paths: {
    dev: {
      g3w_admin_plugins_basepath: '<RELATIVE PATH OF G3W-ADMIN-INSTALLATION>/g3w-admin/g3w-admin/', // local G3W-ADMIN main path code
      g3w_admin_client_dest_static: '<RELATIVE PATH OF G3W-ADMIN-INSTALLATION>/g3w-admin/g3w-admin/client/static', // local G3W-ADMIN client static path
      g3w_admin_client_dest_template: '<RELATIVE PATH OF G3W-ADMIN-INSTALLATION>/g3w-admin/g3w-admin/client/templates', // local G3W-ADMIN client template folder
    }
  },
  host: HOST,
  localServerPort: LOCAL_PORT, // port for local server. If not set local server run on port 3000
  // proxy configurazion for local server
  proxy: {
    host: HOST,
    url: `${PROTOCOL}://${HOST}:${PROXY_PORT}/`, // local G3W_ADMIN server and port (where G3W-ADIMN is running)
    urls: [G3W_ADMIN_MEDIA_PUBLIC_FOLDER , '/api','/ows', '/static', '/en/', '/it/', '/upload/'] // urls to proxy referred to G3W-ADMIN
  },
  test: {
    path: '/test/config/groups/'
  }
};

module.exports = conf;
