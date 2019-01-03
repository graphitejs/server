import { ObjectID } from 'mongodb'

export const Collection = (collection) => {
  const create = async(todo) => {
    const item = (await collection.insertOne(todo)).ops[0]
    return { ...item, _id: item._id.toString() }
  }

  const update = async(id, todo) => {
    const item = (await collection.findOneAndUpdate({ _id: ObjectID(id) }, { $set: todo }, { returnOriginal: false })).value
    return { ...item, _id: item._id.toString() }
  }

  const findAll = async() => {
    const items = await collection.find({}).toArray()
    return items.map(item => ({ ...item, _id: item._id.toString() }))
  }

  const findOne = async(id) => {
    const item = await collection.findOne({ _id: ObjectID(id) })
    return { ...item, _id: item._id.toString() }
  }

  const removeOne = async(id) => {
    const item = await collection.findOneAndDelete({ _id: ObjectID(id) })
    return item.value === null ? null : {  ...item.value, _id: item.value._id.toString() }
  }

  return { create, update, findAll, findOne, removeOne }
}
