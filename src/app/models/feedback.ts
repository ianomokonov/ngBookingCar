import { Car } from './car';

export interface Feedback{
    userName: string;
    raiting: number;
    car: Car;
    message: string;
    date: Date;
}