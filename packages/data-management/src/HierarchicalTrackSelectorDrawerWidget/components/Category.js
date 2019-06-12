import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Icon from '@material-ui/core/Icon'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { observer, PropTypes as MobxPropTypes } from 'mobx-react'
import propTypes from 'prop-types'
import React from 'react'
// eslint-disable-next-line import/no-cycle
import Contents from './Contents'

const styles = theme => ({
  expansionPanelDetails: {
    display: 'block',
    padding: '8px',
  },
  content: {
    '&$expanded': {
      margin: '8px 0',
    },
    margin: '8px 0',
  },
  root: {
    background: theme.palette.grey[300],
    '&$expanded': {
      // overrides the subclass e.g. .MuiExpansionPanelSummary-root-311.MuiExpansionPanelSummary-expanded-312
      minHeight: 0,
      margin: 0,
    },
    margin: 0,
    minHeight: 0,
    padding: '0 8px',
  },
  expanded: {},
})

function Category(props) {
  const {
    model,
    session,
    hierarchy,
    path,
    filterPredicate,
    disabled,
    connection,
    classes,
    assemblyName,
  } = props
  const pathName = path.join('|')
  const name = path[path.length - 1]

  function allFilteredTracksInCategoryPath(subPath) {
    let currentHier = hierarchy
    subPath.forEach(pathItem => {
      currentHier = currentHier.get(pathItem) || new Map()
    })
    let tracks = {}
    currentHier.forEach((contents, categoryName) => {
      if (contents.configId) {
        if (filterPredicate(contents)) tracks[contents.configId] = contents
      } else {
        tracks = {
          ...tracks,
          ...allFilteredTracksInCategoryPath(subPath.concat([categoryName])),
        }
      }
    })
    return tracks
  }

  return (
    <ExpansionPanel
      style={{ marginTop: '4px' }}
      expanded={!model.collapsed.get(pathName)}
      onChange={() => model.toggleCategory(pathName)}
    >
      <ExpansionPanelSummary
        classes={{
          root: classes.root,
          expanded: classes.expanded,
          content: classes.content,
        }}
        expandIcon={<Icon>expand_more</Icon>}
      >
        <Typography variant="button">{`${name} (${
          Object.keys(
            allFilteredTracksInCategoryPath(path, connection, assemblyName),
          ).length
        })`}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.expansionPanelDetails}>
        <Contents
          model={model}
          session={session}
          hierarchy={hierarchy}
          path={path}
          filterPredicate={filterPredicate}
          disabled={disabled}
          connection={connection}
          assemblyName={assemblyName}
        />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

Category.propTypes = {
  model: MobxPropTypes.observableObject.isRequired,
  path: propTypes.arrayOf(propTypes.string),
  filterPredicate: propTypes.func,
  disabled: propTypes.bool,
  connection: propTypes.string,
  classes: propTypes.objectOf(propTypes.string).isRequired,
}

Category.defaultProps = {
  filterPredicate: () => true,
  path: [],
  disabled: false,
  connection: '',
}

export default withStyles(styles)(observer(Category))