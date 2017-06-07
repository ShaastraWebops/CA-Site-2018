'use strict';

import {Router} from 'express';
import * as controller from './task.controller';
import * as auth from '../../auth/auth.service';


var router = new Router();

router.post('/create', auth.hasRole('admin'), controller.create);
router.get('/gettasks', auth.isAuthenticated(), controller.gettasks);
router.put('/apply/:id', auth.isAuthenticated(), controller.apply);

module.exports = router;
