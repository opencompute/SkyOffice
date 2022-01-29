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
import DialogContent from '@mui/material/DialogContent'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import FormHelperText from '@mui/material/FormHelperText'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'

import config from '../config.json'
import { IRoomData } from '../../../types/Rooms'

import network from '../services/Network'
import phaserGame from '../PhaserGame'
import Bootstrap from '../scenes/Bootstrap'

import { socials } from './OfficeDeskDialogs'

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    /* padding: 0 40px; */
    overflow: visible;
    background: #222639;
    border-radius: 12px;
    width: 720px;
    max-height: 80%;
    max-width: 80%;
  }

  .avatar {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 64px;
    height: 64px;
    border: 2px solid #222639;
    font-size: 24px;
  }

  .dialog-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 60px;
  }

  .dialog-content {
    padding: 15px 60px 30px 60px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .section-divider {
    margin-top: 15px;
  }
`

const ButtonGroupWrapper = styled.div`
  display: flex;
  gap: 10px;
  height: 36px;
`

const Title = styled.h1`
  color: white;
  margin: 0;
  font-size: 24px;
`

const Description = styled.p`
  color: #9b9b9b;
  margin: 0px;
  font-size: 14px;
`

const TextFieldLabel = styled.p`
  color: white;
  margin: 0;
  font-size: 16px;
`

export const CreateRoomForm = ({ open, roomNumber, colorTheme, handleFormClose }) => {
  const [values, setValues] = useState<IRoomData>({
    roomNumber,
    name: '',
    description: '',
    teamMessage: '',
    password: null,
    socialType: '',
    socialLink: '',
    websiteLink: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [nameFieldEmpty, setNameFieldEmpty] = useState(false)
  const [descriptionFieldEmpty, setDescriptionFieldEmpty] = useState(false)
  const [socialTypeEmpty, setSocialTypeEmpty] = useState(false)
  const [socialLinkEmpty, setSocialLinkEmpty] = useState(false)

  const handleChange =
    (prop: keyof IRoomData) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
      setValues({ ...values, [prop]: event.target.value })
    }

  const handleSubmit = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault()
    const isValidName = values.name !== ''
    const isValidDescription = values.description !== ''
    const isValidSocialType = values.socialType !== ''
    const isValidSocialLink = values.socialLink !== ''

    if (isValidName === nameFieldEmpty) setNameFieldEmpty(!nameFieldEmpty)
    if (isValidDescription === descriptionFieldEmpty)
      setDescriptionFieldEmpty(!descriptionFieldEmpty)

    setSocialLinkEmpty(false)
    setSocialTypeEmpty(false)
    // if only social type or social link has value, show error on the value-missing one
    if (isValidSocialType !== isValidSocialLink)
      isValidSocialType ? setSocialLinkEmpty(true) : setSocialTypeEmpty(true)

    // create custom room if name and description are not empty
    // if (isValidName && isValidDescription) {
    //   const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
    //   network
    //     .createCustom(values)
    //     .then(() => bootstrap.launchGame())
    //     .catch((error) => console.error(error))
    // }
  }

  const handleClose = () => {
    setNameFieldEmpty(false)
    setDescriptionFieldEmpty(false)
    handleFormClose()
  }

  return (
    <StyledDialog open={open} onClose={handleClose}>
      <Avatar className="avatar" style={{ background: colorTheme }}>
        {roomNumber}
      </Avatar>
      <Title className="dialog-title">
        Register space{' '}
        <ButtonGroupWrapper>
          <Button variant="outlined" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="secondary" onClick={handleSubmit}>
            Register
          </Button>
        </ButtonGroupWrapper>
      </Title>
      <Divider />

      <DialogContent className="dialog-content">
        <div>
          <Title>About your team</Title>
          <Description>These will be publicly displayed in the lobby area</Description>
        </div>
        <TextFieldLabel>Name</TextFieldLabel>
        <TextField
          hiddenLabel
          variant="filled"
          color="secondary"
          error={nameFieldEmpty}
          placeholder="SkyOffice"
          helperText={nameFieldEmpty && 'Name is required'}
          defaultValue={values.name}
          onChange={handleChange('name')}
        />

        <TextFieldLabel>Public message</TextFieldLabel>
        <TextField
          hiddenLabel
          variant="filled"
          color="secondary"
          error={descriptionFieldEmpty}
          helperText={descriptionFieldEmpty && 'Public message is required'}
          placeholder="Hi👋 We are working on... Feel free to leave a message about... or come upstairs to discuss..."
          defaultValue={values.description}
          multiline
          rows={2}
          onChange={handleChange('description')}
        />
        <TextFieldLabel>Social link (optional)</TextFieldLabel>
        <div style={{ display: 'flex', gap: 20 }}>
          <FormControl variant="filled" sx={{ width: 120 }}>
            <InputLabel color="secondary">Social</InputLabel>
            <Select
              value={values.socialType}
              color="secondary"
              onChange={handleChange('socialType')}
              error={socialTypeEmpty}
            >
              <MenuItem value="" color="secondary">
                <em>None</em>
              </MenuItem>
              {socials.map((social) => {
                const { name, icon } = social
                return (
                  <MenuItem value={name} color="secondary" key={name}>
                    <img src={icon} alt={name} />
                  </MenuItem>
                )
              })}
            </Select>
            {socialTypeEmpty && <FormHelperText error>required</FormHelperText>}
          </FormControl>
          <TextField
            hiddenLabel
            fullWidth
            variant="filled"
            color="secondary"
            error={socialLinkEmpty}
            placeholder="Full url (e.g., https://twitter.com/SkyOfficeApp)"
            defaultValue={values.socialLink}
            helperText={socialLinkEmpty && 'Social link url is required'}
            onChange={handleChange('socialLink')}
          />
        </div>
        <TextFieldLabel>Website link (optional)</TextFieldLabel>
        <TextField
          hiddenLabel
          variant="filled"
          color="secondary"
          placeholder="Full url (e.g., https://skyoffice.app)"
          defaultValue={values.websiteLink}
          onChange={handleChange('websiteLink')}
        />

        <Divider className="section-divider" />
        <div>
          <Title>Words to your team</Title>
          <Description>
            This will be displayed to visitors/team members upon entering the office space
          </Description>
        </div>
        <TextFieldLabel>Team message (optional)</TextFieldLabel>
        <TextField
          hiddenLabel
          variant="filled"
          color="secondary"
          placeholder="Welcome👋 today's tasks are... Meeting time is at..."
          defaultValue={values.teamMessage}
          multiline
          rows={4}
          onChange={handleChange('teamMessage')}
        />

        <Divider className="section-divider" />
        <Title>Settings</Title>
        <TextFieldLabel>Password (optional)</TextFieldLabel>
        <TextField
          type={showPassword ? 'text' : 'password'}
          hiddenLabel
          fullWidth
          variant="filled"
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
        <Description>
          Your office space upstairs will be open to public if no password is provided
        </Description>
      </DialogContent>
    </StyledDialog>
  )
}
