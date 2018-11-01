import { types } from 'mobx-state-tree'
import { getModelConfig, ConfigurationSchema, getConf } from './configuration'

import ModelFactory from '../RootModelFactory'
import JBrowse from '../JBrowse'
import snap1 from '../../test/root.snap.1.json'

const Model = ModelFactory(new JBrowse())
test('can fetch the config of the whole app', () => {
  const model = Model.create(snap1)
  const config = getModelConfig(model)
  expect(config.views.length).toBe(2)
})

describe('configuration schemas', () => {
  test('can make a schema with a color', () => {
    const container = types.model({
      configuration: ConfigurationSchema('Track', {
        backgroundColor: {
          description: `the track's background color`,
          type: 'color',
          defaultValue: '#eee',
        },
      }),
    })

    const model = container.create()
    expect(getConf(model, 'backgroundColor')).toBe('#eee')

    model.configuration.backgroundColor.set('function(a) { return "#"+a }')
    expect(getConf(model, 'backgroundColor', ['zonk'])).toBe('#zonk')
    expect(getConf(model, 'backgroundColor', 'bar')).toBe('#bar')
  })
})
