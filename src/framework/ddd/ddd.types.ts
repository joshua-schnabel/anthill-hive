export abstract class Entity<I extends Identifier<unknown>> {  
  public abstract get id (): I | undefined;
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export abstract class ValueObject {}
    
export abstract class Identifier<Type> {    
  public abstract get value (): Type;

}

export abstract class IdentifierGenerator<I extends Identifier<unknown>> {
    
  public abstract generate (): I;

}
  
export abstract class Aggregate<I extends Identifier<unknown>> extends Entity<I> {}

export interface ReadRepository<I extends Identifier<unknown>, A extends Aggregate<I>> {

  getAggregate(identitiy: I): A;
  getAggregates(): Array<A>;

}

export interface WriteRepository<I extends Identifier<unknown>, A extends Aggregate<I>> {

  storeAggregate(aggregate: A): A;

}

export interface DeleteRepository<I extends Identifier<unknown>, A extends Aggregate<I>> {

  deleteAggregate(aggregate: A): void;
  deleteAggregateById(identitiy: I): void;

}

export interface Repository<I extends Identifier<unknown>, A extends Aggregate<I>> extends ReadRepository<I, A>, WriteRepository<I, A>, DeleteRepository<I, A>{}