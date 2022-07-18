import Repo, { IRepoBuider, RepoId } from "#domain/repo/repo.entity";
import { UserAssignment, UserRight } from "#domain/repo/userAssignment.entity";
import { UserId } from "#domain/user/user.entity";
import { reflect, ReflectedArrayRef, ReflectedClassRef, ReflectedUnionRef } from "typescript-rtti";

export type IBuilder<T> = {
  [k in keyof T]-?: (arg: T[k]) => IBuilder<T>
}
& {
  build(): T;
};

type Clazz<T> = new (...args: unknown[]) => T;

type Constructor<Params extends readonly any[] = readonly any[], Result = any> = new (...params: Params) => Result;

interface Foo {
  [key: string]: unknown;
}

export function Builder<Type> (type: Constructor): IBuilder<Type> {
  const parameters: { name: string; class: any }[] = [];
  const properties = new Map<string, { name: string; class: any, aggregation?: string, parameter: boolean }>();
  for (const property of reflect(type).properties) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!property.name.startsWith("_") && property.class.super !== null) {
      if (property.type instanceof ReflectedClassRef) {
        properties.set(property.name, { name: property.name, class: property.type.class, parameter: false });
      }
      else if (property.type instanceof ReflectedUnionRef) {
        properties.set(property.name, { name: property.name, class: (<ReflectedClassRef<unknown>>property.type.types.filter(t => t instanceof ReflectedClassRef)[0]).class, parameter: false });
      }
      else if (property.type instanceof ReflectedArrayRef) {
        properties.set(property.name, { name: property.name, class: (<ReflectedClassRef<unknown>>property.type.elementType).class, aggregation: "array", parameter: false });
      }
    }
  }
  for (const parameter of reflect(type).parameters) {
    const name = parameter.rawMetadata.n;
    parameters.push({ name: name, class: properties.get(parameter.name) });
    if (properties.get(name) !== undefined)
      (properties.get(name) as { parameter: boolean }).parameter = true;
  }

  const values = new Map<string, unknown>();
  const builder = new Proxy(
    {},
    {
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      get (_target, prop) {
        if (typeof prop === "string" && prop.startsWith("add")) {
          // eslint-disable-next-line @typescript-eslint/no-magic-numbers
          const tprop = prop.charAt(3).toLocaleLowerCase() + prop.substring(4);
          return (x: unknown): unknown => {
            if (properties.get(tprop)?.aggregation === "array") {
              if (!values.has(tprop))
                values.set(tprop, []);
              (values.get(tprop) as Array<unknown>).push(x);
            } else {
              values.set(tprop, x);
            }
            return builder;
          };
        } else if ("build" === prop) {
          const params: unknown[] = [];
          for (const param of parameters) {
            params.push(values.get(param.name));
          }
          const obj: Foo = new type(params);
          for (const propertyname of properties.keys()) {
            const prop = properties.get(propertyname);
            if (values.has(propertyname) && !prop?.parameter) {
              if (prop?.aggregation === "array") {
                const desc = Object.getOwnPropertyDescriptor(obj, propertyname);
                if (desc?.set === undefined) {
                  const methodeName = "add" + propertyname.charAt(0).toUpperCase() + propertyname.slice(1);
                  for (const value of (values.get(propertyname) as Array<unknown>)) {
                    (obj[methodeName] as ((t: unknown) => unknown))(value);
                  }
                } else {
                  obj[propertyname] = values.get(propertyname);
                }
              } else {
                obj[propertyname] = values.get(propertyname);
              }
            }
          }
          return () => obj;
        }

        return (x: unknown): unknown => {
          values.set(prop.toString(), x);
          return builder;
        };
      }
    }
  );

  return builder as IBuilder<Type>;
}
const ua1 = new UserAssignment(new UserId("test"), UserRight.Read);
const ua2 = new UserAssignment(new UserId("test2"), UserRight.Read);
const builder = Builder<IRepoBuider>(Repo);
const x = builder.id(new RepoId("test")).name("name").addUserAssignment(ua1).addUserAssignment(ua2).build();
console.log(x);