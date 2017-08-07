import React from 'react';
import {
  IconButton,
  FABButton,
  Menu,
  MenuItem
} from 'react-mdl';
import { clone } from 'ramda'

const SliderModel = ({ model, editMode, updateUser }) => {
  const _model = clone(model)

  return (<div
    style={{
      flex: 1,
      position: 'relative',
      // width: '50vw',
      height: '40vh',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >

    <img
      alt="model thumb"
      src="http://lorempixel.com/640/480"
      style={{
        flex: 1,
        // position: 'absolute',
        height: '100%',
        width: 'auto',
        // width: '35vw'
      }}
    />
    <div
      style={{
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}
    >
      <strong>{_model.name}</strong>
      <div style={{ display: 'flex' }}>
        <FABButton ripple>
          <i className="fa fa-external-link" />
        </FABButton>
        <FABButton ripple>
          <i className="fa fa-star-o" />
        </FABButton>
        {editMode && <FABButton
          onClick={() => updateUser({ target: { value: undefined } })}
          ripple
          accent
        >
          <i className="fa fa-times" />
        </FABButton>}
      </div>
    </div>

    {_model.desc && (<div
      style={{
        width: '100%',
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}
    >
      {_model.desc}
    </div>)}
  </div>)
}


SliderModel.propTypes = {
  model: React.PropTypes.object.isRequired,
  editMode: React.PropTypes.bool,
}

SliderModel.defaultProps = {
  editMode: false
}

export default SliderModel
