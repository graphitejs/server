import { describe } from 'riteway'
import { Graphite } from '../../src/index'

describe('Running Graphite', async assert => {
  const graphite = await Graphite()
  await graphite.stop()
})
