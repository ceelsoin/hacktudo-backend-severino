const db = require('../config/db.config.js');
var distance = require("map-distance");
const User = db.user;
const Role = db.role;
const Travel_zone = db.travel_zone;
const Travel_order = db.travel_order;


exports.quoteTravel = (req, res) => {
	const googleMapsClient = require('@google/maps').createClient({
		key: 'AIzaSyBaDp249uF5tqMOj0PNLQKpmyEr-bCiatY',
		Promise: Promise
	});

	async function CalcPrice(origin, destination, distance) {
		return (parseFloat(origin) + parseFloat(destination) / 2) * parseFloat(distance) / 100000;
	}

	async function getMapsAPI(o, d) {
		const mapObject = {
			origin: {
				name: '',
				bairro: '',
				cidade: '',
				zona: ''
			},
			destination: {
				name: '',
				bairro: '',
				cidade: '',
				zona: ''
			},
			price: {
				value: ''
			},
		}


		mapObject.origin.name = o;
		mapObject.destination.name = d;

		await googleMapsClient.geocode({
				address: o
			})
			.asPromise()
			.then((response) => {
				mapObject.origin.bairro = response.json.results[0].address_components[2]
				mapObject.origin.cidade = response.json.results[0].address_components[3];
			})
			.catch((err) => {
				console.log(err);
				res.status(500).send({
					status: false,
					msg: err
				});
			});

		await googleMapsClient.geocode({
				address: d
			})
			.asPromise()
			.then((response) => {
				mapObject.destination.bairro = response.json.results[0].address_components[2];
				mapObject.destination.cidade = response.json.results[0].address_components[3];
			})
			.catch((err) => {
				console.log(err);
				res.status(500).send({
					status: false,
					msg: err
				});
			});

		await googleMapsClient.distanceMatrix({
				origins: o,
				destinations: d,
				mode: 'driving'
			})
			.asPromise()
			.then((response) => {
				mapObject.route = response.json.rows[0].elements;
				console.log(response.json.rows)
			})
			.catch((err) => {
				console.log(err);
				res.status(500).send({
					status: false,
					msg: err
				});
			});

		/////////   
		await Travel_zone.findAll({
			where: {
				zone_name: mapObject.origin.bairro.long_name,
				zone_city: mapObject.origin.cidade.long_name
			}
		}).then(zones => {
			mapObject.origin.zona = zones;
		})

		await Travel_zone.findAll({
			where: {
				zone_name: mapObject.destination.bairro.long_name,
				zone_city: mapObject.origin.cidade.long_name
			}
		}).then(zones => {
			mapObject.destination.zona = zones;
		})

		mapObject.price.value = await CalcPrice(mapObject.origin.zona[0].zone_price, mapObject.destination.zona[0].zone_price, mapObject.route[0].distance.value);
		/////////

		await res.status(200).send({
			status: true,
			msg: mapObject
		});

	}
	getMapsAPI(req.body.origin, req.body.destination);
}


///////////////////////////////////////////////////////////////Zones
exports.travelCreateZone = (req, res) => {
	//Travel_zone.sync({force: true});
	Travel_zone.create({
		zone_name: req.body.zone_name,
		zone_city: req.body.zone_city,
		zone_state: req.body.zone_state,
		zone_group: req.body.zone_group,
		zone_price: req.body.zone_price
	})
	res.send({
		status: true,
		msg: "Zone registered successfully!"
	});
}

exports.travelGetZone = (req, res) => {
	Travel_zone.findAll().then(zones => {
		res.send({
			status: true,
			zones: zones
		});
	})
}

exports.travelGetZoneByID = (req, res) => {
	Travel_zone.findByPk(req.params.id).then(zones => {
		res.send({
			status: true,
			zones: zones
		});
	})
}

exports.travelDeleteZoneByID = (req, res) => {
	Travel_zone.destroy({
		where: {
			id: req.params.id
		}
	});
	res.send({
		status: true,
		msg: "Zone deleted successfully!"
	});
}
///////////////////////////////////////////////////////////////Orders
exports.travelOrder = (req, res) => {
	//Travel_order.sync({force: true});
	Travel_order.create({
		origin_name: req.body.origin_name,
		destination_name: req.body.destination_name,
		price: req.body.price,
		distance: req.body.distance,
		duration: req.body.duration,
		passenger_id: req.body.passenger_id,
    driver_id: req.body.driver_id,
		payment_type: req.body.payment_type,
    finish: req.body.finish
	})
	res.send({
		status: true,
		msg: "Travel Order registered successfully!"
	});
}

exports.travelGetOrder = (req, res) => {
	Travel_order.findByPk(req.params.id).then(order => {
		res.send({
			status: true,
			order: order
		});
	})
}

exports.travelOrderUpdate = (req, res) => {
		Travel_order.findByPk(req.params.id).then(order => {
      if(req.body.driver_id != order.driver_id){ 
					Travel_order.update({
						driver_id: req.body.driver_id
					}, {
						where: {
							id: order.id
						}
					}); 
      }if(req.body.finish != order.finish){ 
					Travel_order.update({
						finish: req.body.finish
					}, {
						where: {
							id: order.id
						}
					}); 
      }
		res.send({
			status: true,
			msg: "Travel Order updated successfully!"
		});
	})
}
