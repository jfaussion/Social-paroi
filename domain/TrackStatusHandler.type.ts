export type TrackStatusHandler = {
  isCompleted: boolean
  isDisabled?: boolean
  onStatusChange: () => Promise<void>
} 