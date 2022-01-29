import { IPlayer } from './IOfficeState'

export enum RoomType {
  COLYSEUS_LOBBYROOM = 'colyseus-lobbyroom',
  LOBBY = 'lobby',
  PUBLIC = 'skyoffice',
  OFFICE = 'office',
}

export type PartialPlayer = Pick<IPlayer, 'webRTCId' | 'readyToConnect' | 'videoConnected'> &
  Partial<IPlayer>

export interface IRoomData {
  roomNumber?: string | null
  name?: string
  description?: string
  teamMessage?: string
  password?: string | null
  socialType?: string
  socialLink?: string
  websiteLink?: string
  player?: PartialPlayer
}
