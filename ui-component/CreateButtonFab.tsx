import { Fab } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import React from 'react'

const CreateButtonFab: React.FC<{
    onClick: any
}> = ({ onClick }) => (
    <Fab
        id="addBtn"
        onClick={onClick}
        size="medium"
        color="secondary"
        aria-label="add"
        style={{ position: 'fixed', bottom: 20, right: 10, zIndex: 99, color: '#fff' }}
    >
        <AddIcon />
    </Fab>
)

export default CreateButtonFab
