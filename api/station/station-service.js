const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')
const logger = require('../../services/logger.service')

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('station')
        var stations = await collection.find(criteria).toArray()
        stations = stations.map(station => {

            return station
        })
        return stations
    } catch (err) {
        logger.error('cannot find stations', err)
        throw err
    }

}

async function getById(stationId) {
    try {
        const collection = await dbService.getCollection('station')
        const station = await collection.findOne({ '_id': ObjectId(stationId) })
        return station
    } catch (err) {
        logger.error(`while finding station ${stationId}`, err)
        throw err
    }
}

async function remove(stationId) {
    try {
        const collection = await dbService.getCollection('station')
        await collection.deleteOne({ '_id': ObjectId(stationId) })
    } catch (err) {
        logger.error(`cannot remove station ${stationId}`, err)
        throw err
    }
}


async function add(station) {
    try {
        // peek only updatable fields!
        const stationToAdd = {
            name: station.name,
            description: station.description,
            createdBy: station.createdBy,
            songs: [],
            createdAt: Date.now(),
            imgUrl: station.imgUrl || '',
            tags: station.tags || []
        }
        const collection = await dbService.getCollection('station')
        await collection.insertOne(stationToAdd)
        return stationToAdd;
    } catch (err) {
        logger.error('cannot add station', err)
        throw err
    }
}

async function update(station) {
    try {
        // peek only updatable fields!
        const stationToSave = {
            _id: ObjectId(station._id),
            name: station.name,
            description: station.description,
            createdBy: station.createdBy,
            songs: station.songs || [],
            createdAt: station.createdAt,
            imgUrl: station.imgUrl || '',
            tags: station.tags || []
        }
        const collection = await dbService.getCollection('station')
        await collection.updateOne({ '_id': stationToSave._id }, { $set: stationToSave })
        return stationToSave;
    } catch (err) {
        logger.error(`cannot update station ${station._id}`, err)
        throw err
    }

}

async function addSong(stationId, song) {
    const collection = await dbService.getCollection('station');
    return collection.update({ '_id': ObjectId(stationId) }, { $push: { 'songs': song } });
}
async function removeSong(stationId, song) {
    const collection = await dbService.getCollection('station');
    return collection.update({ '_id': ObjectId(stationId) }, { $pull: { 'songs': song } });
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.name) {
        const nameCriteria = { $regex: filterBy.name, $options: 'i' }
        console.log(nameCriteria, 'criteria');
        criteria.name = nameCriteria;

    }
    if (filterBy.tag !== 'All') {
        const tagCriteria = (filterBy.tag);
        criteria.tag = tagCriteria;
    }
    return criteria
}

module.exports = {
    query,
    getById,
    remove,
    add,
    update,
    addSong

}