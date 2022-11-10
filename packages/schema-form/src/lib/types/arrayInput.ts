export interface IArrayInputValue {
  label: string | null
  value: string | number | null
  mark: EArrayInputMark
}

export enum EArrayInputMark {
  equal = "=",
  NotEqual = "!=",
  MatchRegexp = "=~",
  MatchNotRegexp = "!~"
}
