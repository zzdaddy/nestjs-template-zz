import { SetMetadata } from '@nestjs/common';

export const Custom = (...args: string[]) => SetMetadata('custom', args);

export const setPublicRoute = () => SetMetadata('isPublicRoute', true);
