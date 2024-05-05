export enum EventFormat {
  ALL = "all",
  TRAINING = "training",
  SEMINAR = "seminar",
  MASTER_CLASS = "master class",
  DEBATE = "debate",
  PARTY = "party",
  EXHIBITION = "exhibition",
  CARNIVAL = "carnival",
  CONTEST = "contest",
  PARADE = "parade",
  PICKET = "picket",
  PICNIC = "picnic",
}

export function findKeyByValue(
  value: string
): keyof typeof EventFormat | undefined {
  const keys = Object.keys(EventFormat) as (keyof typeof EventFormat)[];
  return keys.find((key) => EventFormat[key] === value);
}
