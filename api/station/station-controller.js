const logger = require('../../services/logger.service')
const stationService = require('../station/station-service')
    // const socketService = require('../../services/socket.service')

async function getStations(req, res) {
    try {
        const stations = await stationService.query()
        res.send(stations)
    } catch (err) {
        logger.error('Cannot get stations', err)
        res.status(500).send({ err: 'Failed to get stations' })
    }
}

async function getStation(req, res) {
    console.dir(req.params);
    try {
        const station = await stationService.getById(req.params.id)
        res.send(station)
    } catch (err) {
        logger.error('Failed to get station', err)
        res.status(500).send({ err: 'Failed to get station' })
    }
}

async function deleteStation(req, res) {
    try {
        await stationService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete station', err)
        res.status(500).send({ err: 'Failed to delete station' })
    }
}


async function addStation(req, res) {
    try {
        const station = req.body
        savedStation = await stationService.add(station)
            // socketService.broadcast({ type: 'station-added', data: savedStation })

        res.send(savedStation)

    } catch (err) {
        console.log(err)
        logger.error('Failed to add station', err)
        res.status(500).send({ err: 'Failed to add station' })
    }
}


async function updateStation(req, res) {
    try {
        const station = req.body
        const savedStation = await stationService.update(station)
        res.send(savedStation)
            // socketService.broadcast({ type: 'station-updated', data: station, to: savedStation._id })
    } catch (err) {
        logger.error('Failed to update station', err)
        res.status(500).send({ err: 'Failed to update station' })
    }
}

async function addSong(req, res) {
    try {
        const song = req.body;
        const savedStation = await stationService.addSong(req.params.id, song);
        res.send(savedStation);

    } catch (err) {
        logger.error('Failed to add a song to this station', err)
        res.status(500).send({ err: 'Failed to add a song to this station' })
    }
}
async function removeSong(req, res) {
    try {
        const song = req.body;
        const savedStation = await stationService.removeSong(req.params.id, song);
        res.send(savedStation);

    } catch (err) {
        logger.error('Failed to remove a song from this station', err)
        res.status(500).send({ err: 'Failed to remove a song from this station' })
    }
}

module.exports = {
    getStations,
    getStation,
    deleteStation,
    addStation,
    updateStation,
    addSong,
    removeSong
}