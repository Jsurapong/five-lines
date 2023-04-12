//5.4.2 Refactoring pattern: INTRODUCE STRATEGY PATTERN
class ArrayMinimum {
  constructor(private accumulator: number) {}
  process(arr: number[]) {
    for (let i = 0; i < arr.length; i++)
      if (this.accumulator > arr[i]) this.accumulator = arr[i];
    return this.accumulator;
  }
}
class ArraySum {
  constructor(private accumulator: number) {}
  process(arr: number[]) {
    for (let i = 0; i < arr.length; i++) this.accumulator += arr[i];
    return this.accumulator;
  }
}

// 1/7 EXTRACT METHOD

class ArrayMinimum1 {
  constructor(private accumulator: number) {}
  process(arr: number[]) {
    for (let i = 0; i < arr.length; i++) {
      this.processElement(arr[i]);
    }

    return this.accumulator;
  }
  processElement(e: number) {
    if (this.accumulator > e) {
      this.accumulator = e;
    }
  }
}
class ArraySum1 {
  constructor(private accumulator: number) {}
  process(arr: number[]) {
    for (let i = 0; i < arr.length; i++) {
      this.processElement(arr[i]);
    }
    return this.accumulator;
  }
  processElement(e: number) {
    this.accumulator += e;
  }
}

// 2/7 Make new Classes
class MinimumProcessor2 {}
class SumProcessor2 {}

// 3/7 Instantiate the new classes in the constructors.
class MinimumProcessor3 {}
class SumProcessor3 {}
class ArrayMinimum3 {
  private processor: MinimumProcessor3;
  constructor(private accumulator: number) {
    this.processor = new MinimumProcessor3();
  }
  process(arr: number[]) {
    for (let i = 0; i < arr.length; i++)
      if (this.accumulator > arr[i]) {
        this.processElement(arr[i]);
      }
    return this.accumulator;
  }
  processElement(e: number) {
    if (this.accumulator > e) {
      this.accumulator = e;
    }
  }
}
class ArraySum3 {
  private processor: SumProcessor3;
  constructor(private accumulator: number) {
    this.processor = new SumProcessor3();
  }
  process(arr: number[]) {
    for (let i = 0; i < arr.length; i++) {
      this.processElement(arr[i]);
    }
    return this.accumulator;
  }
  processElement(e: number) {
    this.accumulator += e;
  }
}

// 4/7 Move the methods into MinimumProcessor and SumProcessor, respectively.
class MinimumProcessor4 {
  processElement(e: number) {
    if (this.accumulator > e) {
      this.accumulator = e;
    }
  }
}
class SumProcessor4 {
  processElement(e: number) {
    this.accumulator += e;
  }
}
class ArrayMinimum4 {
  private processor: MinimumProcessor4;
  constructor(private accumulator: number) {
    this.processor = new MinimumProcessor4();
  }
  process(arr: number[]) {
    for (let i = 0; i < arr.length; i++)
      if (this.accumulator > arr[i]) {
        this.processor.processElement(arr[i]);
      }
    return this.accumulator;
  }
}
class ArraySum4 {
  private processor: SumProcessor4;
  constructor(private accumulator: number) {
    this.processor = new SumProcessor4();
  }
  process(arr: number[]) {
    for (let i = 0; i < arr.length; i++) {
      this.processor.processElement(arr[i]);
    }
    return this.accumulator;
  }
}

// 5/7 6/7 7/7 As we depend on the accumulator field in both cases, we perform these steps:
// a : Move along the accumulator field to the MinimumProcessor and SumProces-sor classes, making accessors for them.
// b : Fix errors in the original classes by using the new accessors.
class MinimumProcessor5 {
  constructor(private accumulator: number) {}

  processElement(e: number) {
    if (this.accumulator > e) {
      this.accumulator = e;
    }
  }
  getAccumulator() {
    return this.accumulator;
  }
}
class SumProcessor5 {
  constructor(private accumulator: number) {}

  processElement(e: number) {
    this.accumulator += e;
  }
  getAccumulator() {
    return this.accumulator;
  }
}
class ArrayMinimum5 {
  private processor: MinimumProcessor5;
  constructor(private accumulator: number) {
    this.processor = new MinimumProcessor5(accumulator);
  }
  process(arr: number[]) {
    for (let i = 0; i < arr.length; i++)
      if (this.accumulator > arr[i]) {
        this.processor.processElement(arr[i]);
      }
    return this.processor.getAccumulator();
  }
}
class ArraySum5 {
  private processor: SumProcessor5;
  constructor(private accumulator: number) {
    this.processor = new SumProcessor5(accumulator);
  }
  process(arr: number[]) {
    for (let i = 0; i < arr.length; i++) {
      this.processor.processElement(arr[i]);
    }
    return this.processor.getAccumulator();
  }
}

// 5.4.3 Rule: NO INTERFACE WITH ONLY ONE IMPLEMENTATION
// 1/3  Create a new interface with the same name as the class we are extracting from.

class MinimumProcessor6 {
  constructor(private accumulator: number) {}

  processElement(e: number) {
    if (this.accumulator > e) {
      this.accumulator = e;
    }
  }
  getAccumulator() {
    return this.accumulator;
  }
}
class SumProcessor6 {
  constructor(private accumulator: number) {}

  processElement(e: number) {
    this.accumulator += e;
  }
  getAccumulator() {
    return this.accumulator;
  }
}

interface SumProcessor6 {}

class TmpName6 implements SumProcessor6 {}

// 2/3 // Compile, and go through the errors:

class MinimumProcessor7 {
  constructor(private accumulator: number) {}

  processElement(e: number) {
    if (this.accumulator > e) {
      this.accumulator = e;
    }
  }
  getAccumulator() {
    return this.accumulator;
  }
}
class SumProcessor7 {
  constructor(private accumulator: number) {}

  processElement(e: number) {
    this.accumulator += e;
  }
  getAccumulator() {
    return this.accumulator;
  }
}

interface SumProcessor7 {
  // 3/3 Otherwise, add the method that is causing the error to the interface
  processElement(e: number): void;
  getAccumulator(): number;
}

class TmpName7 implements SumProcessor7 {}

class ArrayMinimum7 {
  private processor: MinimumProcessor7;
  constructor(private accumulator: number) {
    this.processor = new TmpName7(accumulator);
  }
  process(arr: number[]) {
    for (let i = 0; i < arr.length; i++)
      if (this.accumulator > arr[i]) {
        this.processor.processElement(arr[i]);
      }
    return this.processor.getAccumulator();
  }
}
class ArraySum7 {
  private processor: SumProcessor7;
  constructor(private accumulator: number) {
    this.processor = new TmpName7(accumulator);
  }
  process(arr: number[]) {
    for (let i = 0; i < arr.length; i++) {
      this.processor.processElement(arr[i]);
    }
    return this.processor.getAccumulator();
  }
}

// 4/3 end

// rename SumProcessor8 => ElementProcessor
interface ElementProcessor8 {
  processElement(e: number): void;
  getAccumulator(): number;
}

class MinimumProcessor8 implements ElementProcessor8 {
  constructor(private accumulator: number) {}

  processElement(e: number) {
    if (this.accumulator > e) {
      this.accumulator = e;
    }
  }
  getAccumulator() {
    return this.accumulator;
  }
}
class SumProcessor8 implements ElementProcessor8 {
  constructor(private accumulator: number) {}

  processElement(e: number) {
    this.accumulator += e;
  }
  getAccumulator() {
    return this.accumulator;
  }
}

class ArrayMinimum8 {
  private processor: MinimumProcessor8;
  constructor(private accumulator: number) {
    this.processor = new MinimumProcessor8(accumulator);
  }
  process(arr: number[]) {
    for (let i = 0; i < arr.length; i++)
      if (this.accumulator > arr[i]) {
        this.processor.processElement(arr[i]);
      }
    return this.processor.getAccumulator();
  }
}
class ArraySum8 {
  private processor: SumProcessor8;
  constructor(private accumulator: number) {
    this.processor = new SumProcessor8(accumulator);
  }
  process(arr: number[]) {
    for (let i = 0; i < arr.length; i++) {
      this.processor.processElement(arr[i]);
    }
    return this.processor.getAccumulator();
  }
}

let a = new ArraySum8(9);
