module.exports = (sequelize, Sequelize) => {
	const Travel_order = sequelize.define('travel_order', {
	  origin_name: {
		  type: Sequelize.STRING
	  },
	  destination_name: {
		  type: Sequelize.STRING
	  },
	  price: {
		  type: Sequelize.STRING
	  },
	  distance: {
		  type: Sequelize.STRING
	  },
	  duration: {
		  type: Sequelize.STRING
	  },
	  passenger_id: {
		  type: Sequelize.STRING
	  },
	  driver_id: {
		  type: Sequelize.STRING
	  },
    payment_type: {
		  type: Sequelize.STRING
	  },
    finish: {
		  type: Sequelize.STRING
	  }
	});
	
	return Travel_order;
}