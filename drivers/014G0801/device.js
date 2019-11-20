'use strict';

const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class DevoloRadiatorThermostat extends ZwaveDevice {

	onMeshInit() {
		this.registerCapability('measure_battery', 'BATTERY');
		this.registerCapability('target_temperature', 'THERMOSTAT_SETPOINT');

		// Since this node doesn't report the SENSOR_MULTILVEL commandclass but uses it anyway, parse it here.
		this.node.on('unknownReport', reportBuffer => {
			// TODO check the type byte in the reportBuffer
			if (reportBuffer) {
				try {
					const sensorValue = (reportBuffer.readIntBE(4, 2)) / Math.pow(10, 2);
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
