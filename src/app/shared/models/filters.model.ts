export class FiltersObject {
  constructor(
    public price?: {from: string, to: string},
    public category?: string,
    public stock?: string
  ) {
  }
}
