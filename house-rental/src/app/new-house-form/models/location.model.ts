export interface City {
  name: string
  districts: District[],
}


export interface District {
  name: string
  wards: Ward[]
}

export interface Ward {
  name: string
}