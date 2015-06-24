var Hapi = require('hapi');
var mqtt = require('mqtt');

var server = new Hapi.Server();
var port = Number(process.env.PORT || 4444);

server.connection({ port: port, routes: { cors: true } });

var client  = mqtt.connect('mqtt://test.mosquitto.org:1883');

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
