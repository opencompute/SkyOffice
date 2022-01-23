import React, { useState } from 'react'
import styled from 'styled-components'
import AddBusinessIcon from '@mui/icons-material/AddBusiness'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import ComputerIcon from '../assets/icons/Computer.png'
import WhiteboardIcon from '../assets/icons/Whiteboard.png'
import UserIcon from '../assets/icons/User.png'
import TwitterIcon from '../assets/icons/Twitter.png'
import GithubIcon from '../assets/icons/Github.png'
import MessageIcon from '../assets/icons/Messages.png'
import logo from '../assets/logo.png'
import config from '../config.json'
import { CreateRoomForm } from './CreateRoomForm'

import { useAppSelector } from '../hooks'
import phaserGame from '../PhaserGame'
import Bootstrap from '../scenes/Bootstrap'

const Wrapper = styled.div`
  display: none;
  border: 1px solid black;
  border-radius: 10px 10px 10px 0px;
  background: #ffffffe1;
  width: 160px;
  height: 90px;
  text-align: center;

  button {
    font-size: 9px;
    height: 18px;
  }

  .avatar {
    width: 18px;
    height: 18px;
    font-size: 11px;
  }

  .skyoffice-header {
    background: #93cbee75;
  }
`

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  border-radius: 10px 10px 0 0;

  .title {
    margin: 0;
  }
`

const Description = styled.div`
  padding: 0 3px;
  .number {
    color: #7e7e7e;
    font-size: 10px;
    font-weight: bold;
  }

  img {
    height: 18px;
    margin: 4px 4px 4px 1px;
  }

  p {
    font-size: 9.5px;
    color: #4b4b4b;
    line-height: 12px;
    margin: 0;
  }
`

const StatusBar = styled.div`
  background: #c6f6d5;
  color: #306160;
  font-weight: bold;
  font-size: 9px;
`

const Footer = styled.div`
  display: flex;
  gap: 5px;
  justify-content: space-between;
  padding: 5px;
  font-size: 9px;
  font-weight: bold;

  img {
    height: 18px;
    margin: 0 3px;
  }
`

const SocialLinkWrapper = styled.div`
  padding: 0 5px;
  display: flex;
`

export default function OfficeDeskDialogs() {
  const [createRoomFormOpen, setCreateRoomFormOpen] = useState(false)
  const [clickedRoomNumber, setClickedRoomNumber] = useState('')
  const [clickedRoomColor, setClickedRoomColor] = useState('')
  const isLobby = useAppSelector((state) => state.room.isLobby)

  const handleClickOpen = (roomNumber: string, roomColor: string) => {
    setClickedRoomNumber(roomNumber)
    setClickedRoomColor(roomColor)
    setCreateRoomFormOpen(true)
    const currentScene = (phaserGame.scene.keys.bootstrap as Bootstrap).currentScene
    currentScene?.disableKeys()
  }

  const handleClose = () => {
    setCreateRoomFormOpen(false)
    const currentScene = (phaserGame.scene.keys.bootstrap as Bootstrap).currentScene
    currentScene?.enableKeys()
  }

  return (
    <>
      {Object.keys(config.room).map((roomNumber, i) => {
        const colorTheme = config.room[roomNumber].colorTheme
        return (
          <Wrapper
            id={`dialog-${roomNumber}`}
            key={roomNumber}
            style={{ display: isLobby ? 'block' : 'none' }}
          >
            <Header style={{ background: colorTheme + '75' }}>
              <Avatar className="avatar" style={{ background: colorTheme }}>
                {roomNumber}
              </Avatar>
              <p className="title">Office {roomNumber}</p>
            </Header>
            <StatusBar>AVAILABLE</StatusBar>
            <Description>
              <span className="number">3</span>
              <img src={WhiteboardIcon} alt="whiteboard" />
              <span className="number">&bull; 5</span>
              <img src={ComputerIcon} alt="computer" />
              <span className="number">&bull; 5-10</span>
              <img src={UserIcon} alt="user" />
            </Description>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<AddBusinessIcon />}
              onClick={() => handleClickOpen(roomNumber, colorTheme)}
            >
              Claim the space
            </Button>
          </Wrapper>
        )
      })}
      {/* The following is the Office profile dialog for SkyOffice HQ :) */}
      <Wrapper id={`dialog-skyoffice`} style={{ display: isLobby ? 'block' : 'none' }}>
        <Header className="skyoffice-header">
          <Avatar className="avatar" alt="SkyOffice" src={logo} />
          <p className="title">SkyOffice HQ</p>
        </Header>
        <Description>
          <p>
            We are improving this place, will be around between 6-9pm EST, happy to hear any
            suggestions :)
          </p>
        </Description>
        <Footer>
          <SocialLinkWrapper>
            <a href="https://twitter.com/SkyOfficeApp" target="_blank" rel="noreferrer">
              <img src={TwitterIcon} alt="Twitter" />
            </a>
            <a href="https://github.com/kevinshen56714/SkyOffice" target="_blank" rel="noreferrer">
              <img src={GithubIcon} alt="Github" />
            </a>
          </SocialLinkWrapper>
          <Button color="primary" size="small">
            <img src={MessageIcon} alt="Message" />
            message
          </Button>
        </Footer>
      </Wrapper>
      <CreateRoomForm
        open={createRoomFormOpen}
        roomNumber={clickedRoomNumber}
        colorTheme={clickedRoomColor}
        handleClose={handleClose}
      ></CreateRoomForm>
    </>
  )
}
