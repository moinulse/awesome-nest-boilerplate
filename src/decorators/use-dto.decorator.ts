import { type Constructor } from '../types';

// export function UseDto(dtoClass: Constructor): ClassDecorator {
//   return (ctor) => {
//     // FIXME make dtoClass function returning dto

//     if (!(<unknown>dtoClass)) {
//       throw new Error('UseDto decorator requires dtoClass');
//     }

//     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//     ctor.prototype.dtoClass = dtoClass;
//   };
// }
export function UseDto<T>(dtoClass: Constructor<T>) {
  return function decorator<C extends Constructor>(target: C): C {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!dtoClass) {
      throw new Error('UseDto decorator requires dtoClass');
    }

    // Set the dtoClass property on the prototype
    target.prototype.dtoClass = dtoClass;

    return target;
  };
}
