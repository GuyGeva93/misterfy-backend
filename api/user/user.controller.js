const userService = require('./user.service')
const socketService = require('../../services/socket.service')
const logger = require('../../services/logger.service')


async function getUsers(req, res) {
    try {
        const filterBy = {
            // txt: req.query.txt || '',
            // minBalance: +req.query.minBalance || 0
        }
        const users = await userService.query()
        res.send(users)
    } catch (err) {
        logger.error('Failed to get users', err)
        res.status(500).send({ err: 'Failed to get users' })
    }
}

async function getUser(req, res) {
    try {
        console.log('this is',req.params);
        const user = await userService.getById(req.params.id)
        res.send(user)
    } catch (err) {
        logger.error('Failed to get user', err)
        res.status(500).send({ err: 'Failed to get user' })
    }
}
async function addUser(req, res) {
    try {
        const user = req.body;
        const savedUser = await userService.add(user)
        res.send(savedUser)
        socketService.broadcast({ type: 'user-added', to: savedUser._id })
    } catch (err) {
        logger.error('Failed to add user', err)
        res.status(500).send({ err: 'Failed to add user' })
    }
}

async function deleteUser(req, res) {
    try {
        await userService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete user', err)
        res.status(500).send({ err: 'Failed to delete user' })
    }
}

async function updateUser(req, res) {
    try {
        const user = req.body
        const savedUser = await userService.update(user)
        res.send(savedUser)
        socketService.broadcast({ type: 'user-updated', to: savedUser._id })
    } catch (err) {
        logger.error('Failed to update user', err)
        res.status(500).send({ err: 'Failed to update user' })
    }
}

module.exports = {
    getUsers,
    getUser,
    deleteUser,
    addUser,
    updateUser
}