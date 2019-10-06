declare type Bounds = {|
  +x: number,
  +y: number,
  +width: number,
  +height: number,
|}

declare type Ref<T> = {
  current: null | T
}

declare type Style = {}

declare type Selection = {|
  start: number,
  end: number,
|}
