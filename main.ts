const z = Symbol();

type Zero = typeof z;
type Succ<T> = { succ: T };

type One = Succ<Zero>;
type Two = Succ<One>;

type Add<X, Y> = X extends Zero
  ? Y
  : X extends { succ: unknown }
  ? { succ: Add<X["succ"], Y> }
  : never;

type Three = Add<One, Two>;
type Five = Add<Two, Three>;

type Mul<X, Y> = X extends Zero
  ? Zero
  : X extends { succ: Zero }
  ? Y
  : X extends { succ: unknown }
  ? Add<Y, Mul<X["succ"], Y>>
  : never;

type Six = Mul<Two, Three>;
type Fifteen = Mul<Three, Five>;

type Eq<A, B> = A extends B ? (B extends A ? true : false) : false;

type FizzBuzz<T> = FizzBuzzHelper<Zero, T>;

type FizzBuzzHelper<Start, End> = Eq<Start, End> extends true
  ? []
  : DivisibleBy<Start, Three> extends true
  ? DivisibleBy<Start, Five> extends true
    ? ["fizzbuzz", ...FizzBuzzHelper<Succ<Start>, End>]
    : ["fizz", ...FizzBuzzHelper<Succ<Start>, End>]
  : DivisibleBy<Start, Five> extends true
  ? ["buzz", ...FizzBuzzHelper<Succ<Start>, End>]
  : ["", ...FizzBuzzHelper<Succ<Start>, End>];

type DivisibleBy<X, Y> = X extends Zero ? true : DivisibleByHelper<X, Y>;

type DivisibleByHelper<X, Y> = X extends Zero
  ? false
  : Eq<X, Y> extends true
  ? true
  : DivisibleByHelper<Sub<X, Y>, Y>;

type Sub<X, Y> = Y extends Zero
  ? X
  : X extends Zero
  ? X
  : X extends { succ: unknown }
  ? Y extends { succ: unknown }
    ? Sub<X["succ"], Y["succ"]>
    : never
  : never;

type Result = FizzBuzz<Fifteen>;

// Tests. If any of these fails to type-check, we've got something wrong in our types.
const three: Three = { succ: { succ: { succ: z } } };
const six: Six = { succ: { succ: { succ: { succ: { succ: { succ: z } } } } } };
const fizzbuzz: FizzBuzz<Six> = ["fizzbuzz", "", "", "fizz", "", "buzz"];
