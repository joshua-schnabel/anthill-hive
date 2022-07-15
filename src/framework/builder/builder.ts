import Repo from "#domain/repo/repo.entity";
import { reflect } from "typescript-rtti";

export type IBuilder<T> = {
  [k in keyof T]-?: (arg: T[k]) => IBuilder<T>
}
& {
  build(): T;
};

type Clazz<T> = new(...args: unknown[]) => T;

type Constructor<Params extends readonly any[] = readonly any[], Result = any> =  new (...params: Params) => Result;

export function Builder<Type> (type: Constructor): IBuilder<Type> {
  console.log(reflect(type).class.prototype);
  const builder = new Proxy(
    {},
    {}
  );

  return builder as IBuilder<Type>;
}

const builder = Builder<Repo>(Repo);
builder.name("").build();