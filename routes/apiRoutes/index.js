const router = require('express').Router();
const animalRoutes = require('../apiRoutes/animalRoutes');
const zookeeperRoutes = require('../apiRoutes/zookeeperRoutes');

router.use(animalRoutes);
router.use(zookeeperRoutes);
// Below is what the module told us to input, but above is the final code they provided.
//router.use(require('./zookeeperRoutes'));

module.exports = router;