module.exports = (sequelize, Sequelize) => {
	const Travel_zone = sequelize.define('travel_zone', {
	  zone_name: {
		  type: Sequelize.STRING
	  },
	  zone_city: {
		  type: Sequelize.STRING
	  },
	  zone_state: {
		  type: Sequelize.STRING
	  },
	  zone_group: {
		  type: Sequelize.STRING
	  },
	  zone_price: {
		  type: Sequelize.STRING
	  }
	});
	
	return Travel_zone;
}