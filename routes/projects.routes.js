const router = require('express').Router();
const ctrl = require('../controllers/projects.controller');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.updateById);
router.delete('/:id', ctrl.removeById);
router.delete('/', ctrl.removeAll);

module.exports = router;
