import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import Popper from '@material-ui/core/Popper'
import { observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  tooltip: {
    background: 'red',
  },
  popper: {
    zIndex: 1500,
    pointerEvents: 'none', // needed to avoid rapid mouseLeave/mouseEnter on popper
  },
})
function TooltipContents(props) {
  const classes = useStyles()
  const { feature } = props
  const info = feature.get('snpinfo')
  const total = info ? info[info.map(e => e.base).indexOf('total')].score : 0
  const condId = info && info.length >= 5 ? 'smallInfo' : 'info' // readjust table size to fit all
  return (
    <table className={classes.tooltip}>
      <thead>
        <tr>
          <th id={condId}>Base</th>
          <th id={condId}>Count</th>
          <th id={condId}>% of Total</th>
          <th id={condId}>Strands</th>
        </tr>
      </thead>
      <tbody>
        {(info || []).map(mismatch => {
          const { base, score, strands } = mismatch
          return (
            <tr key={base}>
              <td id={condId}>{base.toUpperCase()}</td>
              <td id={condId}>{score}</td>
              <td id={condId}>
                {base === 'total'
                  ? '---'
                  : `${Math.floor((score / total) * 100)}%`}
              </td>
              <td id={condId}>
                {base === 'total'
                  ? '---'
                  : (strands['+']
                      ? `+:${strands['+']} ${strands['-'] ? `,\t` : `\t`} `
                      : ``) + (strands['-'] ? `-:${strands['-']}` : ``)}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

TooltipContents.propTypes = {
  feature: PropTypes.shape({}).isRequired,
}

const Tooltip = observer(props => {
  const { model, mouseCoord } = props
  const { featureUnderMouse } = model
  const classes = useStyles()
  const ref = useRef()
  return (
    <>
      {ref.current && featureUnderMouse ? (
        <Popper className={classes.popper} anchorEl={ref.current} open>
          <TooltipContents
            feature={featureUnderMouse}
            offsetX={mouseCoord[0]}
          />
        </Popper>
      ) : null}
      <div
        ref={ref}
        style={{
          position: 'absolute',
          left: mouseCoord[0],
          top: mouseCoord[1],
        }}
      >
        {' '}
      </div>
    </>
  )
})

export default Tooltip
