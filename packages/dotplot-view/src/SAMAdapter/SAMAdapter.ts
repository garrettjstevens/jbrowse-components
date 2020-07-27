import {
  BaseFeatureDataAdapter,
  BaseOptions,
} from '@gmod/jbrowse-core/data_adapters/BaseAdapter'
import { Region } from '@gmod/jbrowse-core/util/types'
import { doesIntersect2 } from '@gmod/jbrowse-core/util/range'
import { ObservableCreate } from '@gmod/jbrowse-core/util/rxjs'
import SimpleFeature, { Feature } from '@gmod/jbrowse-core/util/simpleFeature'
import { Instance } from 'mobx-state-tree'
import { readConfObject } from '@gmod/jbrowse-core/configuration'
import MyConfigSchema from './configSchema'

export default class SAMAdapter extends BaseFeatureDataAdapter {
  private assemblyNames: string[]

  private data: any

  public static capabilities = ['getFeatures', 'getRefNames']

  public constructor(config: Instance<typeof MyConfigSchema>) {
    super(config)
    const data = readConfObject(config, 'data')
    const assemblyNames = readConfObject(config, 'assemblyNames') as string[]
    console.log({ data })
    this.data = data
    this.assemblyNames = assemblyNames
  }

  async hasDataForRefName() {
    // determining this properly is basically a call to getFeatures
    // so is not really that important, and has to be true or else
    // getFeatures is never called (BaseAdapter filters it out)
    return true
  }

  async getRefNames() {
    // we cannot determine this accurately
    return []
  }

  getFeatures(region: Region, opts: BaseOptions = {}) {
    return ObservableCreate<Feature>(async observer => {
      // The index of the assembly name in the region list corresponds to
      // the adapter in the subadapters list
      // const index = this.assemblyNames.indexOf(region.assemblyName)
      // if (index !== -1) {
      //   for (let i = 0; i < pafRecords.length; i++) {
      //     const { extra, records } = pafRecords[i]
      //     if (records[index].refName === region.refName) {
      //       if (
      //         doesIntersect2(
      //           region.start,
      //           region.end,
      //           records[index].start,
      //           records[index].end,
      //         )
      //       ) {
      //         observer.next(
      //           new SimpleFeature({
      //             uniqueId: `row_${i}`,
      //             syntenyId: i,
      //             start: records[index].start,
      //             end: records[index].end,
      //             refName: records[index].refName,
      //             mate: {
      //               start: records[+!index].start,
      //               end: records[+!index].end,
      //               refName: records[+!index].refName,
      //             },
      //             ...extra,
      //           }),
      //         )
      //       }
      //     }
      //   }
      // }

      observer.complete()
    })
  }

  freeResources(/* { region } */): void {}
}
