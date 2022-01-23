import React, { useState } from 'react'
import styled from 'styled-components'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

import config from '../config.json'
import { IRoomData } from '../../../types/Rooms'

import network from '../services/Network'
import phaserGame from '../PhaserGame'
import Bootstrap from '../scenes/Bootstrap'

const StyledDialog = styled(Dialog)`
  .dialog-title {
    color: white;
    padding: 20px 0;
  }

  .MuiDialog-paper {
    padding: 0 20px;
    overflow: visible;
    background: #222639;
    border-radius: 12px;
  }
`

const CreateRoomFormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  width: 450px;
  gap: 20px;
`

export const CreateRoomForm = ({ open, roomNumber, colorTheme, handleClose }) => {
  const [values, setValues] = useState<IRoomData>({
    roomNumber: null,
    name: '',
    description: '',
    password: null,
    autoDispose: true,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [nameFieldEmpty, setNameFieldEmpty] = useState(false)
  const [descriptionFieldEmpty, setDescriptionFieldEmpty] = useState(false)

  const handleChange = (prop: keyof IRoomData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const isValidName = values.name !== ''
    const isValidDescription = values.description !== ''

    if (isValidName === nameFieldEmpty) setNameFieldEmpty(!nameFieldEmpty)
    if (isValidDescription === descriptionFieldEmpty)
      setDescriptionFieldEmpty(!descriptionFieldEmpty)

    // create custom room if name and description are not empty
    // if (isValidName && isValidDescription) {
    //   const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
    //   network
    //     .createCustom(values)
    //     .then(() => bootstrap.launchGame())
    //     .catch((error) => console.error(error))
    // }
  }

  return (
    <StyledDialog open={open} onClose={handleClose}>
      <Avatar
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 64,
          height: 64,
          border: '2px solid #222639',
          background: colorTheme,
          fontSize: 24,
        }}
        className="avatar"
      >
        {roomNumber}
      </Avatar>
      <DialogTitle className="dialog-title">{`Office ${roomNumber}`}</DialogTitle>
      <Divider />
      <DialogContent>
        <CreateRoomFormWrapper onSubmit={handleSubmit}>
          <TextField
            label="Team name"
            color="primary"
            error={nameFieldEmpty}
            helperText={'Name is required'}
            onChange={handleChange('name')}
            // sx={{ background: '#e5e5e5', border: '1px solid grey', color: 'black' }}
          />

          <TextField
            hiddenLabel
            variant="filled"
            color="secondary"
            error={descriptionFieldEmpty}
            helperText={descriptionFieldEmpty && 'Description is required'}
            multiline
            rows={4}
            onChange={handleChange('description')}
          />

          <TextField
            type={showPassword ? 'text' : 'password'}
            label="Password (optional)"
            onChange={handleChange('password')}
            color="secondary"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button variant="contained" color="secondary" type="submit">
            Create
          </Button>
        </CreateRoomFormWrapper>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Disagree</Button>
        <Button onClick={handleClose} autoFocus>
          Agree
        </Button>
      </DialogActions>
    </StyledDialog>
  )
}
