import React from 'react'
import { renderToString } from 'react-dom/server'
import { toArray } from 'rxjs/operators'
// import { isStateTreeNode, getSnapshot } from 'mobx-state-tree'

export function fog() {}

// // given an object of things that might be MST models, snapshots any of them
// // that are not already snapshots
// function ensureSnapshots(things) {
//   const data = {}
//   Object.entries(things).forEach(([key, value]) => {
//     if (isStateTreeNode(value)) {
//       data[key] = getSnapshot(value)
//     } else {
//       data[key] = value
//     }
//   })
//   return data
// }

export async function renderRegion(
  pluginManager,
  { region, adapterType, adapterConfig, renderType, renderProps },
) {
  const dataAdapterType = pluginManager.getDataAdapterType(adapterType)
  if (!dataAdapterType)
    throw new Error(`unknown data adapter type ${adapterType}`)
  const dataAdapter = new dataAdapterType.AdapterClass(adapterConfig)
  const features = await dataAdapter
    .getFeaturesInRegion(region)
    .pipe(toArray())
    .toPromise()

  const RendererComponent = pluginManager.getRendererType(renderType)
    .ReactComponent
  const html = renderToString(
    <RendererComponent data={features} {...renderProps} />,
  )

  return { features, html }
}