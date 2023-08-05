import { v4 as uuidv4 } from "uuid";

// Classe abstrata, que será usada por outras classes
// Usamos o generic Props com tipo any, pois essa informação será passada ao herdar essa classe por outra.

export abstract class Entity<Props = any> {
  public readonly _id: string;
  public readonly props: Props;

  constructor(props: Props, id?: string) {
    this.props = props;
    this._id = id || uuidv4();
  }

  get id() {
    return this._id;
  }

  toJSON(): Required<{ id: string } & Props> {
    return {
      id: this._id,
      ...this.props,
    } as Required<{ id: string } & Props>;
  }
}
