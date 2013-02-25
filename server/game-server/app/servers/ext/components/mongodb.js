/**
 * Component for mongoDB.
 */

/**
 * Component factory function
 *
 * @param  {Object} app  current application context
 * @return {Object}      component instances
 */
module.exports = function (app) {
  return new Component(app);
};

/**
* Master component class
*
* @param {Object} app  current application context
*/
var Component = function (app) {
    this.app = app;
};

var pro = Component.prototype;

/**
 * Component lifecycle function
 *
 * @param  {Function} cb
 * @return {Void}
 */
pro.start = function (cb) {
  var config   = this.app.get('pomeloext.config').mongodb,
      mongoose  = require('mongoose');
      
  this.app.mongo = mongoose.createConnection(config.host, config.database, config.port, config.options);
  cb();
};

/**
 * Component lifecycle function
 *
 * @param  {Boolean}   force whether stop the component immediately
 * @param  {Function}  cb
 * @return {Void}
 */
pro.stop = function (force, cb) {
  this.app.mongo.close();
  cb();
};
