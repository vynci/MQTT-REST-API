var Hapi = require('hapi');
var mqtt = require('mqtt');

var server = new Hapi.Server();
server.connection({ port: 4444, routes: { cors: true } });

var client  = mqtt.connect('mqtt://localhost:1883');

var mqttPublish = function(topic, msg){
  client.publish(topic, msg, function() {
    console.log('msg sent: ' + msg);
  });
}

server.route([
  {
    method: 'POST',
    path: '/device/control',
    handler: function (request, reply) {
      var deviceInfo = 'dev' + request.payload.deviceNum + '-' + request.payload.command;
      reply(deviceInfo);
      mqttPublish('device/control', deviceInfo, {
        'qos' : 2
      });
    }
  }
]);

server.start();
