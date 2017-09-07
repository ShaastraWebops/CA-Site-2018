'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './city.events';

var CitySchema = new mongoose.Schema({
  name: String,
  workshops: [{
  	name: String,
  	count: {
  		type: Number,
  		default: 0
  	}
  }]
});

registerEvents(CitySchema);
export default mongoose.model('City', CitySchema);
