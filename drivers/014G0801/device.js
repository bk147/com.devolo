'use strict';

const { ZwaveDevice } = require('homey-meshdriver');

class DevoloRadiatorThermostat extends ZwaveDevice {

  onMeshInit() {
    this.registerCapability('measure_battery', 'BATTERY', {
      getOpts: {
        getOnOnline: true,
      },
    });
    this.registerCapability('target_temperature', 'THERMOSTAT_SETPOINT', {
      getOpts: {
        getOnOnline: true,
      },
    });

    // Since this node doesn't report the SENSOR_MULTILVEL commandclass but uses it, parse it here.
    this.node.on('unknownReport', reportBuffer => {
      this.log('Unknowreport received', reportBuffer);
      // TODO check the type byte in the reportBuffer
      if (reportBuffer) {
        try {
          const sensorValue = (reportBuffer.readIntBE(4, 2)) / 100;
          this.setCapabilityValue('measure_temperature', sensorValue);
          this.log('Measured temperature', sensorValue);
        } catch (error) {
          this.error(error);
        }
      }
    });
  }

}

module.exports = DevoloRadiatorThermostat;
