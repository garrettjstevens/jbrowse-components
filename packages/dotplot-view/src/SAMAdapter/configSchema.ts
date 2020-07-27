import { ConfigurationSchema } from '@gmod/jbrowse-core/configuration'

export default ConfigurationSchema(
  'SAMAdapter',
  {
    assemblyNames: {
      type: 'stringArray',
      defaultValue: [],
    },
    data: {
      type: 'frozen',
      defaultValue: {},
    },
  },
  { explicitlyTyped: true },
)
