export default class Node {
  constructor(
    public x: number,
    public y: number,
    public id: number,
    public canBeBusstop: boolean = false,
    public isBusstop: boolean = false,
  ) {}
}
