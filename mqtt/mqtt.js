const mqtt = require("mqtt");

class MqttHandler {
  constructor(port) {
    this.mqttClient = null;
    this.host = `tcp:localhost:1883`;
  }

  connect() {
    // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
    this.mqttClient = mqtt.connect(this.host);

    // Mqtt error calback
    this.mqttClient.on("error", (err) => {
      console.log(err);
      this.mqttClient.end();
    });

    // Connection callback
    this.mqttClient.on("connect", () => {
      console.log(`mqtt client connected`);
    });

    // When a message arrives, console.log it
    this.mqttClient.on("message", function (topic, message) {
      console.log(topic.toString(), message.toString());
      // function is working other logging needs to be handled.
    });

    this.mqttClient.on("close", () => {
      console.log(`mqtt client disconnected`);
    });
  }

  // Sends a mqtt message to topic: mytopic
  sendMessage(topic, message) {
    this.mqttClient.publish(topic, message);
  }
}

module.exports = MqttHandler;
